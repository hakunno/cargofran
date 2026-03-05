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
import { Form, Button, ListGroup } from "react-bootstrap";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";

const ShipmentMessages = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConvo, setSelectedConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle Authentication and Convo Loading
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch User's Shipment Conversations
                const q = query(
                    collection(db, "shipment_conversations"),
                    where("userId", "==", currentUser.uid),
                    orderBy("updatedAt", "desc")
                );

                const unsubConvos = onSnapshot(q, (snapshot) => {
                    const convosData = snapshot.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    }));
                    setConversations(convosData);

                    // If navigated here with a specific state from ShipmentHistory.jsx
                    if (location.state?.convoId) {
                        const passedConvo = convosData.find((c) => c.id === location.state.convoId);
                        if (passedConvo) setSelectedConvo(passedConvo);
                    } else if (convosData.length > 0 && !selectedConvo) {
                        // Wait, don't auto select if we don't want to, but it's good UX
                        setSelectedConvo(convosData[0]);
                    }
                });

                return () => unsubConvos();
            }
        });
        return () => unsubAuth();
    }, [location.state]);

    // Fetch Messages for Selected Convo
    useEffect(() => {
        if (!selectedConvo) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(db, "shipment_conversations", selectedConvo.id, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubMessages = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setMessages(msgs);
        });

        return () => unsubMessages();
    }, [selectedConvo]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !user) return;

        try {
            await addDoc(
                collection(db, "shipment_conversations", selectedConvo.id, "messages"),
                {
                    text: newMessage.trim(),
                    senderId: user.uid,
                    senderName: user.displayName || user.email || "User",
                    timestamp: serverTimestamp(),
                }
            );

            await updateDoc(doc(db, "shipment_conversations", selectedConvo.id), {
                updatedAt: serverTimestamp(),
            });

            setNewMessage("");
        } catch (err) {
            console.error("Error sending message: ", err);
        }
    };

    const formatTimestamp = (ts) => {
        if (!ts) return "";
        let date = null;
        if (typeof ts.toDate === "function") date = ts.toDate();
        else if (ts instanceof Date) date = ts;
        else date = new Date(ts);

        if (isNaN(date.getTime())) return "";
        return date.toLocaleString();
    };

    if (!user) return <div className="p-4 text-center">Please login to view your shipment messages.</div>;

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-50 border-t">
            {/* Sidebar - Conversations List */}
            <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r h-full overflow-y-auto ${selectedConvo ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">Active Shipments</h2>
                </div>
                <ListGroup variant="flush">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No active shipment conversations.</div>
                    ) : (
                        conversations.map((c) => (
                            <ListGroup.Item
                                key={c.id}
                                className={`flex flex-col p-3 border-b cursor-pointer transition-colors ${selectedConvo?.id === c.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedConvo(c)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800 truncate">
                                        Tracking #: {c.packageNumber}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Updated: {formatTimestamp(c.updatedAt)}
                                    </span>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col h-full bg-white relative ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
                {selectedConvo ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center p-4 border-b bg-gray-50 text-gray-800">
                            <button
                                onClick={() => setSelectedConvo(null)}
                                className="mr-3 p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors md:hidden"
                                aria-label="Back to conversations list"
                            >
                                <FaArrowLeft />
                            </button>
                            <div className="flex flex-col">
                                <div className="font-bold text-lg">
                                    Shipment {selectedConvo.packageNumber}
                                </div>
                                {selectedConvo.status === "archived" && (
                                    <div className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block w-fit mt-1">
                                        This conversation is archived.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 my-4 text-sm">
                                        No messages yet. Send a message to the admin.
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isSystem = msg.senderId === "system";
                                        const isMe = msg.senderId === user.uid;

                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex flex-col max-w-[75%] ${isSystem
                                                    ? "mx-auto items-center"
                                                    : isMe
                                                        ? "ml-auto items-end"
                                                        : "mr-auto items-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${isSystem
                                                        ? "bg-slate-200 text-slate-800 rounded-md border text-center font-medium"
                                                        : isMe
                                                            ? "bg-blue-600 text-white rounded-tr-none"
                                                            : "bg-white text-gray-800 border rounded-tl-none"
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                                {!isSystem && (
                                                    <span className="text-[10px] text-gray-500 mt-1 px-1">
                                                        {formatTimestamp(msg.timestamp)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Form */}
                        <div className="p-4 bg-white border-t">
                            {selectedConvo.status === "archived" ? (
                                <div className="text-center text-gray-500 py-2 border rounded-full bg-gray-50">
                                    This chat is archived. You can no longer send messages.
                                </div>
                            ) : (
                                <Form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type your message about this shipment..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="rounded-full shadow-sm"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="rounded-full flex items-center justify-center p-3"
                                        disabled={!newMessage.trim()}
                                    >
                                        <FaPaperPlane className="text-white" />
                                    </Button>
                                </Form>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg
                            className="w-16 h-16 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            ></path>
                        </svg>
                        <p className="text-lg">Select a shipment conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipmentMessages;
