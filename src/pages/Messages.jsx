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

const ChatWindow = ({ conversationId: propConversationId, conversation, widgetMode = false }) => {
  // User and conversation state
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

  // FAQ flow state:
  // faqStep: 0 means not in FAQ flow, 1 for initial topic selection, 2 for follow-up
  // selectedCategory will hold the id (e.g. "delivery") from step 1
  const [faqStep, setFaqStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Define FAQ flow constants ---
  // Step 1 options
  const faqStep1Options = [
    { id: "delivery", text: "Delivery time" },
    { id: "tracking", text: "Package Tracking" },
    { id: "shipping", text: "Shipping cost" },
    { id: "other", text: "Other inquiries" },
  ];

  // Follow-up (step 2) for each category
  const faqFollowUp = {
    delivery: {
      message: "For Delivery time, please select an option:",
      options: [
        { id: "when", text: "When will it arrive?" },
        { id: "delay", text: "Why is it delayed?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    tracking: {
      message: "For Package Tracking, please select an option:",
      options: [
        { id: "how", text: "How to track my package?" },
        { id: "update", text: "Why no update?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    shipping: {
      message: "For Shipping cost, please select an option:",
      options: [
        { id: "cost", text: "What is the shipping cost?" },
        { id: "free", text: "How to get free shipping?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    other: {
      message: "For Other inquiries, please select an option:",
      options: [
        { id: "general", text: "General inquiry" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
  };

  // --- Helper Functions ---
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
        try {
          const userDocRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
            setRole(data.role || "user");
          } else {
            setRole("user");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole("user");
        }
      } else {
        setAuthUser(null);
        setRole(null);
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
    if (!localConversationId) return;
    if (conversationStatus === "ended") return;
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
        setNotification(`This conversation has ended. You can create a new conversation in`);
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
            const newTime = prev - 1;
            setNotification(`This conversation has ended. You can create a new conversation in`);
            return newTime;
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
    if (role === "user") {
      return msgSenderId === authUser?.uid ? "self-end bg-blue-100" : "self-start bg-gray-100";
    } else {
      return msgSenderId === authUser?.uid ? "self-end bg-blue-100" : "self-start bg-gray-100";
    }
  };

  const getSenderName = (msgSenderId) => {
    if (msgSenderId === "system") return "Automatic Chat";
    if (role === "admin" || role === "staff") {
      if (msgSenderId === authUser?.uid) {
        return conversationData?.adminFirstName || conversationData?.adminLastName
          ? `${conversationData.adminFirstName || ""} ${conversationData.adminLastName || ""}`.trim()
          : "Admin";
      } else {
        return conversationData?.userFirstName || conversationData?.userLastName
          ? `${conversationData.userFirstName || ""} ${conversationData.userLastName || ""}`.trim()
          : "User";
      }
    } else {
      if (msgSenderId === authUser?.uid) {
        return userData
          ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
          : "You";
      } else {
        return conversationData?.adminFirstName || conversationData?.adminLastName
          ? `${conversationData.adminFirstName || ""} ${conversationData.adminLastName || ""}`.trim()
          : "Admin";
      }
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

  // For Step 1: User selects a topic
  const handleFAQOptionStep1 = async (option) => {
    if (!localConversationId) return;
    try {
      // Record user's selection as a FAQ chat message with status "faqchat"
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: option.text,
        senderId: authUser.uid,
        timestamp: new Date(),
        status: "faqchat",
      });
      // Update the conversation status to "faqchat" to prevent the pending notification
      await updateDoc(doc(db, "conversations", localConversationId), {
        status: "faqchat",
      });
      // Update flow: save selected category and move to step 2
      setSelectedCategory(option.id);
      setFaqStep(2);
      // Auto-send system follow-up message for the selected category with status "faqchat"
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

  // For Step 2: Follow-up options for the selected topic
  const handleFAQOptionStep2 = async (option) => {
    if (!localConversationId) return;
    try {
      // Record the user's selection
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: option.text,
        senderId: authUser.uid,
        timestamp: new Date(),
      });
      if (option.id === "done") {
        // End the FAQ flow
        setFaqStep(0);
        setSelectedCategory(null);
      } else if (option.id === "contact") {
        // Update conversation to indicate admin request and end FAQ flow
        await updateDoc(doc(db, "conversations", localConversationId), {
          request: "sent",
          updatedAt: new Date().toISOString(),
          status: "pending",
        });
        setFaqStep(0);
        setSelectedCategory(null);
      } else {
        // For any other option in follow-up, end FAQ flow (or extend further if needed)
        setFaqStep(0);
        setSelectedCategory(null);
      }
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

    // If conversation doesn't exist or is ended, start a new conversation (only for non-admin/staff)
    if ((!conversationIsActive || conversationStatus === "ended") && role !== "admin" && role !== "staff") {
      try {
        const fullName = userData
          ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
          : "Unknown User";
        const convoRef = await addDoc(collection(db, "conversations"), {
          userId: currentUserId,
          userFirstName: userData?.firstName || "",
          userLastName: userData?.lastName || "",
          userFullName: fullName,
          userEmail: userData?.email || authUser.email,
          status: "faqchat",
          createdAt: serverTimestamp(),
        });
        setLocalConversationId(convoRef.id);
        localStorage.setItem("conversationId", convoRef.id);

        // Add user's first message
        await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
          text: newMessage,
          senderId: currentUserId,
          timestamp: new Date(),
        });
        // Instead of a generic concern prompt, auto-send the FAQ step 1 message
        await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
          text: "Please select a topic from the options below:",
          senderId: "system",
          timestamp: new Date(),
        });
        // Start FAQ flow at step 1
        setFaqStep(1);
        setNewMessage("");
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
      return;
    }

    // If conversation exists, send the message normally
    if (conversationIsActive) {
      try {
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: newMessage,
          senderId: currentUserId,
          timestamp: new Date(),
        });
        setNewMessage("");
        await updateDoc(doc(db, "conversations", localConversationId), {
          updatedAt: new Date().toISOString(),
          lastMessage: newMessage,
        });
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
      await updateDoc(doc(db, "conversations", localConversationId), {
        status: "ended",
      });
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
      return `Chat FAQs`;
    }
  };

  const headerTitle = getHeaderTitle();

  const handleOpenNavbar = () => {
    window.dispatchEvent(new CustomEvent("openOffCanvas"));
  };

  const containerHeightClass = widgetMode
    ? "h-full text-sm"
    : (role === "admin" || role === "staff")
    ? "h-screen md:h-full"
    : "h-screen";

  const basePadding = widgetMode ? "p-2" : "p-4";

  return (
    <div className={`flex flex-col w-full ${containerHeightClass}`}>
      {/* Header */}
      <div className={`${basePadding} bg-blue-200 border-t-2 border-b-2 flex items-center justify-between flex-shrink-0`}>
        <h4 className="text-lg font-semibold">{headerTitle}</h4>
        <button onClick={handleOpenNavbar} className={`${role === "admin" ? "md:hidden" : ""} p-2 text-gray-700 hover:text-gray-900`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="md:hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {role && (role === "admin" || role === "staff") && conversationIsActive && (
          <button className="p-2 bg-red-500 text-white rounded" onClick={handleStopConversation}>
            Stop
          </button>
        )}
      </div>

      {/* Notification */}
      {(notification ||
        (conversationIsActive &&
          conversationStatus === "pending" &&
          role !== "admin" &&
          role !== "staff")) && (
        <div className={`p-2 text-center ${getNotificationClasses()}`}>
          {notification ||
            "Waiting for an admin to accept your request..."}{" "}
          {conversationStatus === "ended" && `(${formatTime(countdown)})`}
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${basePadding} bg-white flex flex-col`}>
        {conversationIsActive &&
          conversationStatus === "pending" &&
          role !== "admin" &&
          role !== "staff" && (
            <p className="text-center text-yellow-600 mb-2">
            </p>
          )}
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
            <p className="text-center text-gray-500">No messages yet.</p>
          )
        ) : (
          <p className="text-center text-gray-500">
            {conversationStatus === "ended"
              ? "This conversation has ended. Send a message to request a new conversation."
              : "No active conversation. Send a message to request a conversation."}
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Options: Render based on the FAQ flow step */}
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
          {faqStep === 2 && selectedCategory && faqFollowUp[selectedCategory] &&
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
            disabled={conversationStatus === "ended" || conversationStatus === "rejected" || inputDisabled}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded"
            onClick={handleSendMessage}
            disabled={conversationStatus === "ended" || conversationStatus === "rejected" || inputDisabled}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
