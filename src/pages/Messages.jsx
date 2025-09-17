import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// Import helper functions and constants
import { fetchUserData } from "../helpers/AuthHelpers";
import { createNewConversation, updateConversationStatus, stopConversation } from "../helpers/ConversationHelpers";
import { faqStep1Options, faqFollowUp } from "../helpers/FaqHelpers";
import { sendMessage } from "../helpers/MessageHelpers";

// Import the LoginModal component
import LoginModal from "../modals/Login";

const ChatWindow = ({ conversationId: propConversationId, conversation, widgetMode = false }) => {
  // State variables...
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null); // "admin", "staff", or "user"
  const [userData, setUserData] = useState(null);
  const [conversationData, setConversationData] = useState(null);
  const [localConversationId, setLocalConversationId] = useState(
    propConversationId || localStorage.getItem("conversationId") || null
  );
  const [conversationStatus, setConversationStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const messagesEndRef = useRef(null);

  // FAQ flow state
  const [faqStep, setFaqStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // New state to control showing the LoginModal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- Utility Functions ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getNotificationClasses = () => {
    if (conversationStatus === "approved") return "bg-green-100 text-green-700";
    if (conversationStatus === "rejected" || conversationStatus === "ended") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // --- Auth and User Data ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        const data = await fetchUserData(db, user);
        setUserData(data);
        setRole(data?.role || "user");
      } else {
        // When user logs out, clear conversation state
        setAuthUser(null);
        setRole(null);
        setLocalConversationId(null);
        setConversationData(null);
        setConversationStatus(null);
        setMessages([]);
        localStorage.removeItem("conversationId");
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Listen for Conversation Changes ---
  useEffect(() => {
    if (!localConversationId) {
      setConversationStatus(null);
      setConversationData(null);
      return;
    }
    const convoDocRef = doc(db, "conversations", localConversationId);
    const unsubscribe = onSnapshot(convoDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConversationStatus(data.status);
        setConversationData(data);
      }
    });
    return () => unsubscribe();
  }, [localConversationId]);

  // --- Listen for Messages ---
  useEffect(() => {
    if (!localConversationId || conversationStatus === "ended") return;
    const messagesRef = collection(db, "conversations", localConversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [localConversationId, conversationStatus]);

  // --- Persist Conversation ID ---
  useEffect(() => {
    if (localConversationId) localStorage.setItem("conversationId", localConversationId);
  }, [localConversationId]);

  // --- Auto-scroll when messages update ---
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handle Rejected / Ended Conversation ---
  useEffect(() => {
    if (role === "user" && conversationStatus === "rejected") {
      setNotification("Your conversation request has been rejected. Please try again after 5 minutes.");
      setInputDisabled(true);
      const timer = setTimeout(() => {
        setInputDisabled(false);
        setNotification("");
      }, 10 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [conversationStatus, role]);

  useEffect(() => {
    if (role === "user" && conversationStatus === "ended") {
      const savedEndTimestamp = localStorage.getItem("conversationEndTimestamp");
      let endTime;
      if (savedEndTimestamp) {
        endTime = parseInt(savedEndTimestamp);
      } else {
        endTime = Date.now();
        localStorage.setItem("conversationEndTimestamp", endTime.toString());
      }
      const elapsedSeconds = Math.floor((Date.now() - endTime) / 1000);
      const remaining = 300 - elapsedSeconds;
      if (remaining > 0) {
        setCountdown(remaining);
        setNotification("This conversation has ended. You can create a new conversation in");
        setInputDisabled(true);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setInputDisabled(false);
              setNotification("");
              setLocalConversationId(null);
              localStorage.removeItem("conversationId");
              localStorage.removeItem("conversationEndTimestamp");
              return 0;
            }
            setNotification("This conversation has ended. You can create a new conversation in");
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setInputDisabled(false);
        setNotification("");
        setLocalConversationId(null);
        localStorage.removeItem("conversationId");
        localStorage.removeItem("conversationEndTimestamp");
      }
    }
  }, [conversationStatus, role]);

  const conversationIsActive = localConversationId && conversationStatus !== "ended";

  // --- Helpers for Message Display ---
  const getMessageClasses = (msgSenderId) => {
    if (msgSenderId === "system") return "self-end bg-yellow-200";
    return msgSenderId === authUser?.uid ? "self-end bg-blue-100" : "self-start bg-gray-100";
  };

  const getSenderName = (msgSenderId) => {
    if (msgSenderId === "system") return "Automatic Chat";
    if (role === "admin" || role === "staff") {
      if (msgSenderId === authUser?.uid) {
        return conversationData?.adminFirstName || conversationData?.adminLastName
          ? `${conversationData.adminFirstName || ""} ${conversationData.adminLastName || ""}`.trim()
          : "Admin";
      }
      return conversationData?.userFirstName || conversationData?.userLastName
        ? `${conversationData.userFirstName || ""} ${conversationData.userLastName || ""}`.trim()
        : "User";
    } else {
      return msgSenderId === authUser?.uid
        ? userData
          ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
          : "You"
        : conversationData?.adminFirstName || conversationData?.adminLastName
        ? `${conversationData.adminFirstName || ""} ${conversationData.adminLastName || ""}`.trim()
        : "Admin";
    }
  };

  useEffect(() => {
    if (role === "user" && conversationStatus === "approved") {
      setNotification("You are currently chatting with an admin");
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [conversationStatus, role]);

  // Listen for conversation deletion
  useEffect(() => {
    if (!localConversationId) {
      setConversationStatus(null);
      setConversationData(null);
      return;
    }
    const convoDocRef = doc(db, "conversations", localConversationId);
    const unsubscribe = onSnapshot(convoDocRef, (docSnap) => {
      if (!docSnap.exists()) {
        setLocalConversationId(null);
        localStorage.removeItem("conversationId");
        setConversationStatus(null);
        setConversationData(null);
        setMessages([]);
        return;
      }
      const data = docSnap.data();
      setConversationStatus(data.status);
      setConversationData(data);
    });
    return () => unsubscribe();
  }, [localConversationId]);

  // --- FAQ Option Handlers ---
  const handleFAQOptionStep1 = async (option) => {
    if (!localConversationId) return;
    try {
      // Record user's FAQ selection
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: option.text,
        senderId: authUser.uid,
        timestamp: new Date(),
        status: "faqchat",
      });
      await updateConversationStatus(db, localConversationId, "faqchat");
      setSelectedCategory(option.id);
      setFaqStep(2);
      const followUpMessage = faqFollowUp[option.id]?.message;
      if (followUpMessage) {
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: followUpMessage,
          senderId: "system",
          timestamp: new Date(),
          status: "faqchat",
        });
      }
    } catch (error) {
      console.error("Error in FAQ step 1:", error);
    }
  };

  const handleFAQOptionStep2 = async (option) => {
    if (!localConversationId) return;
    try {
      // If the user selects "Contact admin" and their role is undefined,
      // prompt them to log in / sign up using the LoginModal
      if (option.id === "contact") {
        if (!role || role === "undefined") {
          // Show the login modal instead of sending a message
          setShowLoginModal(true);
          return;
        } else {
          // Otherwise, update the conversation to indicate a contact request
          await updateDoc(doc(db, "conversations", localConversationId), {
            request: "sent",
            updatedAt: new Date().toISOString(),
            status: "pending",
          });
        }
      } else {
        // Record the FAQ selection for other options
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: option.text,
          senderId: authUser.uid,
          timestamp: new Date(),
        });
      }
      // End FAQ flow
      setFaqStep(0);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error in FAQ step 2:", error);
    }
  };

  // --- Handle Sending a New Message ---
  const handleSendMessage = async () => {
    if (!authUser) {
      alert("Please log in to send messages.");
      return;
    }
    if (!newMessage.trim()) return;
    const currentUserId = authUser.uid;

    // If no active conversation, create a new one
    if ((!conversationIsActive || conversationStatus === "ended") && role !== "admin" && role !== "staff") {
      try {
        const convoId = await createNewConversation(db, authUser, userData, newMessage);
        setLocalConversationId(convoId);
        localStorage.setItem("conversationId", convoId);
        // Auto-send FAQ step 1 prompt
        await addDoc(collection(db, "conversations", convoId, "messages"), {
          text: "Please select a topic from the options below:",
          senderId: "system",
          timestamp: new Date(),
        });
        setFaqStep(1);
        setNewMessage("");
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
      return;
    }

    if (conversationIsActive) {
      try {
        await sendMessage(db, localConversationId, newMessage, currentUserId);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // --- Admin/Staff Stop Conversation ---
  const handleStopConversation = async () => {
    if (!localConversationId) return;
    const confirmStop = window.confirm("Are you sure you want to stop this conversation?");
    if (!confirmStop) return;
    try {
      await stopConversation(db, localConversationId);
    } catch (error) {
      console.error("Error stopping conversation:", error);
    }
  };

  // --- Determine Header Title ---
  const getHeaderTitle = () => {
    if (!conversationData) return "Message:";
    if (role === "admin" || role === "staff") {
      const first = conversationData.userFirstName || "";
      const last = conversationData.userLastName || "";
      return `Conversation: ${`${first} ${last}`.trim() || "Unknown User"}`;
    } else {
      if (conversationData.adminFirstName || conversationData.adminLastName) {
        const adminFirst = conversationData.adminFirstName || "";
        const adminLast = conversationData.adminLastName || "";
        return `Chatting with: ${`${adminFirst} ${adminLast}`.trim()} (Admin)`;
      }
      return `FLS Automatic Chat`;
    }
  };

  const headerTitle = getHeaderTitle();

  const handleOpenNavbar = () => {
    window.dispatchEvent(new CustomEvent("openOffCanvas"));
  };

  // In FAQ mode, disable the text input so users can't type messages.
  const isInputDisabled = conversationStatus === "ended" ||
    conversationStatus === "rejected" ||
    inputDisabled ||
    (conversationStatus === "faqchat");

  const containerHeightClass = widgetMode
    ? "h-full text-sm"
    : role === "admin" || role === "staff"
    ? "h-screen md:h-full"
    : "h-screen";

  const basePadding = widgetMode ? "p-2" : "p-4";

  const sendButtonText = conversationIsActive && messages.length === 0 ? "Start" : "Send";
  const noMessagesText = conversationIsActive && messages.length === 0 ? "Start a conversation" : "No messages yet.";

  return (
    <div className={`flex flex-col w-full ${containerHeightClass}`}>
      {/* Header */}
      <div className={`${basePadding} bg-blue-200 border-b-2 flex items-center justify-between flex-shrink-0`}>
        <h4 className="text-lg font-semibold">{headerTitle}</h4>
        <button onClick={handleOpenNavbar} className={`${role === "admin" ? "md:hidden" : ""} p-2 text-gray-700 hover:text-gray-900`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="md:hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {(role === "admin" || role === "staff") && conversationIsActive && (
          <button className="p-2 bg-red-500 text-white rounded" onClick={handleStopConversation}>
            Stop
          </button>
        )}
      </div>

      {/* Notification */}
      {(notification || (conversationIsActive && conversationStatus === "pending" && role !== "admin" && role !== "staff")) && (
        <div className={`p-2 text-center ${getNotificationClasses()}`}>
          {notification || "Waiting for an admin to accept your request..."}{" "}
          {conversationStatus === "ended" && `(${formatTime(countdown)})`}
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${basePadding} bg-white flex flex-col`}>
        {conversationIsActive ? (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`mb-2 p-2 rounded max-w-xs break-words ${getMessageClasses(msg.senderId)}`}>
                <p className="text-xs text-gray-600 mb-1">{getSenderName(msg.senderId)}</p>
                <p>{msg.text}</p>
                <small className="text-gray-500">
                  {msg.timestamp && msg.timestamp.seconds
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </small>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">{noMessagesText}</p>
          )
        ) : (
          <p className="text-center text-gray-500">
            {conversationStatus === "ended"
              ? "This conversation has ended."
              : "Send a message to start conversation."}
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Options */}
      {conversationIsActive && role === "user" && faqStep > 0 && (
        <div className={`${basePadding} bg-gray-50 flex flex-wrap gap-2`}>
          {faqStep === 1 &&
            faqStep1Options.map((option) => (
              <button
                key={option.id}
                className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                onClick={() => handleFAQOptionStep1(option)}
              >
                {option.text}
              </button>
            ))}
          {faqStep === 2 &&
            selectedCategory &&
            faqFollowUp[selectedCategory] &&
            faqFollowUp[selectedCategory].options.map((option) => (
              <button
                key={option.id}
                className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                onClick={() => handleFAQOptionStep2(option)}
              >
                {option.text}
              </button>
            ))}
        </div>
      )}

      {/* Input Area */}
      {conversationIsActive && conversationStatus === "ended" ? (
        <div className="p-2 text-center text-red-500">
          This conversation has ended. You cannot send more messages.
        </div>
      ) : (
        <div className={`${basePadding} border-t bg-gray-50 flex flex-shrink-0`}>
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isInputDisabled}
          />
          <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={handleSendMessage} disabled={isInputDisabled}>
            {sendButtonText}
          </button>
        </div>
      )}

      {/* Render the LoginModal if needed */}
      {showLoginModal && (
        <LoginModal setIsOpen={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default ChatWindow;