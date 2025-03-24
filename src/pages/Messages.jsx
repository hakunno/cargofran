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
} from "firebase/firestore";

const ChatWindow = ({ conversationId: propConversationId, onBack }) => {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null); // "admin", "staff", or "user"
  const [userData, setUserData] = useState(null); // store user data from Users doc
  const [conversationData, setConversationData] = useState(null);
  const [localConversationId, setLocalConversationId] = useState(
    propConversationId || localStorage.getItem("conversationId") || null
  );
  const [conversationStatus, setConversationStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0); // countdown in seconds
  const messagesEndRef = useRef(null);

  // Helper: format seconds into mm:ss format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Helper: Return notification CSS classes based on conversationStatus
  const getNotificationClasses = () => {
    if (conversationStatus === "approved") {
      return "bg-green-100 text-green-700";
    }
    if (conversationStatus === "rejected" || conversationStatus === "ended") {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  // 1. Listen for Authenticated User and fetch role and user data from "Users" collection
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

  // 2. Listen for conversation doc changes (status and conversationData)
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

  // 3. Listen for messages (only if conversation exists and not ended)
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

  // Persist conversationId in localStorage so chat history is retained
  useEffect(() => {
    if (localConversationId) {
      localStorage.setItem("conversationId", localConversationId);
    }
  }, [localConversationId]);

  // 4. Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 5. When conversation is rejected, disable input for 10 minutes, show notification, and reset conversationId.
  useEffect(() => {
    if (role === "user" && conversationStatus === "rejected") {
      setNotification("Your conversation request has been rejected. Please try again after 10 minutes.");
      setInputDisabled(true);
      const timer = setTimeout(() => {
        setInputDisabled(false);
        setNotification("");
        setLocalConversationId(null);
        localStorage.removeItem("conversationId");
      }, 10 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [conversationStatus, role]);

  // 6. When conversation is ended, disable input and start a 5-minute countdown timer.
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
        setNotification(`This conversation has ended. You can create a new conversation in (${formatTime(remaining)}).`);
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
            setNotification(`This conversation has ended. You can create a new conversation in (${formatTime(newTime)}).`);
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

  // Helper: Determine if conversation is active (exists and not ended)
  const conversationIsActive = localConversationId && conversationStatus !== "ended";

  // Helper: Get message CSS classes based on sender and role.
  const getMessageClasses = (msgSenderId) => {
    if (msgSenderId === "system") {
      return "self-end bg-yellow-200";
    }
    if (role === "user") {
      return msgSenderId === authUser?.uid ? "self-end bg-blue-100" : "self-start bg-gray-100";
    } else {
      return msgSenderId === authUser?.uid ? "self-end bg-blue-100" : "self-start bg-gray-100";
    }
  };

  // Helper: Get sender name for each message.
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

  // 7. Notification for approved conversation (green background for approved)
  useEffect(() => {
    if (role === "user" && conversationStatus === "approved") {
      setNotification("You are currently chatting with an admin");
      const timer = setTimeout(() => {
        setNotification("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [conversationStatus, role]);

  // 8. Handle sending messages
  const handleSendMessage = async () => {
    if (!authUser) {
      alert("Please log in to send messages.");
      return;
    }
    if (!newMessage.trim()) return;
    const currentUserId = authUser.uid;

    // If conversation doesn't exist or is ended => start new conversation (only for non-admin/staff)
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
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        setLocalConversationId(convoRef.id);
        localStorage.setItem("conversationId", convoRef.id);

        // Add user's first message
        await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
          text: newMessage,
          senderId: currentUserId,
          timestamp: new Date(),
        });
        // Auto-send system message asking for user concern
        await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
          text: "What is your concern fellow shipper? Feel free to type it down and wait for an admin reply to your concerns.",
          senderId: "system",
          timestamp: new Date(),
        });

        setNewMessage("");
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
      return;
    }

    // Before updating, ensure conversationData exists. If not, clear the stale conversation id.
    if (!conversationData) {
      setLocalConversationId(null);
      localStorage.removeItem("conversationId");
      alert("Conversation not found. Please try sending your message again.");
      return;
    }

    // If conversation is active (pending/approved), send message normally
    if (conversationIsActive) {
      try {
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: newMessage,
          senderId: currentUserId,
          timestamp: new Date(),
        });
        setNewMessage("");
        if (role === "user" && !conversationData?.userConcern) {
          await updateDoc(doc(db, "conversations", localConversationId), {
            userConcern: newMessage,
          });
        }
        await updateDoc(doc(db, "conversations", localConversationId), {
          updatedAt: new Date().toISOString(),
          lastMessage: newMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // 9. Admin/Staff can stop the conversation (set status="ended")
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

  // 10. Determine conversation header text based on role and conversation data.
  const getHeaderTitle = () => {
    if (!conversationData) return "Conversation";
    if (role === "admin" || role === "staff") {
      const first = conversationData.userFirstName || "";
      const last = conversationData.userLastName || "";
      return `Conversation: ${`${first} ${last}`.trim() || "Unknown User"}`;
    } else {
      if (conversationData.adminFirstName || conversationData.adminLastName) {
        const adminFirst = conversationData.adminFirstName || "";
        const adminLast = conversationData.adminLastName || "";
        return `Conversation: FLC (${`${adminFirst} ${adminLast}`.trim()} (Admin))`;
      }
      return `Conversation: FLC (Admin of FLC)`;
    }
  };

  const headerTitle = getHeaderTitle();

  const handleOpenNavbar = () => {
    window.dispatchEvent(new CustomEvent("openOffCanvas"));
  };

  const containerHeightClass = (role === "admin" || role === "staff")
  ? "h-screen md:h-full"
  : "h-screen";
    

  return (
    <div className={`flex flex-col w-full ${containerHeightClass}`}>
      {/* Header */}
      <div className="p-4 bg-gray-200 border-b flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold">{headerTitle}</h2>
        <button onClick={handleOpenNavbar} className="p-2 text-gray-700 hover:text-gray-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
        {role && (role === "admin" || role === "staff") && conversationIsActive && (
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={handleStopConversation}
          >
            Stop Conversation
          </button>
        )}
      </div>

      {/* Notification for rejected/ended conversation */}
      {notification && (
        <div className={`p-2 text-center ${getNotificationClasses()}`}>
          {notification}{" "}
          {conversationStatus === "ended" && `(${formatTime(countdown)})`}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
        {conversationIsActive ? (
          conversationStatus === "pending" && role !== "admin" && role !== "staff" ? (
            <p className="text-center text-yellow-600 mb-2">
              Waiting for an admin to accept your request...
            </p>
          ) : null
        ) : null}

        {conversationIsActive ? (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded max-w-xs break-words ${getMessageClasses(
                  msg.senderId
                )}`}
              >
                <p className="text-xs text-gray-600 mb-1">{getSenderName(msg.senderId)}</p>
                <p>{msg.text}</p>
                <small className="text-gray-500">
                  {msg.timestamp && msg.timestamp.seconds
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      {/* Input area */}
      {conversationIsActive && conversationStatus === "ended" ? (
        <div className="p-2 text-center text-red-500">
          This conversation has ended. You cannot send more messages.
        </div>
      ) : (
        <div className="p-4 border-t bg-gray-50 flex flex-shrink-0">
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
            disabled={
              conversationStatus === "ended" ||
              conversationStatus === "rejected" ||
              inputDisabled
            }
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded"
            onClick={handleSendMessage}
            disabled={
              conversationStatus === "ended" ||
              conversationStatus === "rejected" ||
              inputDisabled
            }
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
