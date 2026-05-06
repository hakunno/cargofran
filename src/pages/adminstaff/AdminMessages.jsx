import React, { useState, useEffect } from "react";
import { useConfirm } from "../../component/ConfirmModal";
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
  getDocs,
  setDoc,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import ChatWindow from "../Messages";
import { FaArrowLeft, FaSearch, FaUserCircle, FaCommentSlash, FaHistory, FaInbox, FaClock, FaCheckDouble, FaTimesCircle, FaTruck } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

const AdminConversations = () => {
  const [confirm, ConfirmUI] = useConfirm();
  // Toggle State: 'active' or 'history'
  const [viewMode, setViewMode] = useState('active');

  const [conversations, setConversations] = useState([]);
  const [historyConversations, setHistoryConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // For History View, we pass the full object
  const [selectedArchivedData, setSelectedArchivedData] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { markAsSeen } = useAdminNotifications();
  useEffect(() => {
    markAsSeen('liveChats');
    return () => markAsSeen(null);
  }, [markAsSeen]);

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

    const ok = await confirm({
      title: "End Conversation?",
      message: "This conversation will be moved to history and closed for the user.",
      variant: "warning",
      confirmLabel: "End",
    });
    if (!ok) return;

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
    const ok = await confirm({
      title: "Delete History?",
      message: "This conversation history will be permanently deleted and cannot be recovered.",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;

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
    .filter((conv) => {
      if (viewMode === 'shipments') return true;
      return !conv.adminId || conv.adminId === currentUserId;
    })
    .filter((conv) => {
      const name = (conv.userFullName || "").toLowerCase();
      const email = (conv.userEmail || "").toLowerCase();
      const pkg = (conv.packageNumber || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || email.includes(q) || pkg.includes(q);
    });

  const handleConversationClick = (conv) => {
    setSelectedConversationId(conv.id);
    if (viewMode === 'history') {
      setSelectedArchivedData(conv);
    } else {
      setSelectedArchivedData(null);
    }
  };

  const getActiveUserName = () => {
    const conv = filteredConversations.find(c => c.id === selectedConversationId);
    if (!conv) return "Chat";
    return conv.userFullName || conv.userEmail;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {ConfirmUI}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row md:ml-64 h-full relative">

        {/* --- LEFT PANEL: Conversation List --- */}
        <div
          className={`${selectedConversationId ? "hidden md:flex" : "flex"
            } flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 h-full shadow-md z-10 
            ${isSidebarOpen ? "w-full md:w-72" : "w-0 overflow-hidden md:w-0"}`}
        >
          {/* Header & Toggle */}
          <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-3">
            <div className="flex justify-center items-center px-1 relative">
                <h2 className="text-[10px] font-black text-gray-400 uppercase lexend">Chat</h2>
                <button 
                    onClick={() => { setViewMode(viewMode === 'active' ? 'history' : 'active'); setSelectedConversationId(null); }}
                    className={`absolute right-1 p-1.5 rounded-md transition-all ${viewMode === 'history' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-100'}`}
                    title={viewMode === 'active' ? "View History" : "View Inbox"}
                >
                    {viewMode === 'active' ? <FaHistory size={12} /> : <FaInbox size={12} />}
                </button>
            </div>

            {/* QUICK STATS / TABS (Compact) */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <div className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md ${viewMode === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                    {viewMode === 'active' ? `Inbox (${conversations.length})` : 'History'}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-[10px]" />
              <input
                type="text"
                placeholder="Find chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 p-6 text-center">
                <FaCommentSlash size={24} className="mb-2 opacity-20 mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-wider">No Conversations</p>
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
                      className={`group cursor-pointer px-4 py-2 transition-all duration-200 border-r-4 ${isActive ? "bg-blue-50 border-blue-600 shadow-inner" : "hover:bg-gray-50 border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                          }`}>
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                              {conv.userFullName || "Unknown User"}
                            </span>

                            {viewMode === 'history' && conv.endedAt && (
                              <span className="text-[7px] text-gray-400 font-bold uppercase">
                                {new Date(conv.endedAt.seconds * 1000).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-0.5">
                            <p className="text-[8px] truncate text-gray-400 flex-1">
                              {conv.userEmail}
                            </p>
                            {viewMode === 'history' && (
                              <span className="text-[7px] text-green-600 font-bold bg-green-50 px-1 rounded uppercase">
                                {conv.duration || "N/A"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Delete Button (History Only) */}
                        {viewMode === 'history' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHistory(conv.id);
                            }}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete History"
                          >
                            <FaTimesCircle size={12} />
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

          {/* TOGGLE SIDEBAR BUTTON (Floating) */}
          <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -left-3 top-20 z-30 bg-white border border-gray-200 shadow-md p-1 rounded-full text-gray-400 hover:text-blue-600 transition-all hidden md:block"
          >
              {isSidebarOpen ? <FaArrowLeft size={10} /> : <span className="rotate-180 block"><FaArrowLeft size={10} /></span>}
          </button>

          {/* Header Bar for Chat Window (Active/History) */}
          {selectedConversationId && (
            <div className="flex items-center justify-between bg-white border-b border-gray-100 p-4 shadow-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <FaArrowLeft />
                </button>

                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-800 text-base tracking-tight leading-none">
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