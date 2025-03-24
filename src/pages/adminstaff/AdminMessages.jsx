import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import Sidebar from "../../component/adminstaff/Sidebar";
import ChatWindow from "../Messages"; // adjust import as needed
import { FaArrowLeft } from "react-icons/fa"; // Import left arrow icon

const AdminConversations = ({ currentUserId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    // Only fetch approved conversations
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      {/* For mobile: show either conversation list or chat window.
          For desktop: show both side by side */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Conversation List Panel */}
        <div
          className={`${
            selectedConversationId ? "hidden md:block" : "block"
          } w-full md:w-64 border-b md:border-r p-4 overflow-y-auto`}
          style={{ maxHeight: "100vh" }}
        >
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          <ul className="space-y-2">
            {conversations.map((conv, index) => (
              <li
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <p className="font-semibold">
                  Conversation: {conv.userFullName || `#${index + 1}`}
                </p>
                <p className="text-sm text-gray-500">Status: {conv.status}</p>
                <p className="text-sm text-gray-500">User Email: {conv.userEmail}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window Panel */}
        <div
          className={`flex-1 overflow-y-auto h-full ${
            selectedConversationId ? "block" : "hidden md:block"
          }`}
          style={{ maxHeight: "100vh" }}
        >
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId={currentUserId}
              role="staff" // or "admin"
            />
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Please select a conversation.
            </p>
          )}
        </div>
      </div>

      {/* Floating Back Button for Mobile (Top Left) */}
      {selectedConversationId && (
        <button
          onClick={() => {
            setSelectedConversationId(null);
            window.scrollTo({ behavior: "smooth" });
          }}
          className="fixed top-24 left-2 z-[39] p-3 bg-gray-300 rounded-full shadow-lg md:hidden"
        >
          <FaArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default AdminConversations;
