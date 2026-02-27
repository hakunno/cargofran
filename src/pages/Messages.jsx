import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

// Helper imports
import { fetchUserData } from "../helpers/AuthHelpers";
import {
  createNewConversation,
  updateConversationStatus,
  archiveConversation
} from "../helpers/ConversationHelpers";
import { faqStep1Options, faqFollowUp } from "../helpers/FaqHelpers";
import { sendMessage } from "../helpers/MessageHelpers";

// Import your Login Modal
import LoginModal from "../modals/Login";

const ChatWindow = ({
  conversationId: propConversationId,
  widgetMode = false,
  isReadOnly = false,
  archivedData = null,
  role: propRole = "user"
}) => {

  // --- State ---
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(propRole);
  const [userData, setUserData] = useState(null);

  // Conversation State
  const [localConversationId, setLocalConversationId] = useState(
    propConversationId || localStorage.getItem("conversationId") || null
  );
  const [conversationData, setConversationData] = useState(null);
  const [conversationStatus, setConversationStatus] = useState(null);
  const [messages, setMessages] = useState([]);

  // Input & UI State
  const [newMessage, setNewMessage] = useState("");
  const [isPreChat, setIsPreChat] = useState(!localConversationId);
  const messagesEndRef = useRef(null);

  // Ref for the Login Modal
  const loginModalRef = useRef(null);

  // FAQ State
  const [faqStep, setFaqStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreQuestionPrompt, setShowMoreQuestionPrompt] = useState(false);

  // Tracking State
  const [isTrackingInput, setIsTrackingInput] = useState(false);
  const [trackingPackageNumber, setTrackingPackageNumber] = useState('');
  const [trackingAction, setTrackingAction] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        const data = await fetchUserData(db, user);
        setUserData(data);
        if (propRole === "user") {
          setRole(data?.role || "user");
        }
      } else {
        setAuthUser(null);
        if (propRole === "user") setRole(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [propRole]);

  // --- Data Listener ---
  useEffect(() => {
    if (isReadOnly && archivedData) {
      setMessages(archivedData.messages || []);
      setConversationData(archivedData);
      setConversationStatus('ended');
      setIsPreChat(false);
      return;
    }

    if (!localConversationId) {
      setIsPreChat(true);
      return;
    }

    setIsPreChat(false);

    const convoDocRef = doc(db, "conversations", localConversationId);
    const unsubConvo = onSnapshot(convoDocRef, (docSnap) => {
      if (!docSnap.exists()) {
        resetChat();
        return;
      }
      const data = docSnap.data();
      setConversationStatus(data.status);
      setConversationData(data);

      if (data.status === 'faqchat') setFaqStep(1);
    });

    const messagesRef = collection(db, "conversations", localConversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);
    });

    return () => {
      unsubConvo();
      unsubMessages();
    };
  }, [localConversationId, isReadOnly, archivedData]);

  // --- Auto Scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, faqStep, isPreChat, showMoreQuestionPrompt]);

  const resetChat = () => {
    setLocalConversationId(null);
    localStorage.removeItem("conversationId");
    setConversationStatus(null);
    setConversationData(null);
    setMessages([]);
    setIsPreChat(true);
    setFaqStep(0);
    setShowMoreQuestionPrompt(false);
    setIsTrackingInput(false);
    setTrackingPackageNumber('');
    setTrackingAction(null);
  };

  // --- Tracking Search Function ---
  const handleTrackSearch = async (pkgNum) => {
    setSearchLoading(true);
    try {
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: "Searching for your package...",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });

      const q = query(
        collection(db, "Packages"),
        where("packageNumber", "==", pkgNum)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: "Package not found. Please check the package number and try again.",
          senderId: "system",
          timestamp: new Date(),
          status: "faqchat",
        });
        return false;
      }

      const docSnap = querySnapshot.docs[0];
      const packageData = { id: docSnap.id, ...docSnap.data() };

      // Package Details
      let detailsText = `Package Details:\n`;
      detailsText += `- Package Number: ${packageData.packageNumber}\n`;
      detailsText += `- From: ${packageData.senderCountry || 'N/A'}\n`;
      detailsText += `- To: ${packageData.destinationCountry || 'N/A'}\n`;
      detailsText += `- Current Status: ${packageData.packageStatus || 'N/A'}\n`;
      if (packageData.airwayBill) detailsText += `- Airway Bill: ${packageData.airwayBill}\n`;

      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: detailsText,
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });

      // Status History
      const historyQuery = query(
        collection(db, "Packages", docSnap.id, "statusHistory"),
        orderBy("timestamp", "asc")
      );
      const historySnapshot = await getDocs(historyQuery);
      let historyText = "Status History:\n";
      if (historySnapshot.empty) {
        historyText += "No status history available.";
      } else {
        historySnapshot.docs.forEach((doc) => {
          const entry = { id: doc.id, ...doc.data() };
          const time = entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleString() : 'Pending';
          historyText += `- ${entry.status} (${time})\n`;
        });
      }

      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: historyText,
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });

      // Action-specific messages
      if (trackingAction === 'delivery_when') {
        let lastStatus = packageData.packageStatus || 'Unknown';
        if (!historySnapshot.empty) {
          const lastDoc = historySnapshot.docs[historySnapshot.docs.length - 1];
          const lastEntry = { ...lastDoc.data() };
          lastStatus = lastEntry.status || lastStatus;
        }
        const excuseText = `Note: We are unable to provide an approximate delivery time due to variable factors such as customs processing, weather conditions, transit delays, and other unforeseen circumstances. Your shipment's current status and location is ${lastStatus}.`;
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: excuseText,
          senderId: "system",
          timestamp: new Date(),
          status: "faqchat",
        });
      } else if (trackingAction === 'tracking_update') {
        const excuseText = "If there are no recent updates, it may be due to delays in the system, transit issues, or pending scans.";
        await addDoc(collection(db, "conversations", localConversationId, "messages"), {
          text: excuseText,
          senderId: "system",
          timestamp: new Date(),
          status: "faqchat",
        });
      }

      // Prompt for more questions
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: "Do you have another question?",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });
      setShowMoreQuestionPrompt(true);

      return true;
    } catch (err) {
      console.error(err);
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: "Error retrieving package data. Please try again.",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });
      return false;
    } finally {
      setSearchLoading(false);
    }
  };

  // --- GARBAGE COLLECTION FOR ABANDONED FAQS ---
  const cleanupAbandonedFaqChats = async (userObj) => {
    if (!userObj || !userObj.uid) return;
    try {
      const q = query(
        collection(db, "conversations"),
        where("userId", "==", userObj.uid),
        where("status", "==", "faqchat")
      );
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(async (convoDoc) => {
        // Delete all messages in the subcollection first
        const messagesRef = collection(db, "conversations", convoDoc.id, "messages");
        const msgSnap = await getDocs(messagesRef);
        const msgDeletes = msgSnap.docs.map(msgDoc => deleteDoc(doc(db, "conversations", convoDoc.id, "messages", msgDoc.id)));
        await Promise.all(msgDeletes);

        // Delete the parent conversation document
        return deleteDoc(doc(db, "conversations", convoDoc.id));
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error cleaning up abandoned FAQ chats:", error);
    }
  };

  // --- ACTIONS ---
  const startFaqChat = async () => {
    try {
      const currentUser = authUser || {
        uid: `guest_${Date.now()}`,
        displayName: "Guest",
        email: "guest@example.com",
        isAnonymous: true
      };

      // Clean up previous abandoned FAQ chats first
      await cleanupAbandonedFaqChats(currentUser);

      const convoId = await createNewConversation(db, currentUser, userData, "Started FAQ Session");
      await updateConversationStatus(db, convoId, "faqchat");

      setLocalConversationId(convoId);
      localStorage.setItem("conversationId", convoId);

      await addDoc(collection(db, "conversations", convoId, "messages"), {
        text: "Hello! I am your automated assistant. Please select a topic below:",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });

      setFaqStep(1);
    } catch (error) {
      console.error("Error starting FAQ:", error);
    }
  };

  const requestLiveAgent = async () => {
    if (!authUser) {
      if (loginModalRef.current) {
        loginModalRef.current.openModal();
      }
      return;
    }

    try {
      // 0. Clean up any abandoned FAQ sessions before they enter a live queue
      await cleanupAbandonedFaqChats(authUser);

      // 1. Prevent overlapping requests by checking if they already have an active pending one
      const existingQueries = query(
        collection(db, "conversations"),
        where("userId", "==", authUser.uid),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(existingQueries);
      const now = new Date().getTime();
      let activeRequestId = null;

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.requestExpiresAt) {
          const expiryTime = new Date(data.requestExpiresAt).getTime();
          if (now < expiryTime) {
            activeRequestId = docSnap.id;
          }
        }
      });

      // If they already have an active request, just reopen that chat window for them
      if (activeRequestId) {
        setLocalConversationId(activeRequestId);
        localStorage.setItem("conversationId", activeRequestId);
        setFaqStep(0);
        setShowMoreQuestionPrompt(false);
        return;
      }

      // 2. Set Expiry Timestamp (5 Minutes from now)
      const expiresAt = new Date(now + 5 * 60 * 1000).toISOString();

      const convoId = await createNewConversation(db, authUser, userData, "I would like to speak to an agent.");
      await updateDoc(doc(db, "conversations", convoId), {
        status: "pending",
        request: "sent",
        updatedAt: new Date().toISOString(),
        requestExpiresAt: expiresAt
      });

      setLocalConversationId(convoId);
      localStorage.setItem("conversationId", convoId);
      setFaqStep(0);
      setShowMoreQuestionPrompt(false);
    } catch (error) {
      console.error("Error requesting agent:", error);
    }
  };

  const handleEndChat = async () => {
    if (!localConversationId) return;
    const confirm = window.confirm("Are you sure you want to end this chat?");
    if (!confirm) return;

    const success = await archiveConversation(db, localConversationId);
    if (success) {
      resetChat();
    } else {
      alert("Failed to archive chat. Please try again.");
    }
  };

  const handleFaqSelection = async (option, step) => {
    if (!localConversationId) return;

    await addDoc(collection(db, "conversations", localConversationId, "messages"), {
      text: option.text,
      senderId: authUser?.uid || "guest",
      timestamp: new Date(),
      status: "faqchat",
    });

    if (option.id === "contact" || option.value === "contact") {
      await requestLiveAgent();
      return;
    }

    let responseText = '';
    let shouldPromptMoreQuestions = false;

    if (step === 1) {
      const responseData = faqFollowUp[option.id];
      if (responseData && responseData.message) {
        responseText = responseData.message;
        setSelectedCategory(option.id);
        setFaqStep(2);
      }
    } else if (step === 2) {
      const category = selectedCategory;
      const subId = option.id;
      switch (category) {
        case 'delivery':
          switch (subId) {
            case 'when':
              responseText = "To check when your package will arrive, please enter your package number below.";
              setIsTrackingInput(true);
              setTrackingAction('delivery_when');
              break;
            case 'delay':
              responseText = "Possible reasons for delays that cannot be controlled include severe weather conditions, natural disasters, port congestions, and other unforeseen events.";
              shouldPromptMoreQuestions = true;
              break;
            case 'done':
              responseText = "Done! If you need more help, select another topic.";
              setFaqStep(1);
              return;
            case 'contact':
              await requestLiveAgent();
              return;
          }
          break;
        case 'tracking':
          switch (subId) {
            case 'how':
              responseText = "To track your package, please enter your package number below.";
              setIsTrackingInput(true);
              setTrackingAction('tracking_how');
              break;
            case 'update':
              responseText = "If you're not seeing updates, please enter your package number to check the current status.";
              setIsTrackingInput(true);
              setTrackingAction('tracking_update');
              break;
            case 'done':
              responseText = "Done! If you need more help, select another topic.";
              setFaqStep(1);
              return;
            case 'contact':
              await requestLiveAgent();
              return;
          }
          break;
        case 'shipping':
          switch (subId) {
            case 'cost':
              responseText = "Shipping costs depend on the package weight, dimensions, origin, destination, and selected transport mode (Air, Sea, Road). For an accurate quote, please provide more details or contact us.";
              shouldPromptMoreQuestions = true;
              break;
            case 'free':
              responseText = "Free shipping is available for orders over a certain amount or during special promotions. Check our website for current offers or contact support for details.";
              shouldPromptMoreQuestions = true;
              break;
            case 'done':
              responseText = "Done! If you need more help, select another topic.";
              setFaqStep(1);
              return;
            case 'contact':
              await requestLiveAgent();
              return;
          }
          break;
        case 'other':
          switch (subId) {
            case 'general':
              responseText = "For general inquiries, please provide more details, or type your question to request a live agent.";
              setFaqStep(0);
              return;
            case 'done':
              responseText = "Done! If you need more help, select another topic.";
              setFaqStep(1);
              return;
            case 'contact':
              await requestLiveAgent();
              return;
          }
          break;
        default:
          break;
      }
    }

    if (responseText) {
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: responseText,
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });
    }

    if (shouldPromptMoreQuestions) {
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: "Do you have another question?",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });
      setShowMoreQuestionPrompt(true);
    }
  };

  const handleMoreQuestions = async (wantsMore) => {
    setShowMoreQuestionPrompt(false);
    if (wantsMore) {
      setFaqStep(1);
    } else {
      await addDoc(collection(db, "conversations", localConversationId, "messages"), {
        text: "Thank you for using our FAQ assistant. If you need further assistance, feel free to chat with a live agent.",
        senderId: "system",
        timestamp: new Date(),
        status: "faqchat",
      });
      setFaqStep(0);
    }
  };

  const handleSendMessage = async () => {
    if (isTrackingInput) {
      if (!trackingPackageNumber.trim()) return;
      const success = await handleTrackSearch(trackingPackageNumber);
      if (success) {
        setTrackingPackageNumber('');
        setIsTrackingInput(false);
        setTrackingAction(null);
      }
      return;
    }

    if (!authUser) {
      if (loginModalRef.current) {
        loginModalRef.current.openModal();
      }
      return;
    }

    if (!newMessage.trim()) return;

    if (conversationStatus === "faqchat") {
      await requestLiveAgent();
    }

    if (localConversationId) {
      await sendMessage(db, localConversationId, newMessage, authUser.uid);
      setNewMessage("");
    }
  };

  // --- Logic for Admin/Staff ---
  const isAdminOrStaff = role === 'admin' || role === 'staff';

  const isInputDisabled =
    conversationStatus === "ended" ||
    conversationStatus === "rejected" ||
    (conversationStatus === "pending" && !isAdminOrStaff);

  let inputPlaceholder = "Type your message...";
  if (!authUser) inputPlaceholder = "Log in to chat...";
  else if (conversationStatus === 'faqchat' && !isTrackingInput) inputPlaceholder = "Type to request an agent...";
  else if (conversationStatus === 'pending' && !isAdminOrStaff) inputPlaceholder = "Waiting for an agent to accept...";
  else if (isTrackingInput) inputPlaceholder = "Enter your package number";

  const renderMessage = (msg) => {
    const isSystem = msg.senderId === "system";
    const isMe = msg.senderId === authUser?.uid || msg.senderId === "guest";

    return (
      <div key={msg.id} className={`flex flex-col mb-3 ${isSystem ? 'items-center' : (isMe ? 'items-end' : 'items-start')}`}>
        <div className={`
          max-w-[80%] p-3 rounded-lg text-sm break-words shadow-sm
          ${isSystem ? "bg-gray-100 text-gray-800 border border-gray-200 text-center italic" : ""}
          ${isMe && !isSystem ? "bg-blue-600 text-white rounded-br-none" : ""}
          ${!isMe && !isSystem ? "bg-white border border-gray-200 text-gray-800 rounded-bl-none" : ""}
        `}>
          {msg.text}
        </div>
        {!isSystem && (
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {msg.timestamp?.seconds
              ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "Just now"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col w-full bg-gray-50 ${widgetMode ? "h-full" : "h-screen md:h-full"}`}>

      {/* --- HEADER --- */}
      {!isAdminOrStaff && (
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
          <div>
            <h4 className="font-bold text-gray-800 text-lg">Support Chat</h4>
            <p className="text-xs text-gray-500">
              {isReadOnly
                ? `Archived • Duration: ${conversationData?.duration || 'N/A'}`
                : (conversationStatus === 'approved' ? 'Live with Agent' : 'Automated Support')
              }
            </p>
          </div>
        </div>
      )}

      {/* --- BODY --- */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {isPreChat && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-2">How can we help?</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Select an option to get started instantly.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <button
                onClick={startFaqChat}
                className="w-full p-4 bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Browse FAQs</p>
                  <p className="text-xs text-gray-500">Get instant answers</p>
                </div>
              </button>

              <button
                onClick={requestLiveAgent}
                className="w-full p-4 bg-white border border-green-200 rounded-xl shadow-sm hover:shadow-md hover:bg-green-50 transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">
                    {authUser ? "Chat with Support" : "Log in to Chat"}
                  </p>
                  <p className="text-xs text-gray-500">Talk to a human agent</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {!isPreChat && (
          <>
            {messages.map((msg) => renderMessage(msg))}

            {!isReadOnly && conversationStatus === 'pending' && (
              <div className="text-center py-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full animate-pulse">
                  Waiting for an agent to join...
                </span>
              </div>
            )}

            {!isReadOnly && (conversationStatus === 'ended' || conversationStatus === 'rejected') && (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <span className="text-gray-500 text-sm italic bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                  This conversation has ended.
                </span>
                <button
                  onClick={resetChat}
                  className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 hover:shadow transition font-medium"
                >
                  Start New Chat
                </button>
              </div>
            )}

            {isReadOnly && (
              <div className="text-center py-4">
                <span className="text-gray-400 text-xs italic bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  Conversation Ended • {conversationData?.duration}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* --- FOOTER / CONTROLS --- */}
      {!isPreChat && !isReadOnly && (
        <div className="p-3 bg-white border-t border-gray-200">

          {conversationStatus === 'faqchat' && faqStep > 0 && !isTrackingInput && !showMoreQuestionPrompt && (
            <div className="flex flex-wrap gap-2 mb-3">
              {faqStep === 1 && faqStep1Options && faqStep1Options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFaqSelection(opt, 1)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-full border border-blue-200 hover:bg-blue-600 hover:text-white transition"
                >
                  {opt.text}
                </button>
              ))}

              {faqStep === 2 && selectedCategory && faqFollowUp[selectedCategory]?.options && (
                <>
                  {faqFollowUp[selectedCategory].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleFaqSelection(opt, 2)}
                      className="px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-full border border-green-200 hover:bg-green-600 hover:text-white transition"
                    >
                      {opt.text}
                    </button>
                  ))}
                  <button
                    onClick={() => setFaqStep(1)}
                    className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700 underline"
                  >
                    Back to Topics
                  </button>
                </>
              )}
            </div>
          )}

          {conversationStatus === 'faqchat' && showMoreQuestionPrompt && (
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handleMoreQuestions(true)}
                className="px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-full border border-green-200 hover:bg-green-600 hover:text-white transition"
              >
                Yes, another question
              </button>
              <button
                onClick={() => handleMoreQuestions(false)}
                className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-600 hover:text-white transition"
              >
                No, I'm done
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              className={`flex-1 p-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-lg text-sm outline-none transition
                ${isInputDisabled || (isTrackingInput && searchLoading) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              placeholder={inputPlaceholder}
              value={isTrackingInput ? trackingPackageNumber : newMessage}
              onChange={(e) => isTrackingInput ? setTrackingPackageNumber(e.target.value) : setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isInputDisabled || (isTrackingInput && searchLoading)}
            />
            <button
              onClick={handleSendMessage}
              disabled={isInputDisabled || (isTrackingInput && searchLoading)}
              className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
                ${(isInputDisabled || (isTrackingInput && searchLoading)) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
              `}
            >
              {searchLoading ? 'Searching...' : (isTrackingInput ? 'Track' : 'Send')}
            </button>
          </div>
        </div>
      )}

      <LoginModal
        ref={loginModalRef}
        hideTrigger={true}
        isOpen={false}
        setIsOpen={() => { }}
      />
    </div>
  );
};

export default ChatWindow;