import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../component/adminstaff/Sidebar";
import { auth } from "../../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import ChatWindow from "../Messages";
import { FaArrowLeft, FaSearch, FaUserCircle, FaCommentSlash, FaHistory, FaInbox, FaClock, FaCheckDouble, FaTimesCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminConversations = () => {
  // Toggle State: 'active' or 'history'
  const [viewMode, setViewMode] = useState('active');

  const [conversations, setConversations] = useState([]);
  const [historyConversations, setHistoryConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // For History View, we pass the full object
  const [selectedArchivedData, setSelectedArchivedData] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get Current Admin ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // 1. Fetch ACTIVE Approved Conversations
  useEffect(() => {
    const convRef = collection(db, "conversations");
    const qApproved = query(convRef, where("status", "==", "approved"));

    const unsubscribe = onSnapshot(qApproved, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch HISTORY (Archived) Conversations
  useEffect(() => {
    const archiveRef = collection(db, "archived_conversations");
    const qHistory = query(archiveRef, orderBy("archivedAt", "desc")); // Show newest ended first

    const unsubscribe = onSnapshot(qHistory, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistoryConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  // --- NEW: Handle End Conversation ---
  const handleEndConversation = async () => {
    if (!selectedConversationId) return;

    const confirmEnd = window.confirm("Are you sure you want to end this conversation? It will be moved to history.");
    if (!confirmEnd) return;

    try {
      // 1. Get Reference to the Active Conversation
      const convRef = doc(db, "conversations", selectedConversationId);
      const convSnap = await getDoc(convRef);

      if (!convSnap.exists()) {
        toast.error("Conversation not found.");
        return;
      }

      const convData = convSnap.data();

      // 2. Fetch all messages from the subcollection
      const messagesRef = collection(db, "conversations", selectedConversationId, "messages");
      const messagesSnap = await getDocs(query(messagesRef, orderBy("timestamp", "asc")));
      const messages = messagesSnap.docs.map(doc => doc.data());

      // 3. Calculate Duration (Optional approximation)
      let durationStr = "N/A";
      if (convData.createdAt) {
        const start = convData.createdAt.toDate();
        const end = new Date();
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        durationStr = `${diffMins} mins`;
      }

      // 4. Create the Archive Object
      // We store messages directly in the document for history (easier to read later without subcollections)
      const archiveData = {
        ...convData,
        messages: messages,
        status: "ended",
        archivedAt: serverTimestamp(),
        endedBy: currentUserId,
        duration: durationStr
      };

      // 5. Write to 'archived_conversations'
      await setDoc(doc(db, "archived_conversations", selectedConversationId), archiveData);

      // 6. Delete from 'conversations' (Active)
      await deleteDoc(convRef);

      // 7. Reset Selection
      setSelectedConversationId(null);

      // Note: The snapshots above will automatically update the lists (remove from Active, add to History)
      toast.success("Conversation ended and moved to history.");

    } catch (error) {
      console.error("Error ending conversation:", error);
      toast.error("Failed to end conversation.");
    }
  };

  // --- NEW: Handle Delete History Conversation ---
  const handleDeleteHistory = async (convId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this conversation history? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "archived_conversations", convId));

      // Reset if currently selected
      if (selectedConversationId === convId) {
        setSelectedConversationId(null);
        setSelectedArchivedData(null);
      }

      toast.success("History deleted successfully.");
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Failed to delete history.");
    }
  };

  // Filter Logic based on View Mode
  const sourceList = viewMode === 'active' ? conversations : historyConversations;

  const filteredConversations = sourceList
    .filter((conv) => !conv.adminId || conv.adminId === currentUserId)
    .filter((conv) => {
      const name = (conv.userFullName || "").toLowerCase();
      const email = (conv.userEmail || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || email.includes(q);
    });

  const handleConversationClick = (conv) => {
    setSelectedConversationId(conv.id);
    if (viewMode === 'history') {
      setSelectedArchivedData(conv);
    } else {
      setSelectedArchivedData(null);
    }
  };

  // Helper to get active user name for header
  const getActiveUserName = () => {
    const conv = filteredConversations.find(c => c.id === selectedConversationId);
    return conv ? (conv.userFullName || conv.userEmail) : "Chat";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row md:ml-64 h-full relative">

        {/* --- LEFT PANEL: Conversation List --- */}
        <div
          className={`${selectedConversationId ? "hidden md:flex" : "flex"
            } flex-col w-full md:w-80 bg-white border-r border-gray-200 h-full shadow-sm z-10`}
        >
          {/* Header & Toggle */}
          <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Support Chat</h2>
            </div>

            {/* TOGGLE BUTTONS */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => { setViewMode('active'); setSelectedConversationId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'active'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FaInbox /> Inbox ({conversations.length})
              </button>
              <button
                onClick={() => { setViewMode('history'); setSelectedConversationId(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'history'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FaHistory /> History
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder={viewMode === 'active' ? "Search active..." : "Search history..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 mt-10">
                <FaCommentSlash size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No {viewMode} conversations</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {filteredConversations.map((conv) => {
                  const isActive = conv.id === selectedConversationId;
                  const initials = conv.userFullName
                    ? conv.userFullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "U";

                  return (
                    <li
                      key={conv.id}
                      onClick={() => handleConversationClick(conv)}
                      className={`group cursor-pointer p-4 transition-all duration-200 hover:bg-gray-50 ${isActive ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        {/* Left: Avatar + Details */}
                        <div className="flex items-start gap-3 flex-1">
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                            }`}>
                            {initials}
                          </div>

                          {/* Text Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                                {conv.userFullName || "Unknown User"}
                              </h3>

                              {/* Display Date for History */}
                              {viewMode === 'history' && conv.endedAt && (
                                <span className="text-[10px] text-gray-400">
                                  {new Date(conv.endedAt.seconds * 1000).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <p className={`text-xs truncate ${isActive ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                              {conv.userEmail}
                            </p>

                            {/* Show Duration if in History Mode */}
                            {viewMode === 'history' ? (
                              <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-0.5 rounded">
                                <FaClock className="text-[10px]" />
                                Duration: {conv.duration || "N/A"}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                Active now
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Delete Button (History Only) */}
                        {viewMode === 'history' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the chat
                              handleDeleteHistory(conv.id);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete History"
                          >
                            <FaTimesCircle size={16} />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* --- RIGHT PANEL: Chat Window --- */}
        <div className={`flex-1 flex flex-col bg-gray-50 h-full relative ${selectedConversationId ? "block" : "hidden md:flex"
          }`}>

          {/* Header Bar for Chat Window (Active/History) */}
          {selectedConversationId && (
            <div className="flex items-center justify-between bg-white border-b p-3 shadow-sm sticky top-0 z-20">
              <div className="flex items-center">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <FaArrowLeft />
                </button>

                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-lg">
                    {getActiveUserName()}
                  </span>
                  {viewMode === 'active' && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Live Session
                    </span>
                  )}
                  {viewMode === 'history' && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaHistory size={10} /> Archived Session
                    </span>
                  )}
                </div>
              </div>

              {/* --- END CHAT BUTTON (Only Active Mode) --- */}
              {viewMode === 'active' && (
                <button
                  onClick={handleEndConversation}
                  className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <FaTimesCircle />
                  End Chat
                </button>
              )}
            </div>
          )}

          {selectedConversationId ? (
            <div className="flex-1 h-full overflow-hidden flex flex-col">

              <ChatWindow
                conversationId={selectedConversationId}
                currentUserId={currentUserId}
                role="staff"
                // Pass flags to ChatWindow
                isReadOnly={viewMode === 'history'}
                archivedData={selectedArchivedData} // Pass the full saved object
              />

            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 select-none p-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaUserCircle size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Chat Selected
              </h3>
              <p className="text-gray-400 text-center max-w-sm">
                Select an {viewMode} conversation to view details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminConversations;