import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
} from "firebase/firestore";
import { auth, db } from "../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FaPaperPlane, FaArrowLeft, FaBoxOpen, FaCircle } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const ShipmentMessages = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConvo, setSelectedConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    // Auth + Convo Loading
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const q = query(
                    collection(db, "shipment_conversations"),
                    where("userId", "==", currentUser.uid),
                    orderBy("updatedAt", "desc")
                );
                const unsubConvos = onSnapshot(q, (snapshot) => {
                    const convosData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                    setConversations(convosData);

                    if (location.state?.convoId) {
                        const passedConvo = convosData.find((c) => c.id === location.state.convoId);
                        if (passedConvo) setSelectedConvo(passedConvo);
                    } else if (convosData.length > 0 && !selectedConvo) {
                        setSelectedConvo(convosData[0]);
                    }
                });
                return () => unsubConvos();
            }
        });
        return () => unsubAuth();
    }, [location.state]);

    // Messages Listener
    useEffect(() => {
        if (!selectedConvo) { setMessages([]); return; }
        const q = query(
            collection(db, "shipment_conversations", selectedConvo.id, "messages"),
            orderBy("timestamp", "asc")
        );
        const unsubMessages = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsubMessages();
    }, [selectedConvo]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !user || sending) return;
        setSending(true);
        try {
            await addDoc(collection(db, "shipment_conversations", selectedConvo.id, "messages"), {
                text: newMessage.trim(),
                senderId: user.uid,
                senderName: user.displayName || user.email || "User",
                timestamp: serverTimestamp(),
            });
            await updateDoc(doc(db, "shipment_conversations", selectedConvo.id), {
                updatedAt: serverTimestamp(),
            });
            setNewMessage("");
            inputRef.current?.focus();
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    };

    const formatTimestamp = (ts) => {
        if (!ts) return "";
        let date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (ts) => {
        if (!ts) return "";
        let date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    };

    const isArchived = selectedConvo?.status === "archived";

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
                <MdLocalShipping size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">Please log in to view your shipment messages.</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">

            {/* ── SIDEBAR ── */}
            <div className={`flex-shrink-0 w-full md:w-72 lg:w-80 flex flex-col bg-white border-r border-gray-200 shadow-sm ${selectedConvo ? "hidden md:flex" : "flex"}`}>
                {/* Sidebar Header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <MdLocalShipping size={18} className="text-blue-600" />
                        <h1 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase">Shipment Chats</h1>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-gray-300">
                            <FaBoxOpen size={32} className="mb-3 opacity-40" />
                            <p className="text-xs font-bold uppercase tracking-wider">No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map((c) => {
                            const isActive = selectedConvo?.id === c.id;
                            const archived = c.status === "archived";
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedConvo(c)}
                                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-all flex items-start gap-3 ${isActive ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50 border-l-2 border-l-transparent"}`}
                                >
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        <MdLocalShipping size={16} />
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={`text-xs font-bold truncate ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                                                #{c.packageNumber}
                                            </span>
                                            {archived && (
                                                <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full uppercase flex-shrink-0">
                                                    Archived
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            {c.lastMessage || "No messages yet"}
                                        </p>
                                        <p className="text-[9px] text-gray-300 mt-0.5">{formatDate(c.updatedAt)}</p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── MAIN CHAT PANEL ── */}
            <div className={`flex-1 flex flex-col overflow-hidden ${!selectedConvo ? "hidden md:flex" : "flex"}`}>
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-200 shadow-sm">
                            {/* Mobile back button */}
                            <button
                                onClick={() => setSelectedConvo(null)}
                                className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                                <FaArrowLeft size={12} />
                            </button>

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <MdLocalShipping size={16} className="text-white" />
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-extrabold text-gray-800 truncate">
                                        Shipment #{selectedConvo.packageNumber}
                                    </h2>
                                    {isArchived ? (
                                        <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                            Archived
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 flex-shrink-0">
                                            <FaCircle size={5} /> Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400">Support chat for your shipment</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)" }}>
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300 py-12">
                                    <MdLocalShipping size={40} className="mb-3 opacity-30" />
                                    <p className="text-xs font-bold uppercase tracking-wider">No messages yet</p>
                                    <p className="text-[10px] mt-1 text-gray-300">Send a message to get started</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isSystem = msg.senderId === "system";
                                    const isMe = msg.senderId === user.uid;

                                    // Date separator
                                    const prevMsg = messages[index - 1];
                                    const currDate = msg.timestamp
                                        ? (typeof msg.timestamp.toDate === "function" ? msg.timestamp.toDate() : new Date(msg.timestamp)).toDateString()
                                        : null;
                                    const prevDate = prevMsg?.timestamp
                                        ? (typeof prevMsg.timestamp.toDate === "function" ? prevMsg.timestamp.toDate() : new Date(prevMsg.timestamp)).toDateString()
                                        : null;
                                    const showDateSep = currDate && currDate !== prevDate;

                                    return (
                                        <React.Fragment key={msg.id || index}>
                                            {showDateSep && (
                                                <div className="flex items-center justify-center my-4">
                                                    <div className="bg-white/70 text-gray-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                                        {currDate}
                                                    </div>
                                                </div>
                                            )}

                                            {isSystem ? (
                                                <div className="flex justify-center my-3">
                                                    <div className="bg-white/80 text-gray-500 text-[11px] font-medium px-4 py-1.5 rounded-full shadow-sm border border-gray-100 max-w-[80%] text-center">
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-1`}>
                                                    <div className={`relative max-w-[72%] px-4 py-2.5 text-sm shadow-sm ${
                                                        isMe
                                                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                                            : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                                                    }`}>
                                                        {msg.text}
                                                    </div>
                                                    <span className={`text-[10px] mt-1 px-1 ${isMe ? "text-blue-400" : "text-gray-400"}`}>
                                                        {formatTimestamp(msg.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3">
                            {isArchived ? (
                                <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-600 rounded-full py-2.5 px-4 text-xs font-semibold">
                                    This conversation is archived — you can no longer send messages.
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Type a message about your shipment..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-200"
                                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { handleSendMessage(e); } }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                                    >
                                        <FaPaperPlane size={13} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <MdLocalShipping size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-300">Select a conversation</p>
                        <p className="text-[11px] text-gray-300 mt-1">Choose a shipment from the sidebar to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipmentMessages;
