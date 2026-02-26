import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../jsfile/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    where
} from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminShipmentChat = ({ conversationId, currentAdminId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const [packageDetails, setPackageDetails] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!conversationId) return;

        const q = query(
            collection(db, "shipment_conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setMessages(msgs);
        });

        return () => unsub();
    }, [conversationId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;

        try {
            await addDoc(
                collection(db, "shipment_conversations", conversationId, "messages"),
                {
                    text: newMessage.trim(),
                    senderId: currentAdminId,
                    senderName: "Support Admin",
                    timestamp: serverTimestamp(),
                }
            );

            await updateDoc(doc(db, "shipment_conversations", conversationId), {
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

    const handleViewShipmentInfo = async () => {
        setIsLoadingDetails(true);
        setShowInfoModal(true);
        try {
            const convSnap = await getDoc(doc(db, "shipment_conversations", conversationId));
            if (!convSnap.exists()) throw new Error("Conversation not found");
            const convData = convSnap.data();
            const pkgNum = convData.packageNumber;

            if (!pkgNum) throw new Error("No package number linked to this chat.");

            const pkgQuery = query(collection(db, "Packages"), where("packageNumber", "==", pkgNum));
            const pkgSnap = await getDocs(pkgQuery);

            if (pkgSnap.empty) throw new Error("Package data not found.");

            setPackageDetails(pkgSnap.docs[0].data());
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Could not load shipment details.");
            setShowInfoModal(false);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 relative">

            {/* Top Bar inside the chat window */}
            <div className="bg-white p-3 border-b flex justify-between items-center shadow-sm sticky top-0 z-10">
                <span className="text-gray-600 font-medium text-sm">Thread Context</span>
                <button
                    onClick={handleViewShipmentInfo}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                >
                    <FaInfoCircle />
                    View Shipment Info
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 my-4 text-sm">
                            No messages yet.
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isSystem = msg.senderId === "system";
                            const isMe = msg.senderId === currentAdminId;

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

            <div className="p-4 bg-white border-t">
                <Form onSubmit={handleSendMessage} className="flex gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Reply to user regarding this shipment..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="rounded-full shadow-sm"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="rounded-full flex items-center justify-center p-3 w-12 h-12"
                        disabled={!newMessage.trim()}
                    >
                        <FaPaperPlane className="text-white" />
                    </Button>
                </Form>
            </div>

            {/* Shipment Details Modal Overlay */}
            {showInfoModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setShowInfoModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Shipment Information</h3>

                        {isLoadingDetails ? (
                            <div className="text-center py-10 text-gray-500">Loading details...</div>
                        ) : packageDetails ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-gray-500">Tracking Number:</div>
                                    <div className="font-semibold">{packageDetails.packageNumber}</div>

                                    <div className="text-gray-500">Status:</div>
                                    <div className="font-bold text-blue-600">{packageDetails.packageStatus}</div>

                                    <div className="text-gray-500">Shipper Name:</div>
                                    <div className="font-medium text-gray-800">{packageDetails.shipperName}</div>

                                    <div className="text-gray-500">Mobile:</div>
                                    <div className="text-gray-800">{packageDetails.mobile}</div>

                                    <div className="text-gray-500">Email:</div>
                                    <div className="text-gray-800 break-all">{packageDetails.email}</div>

                                    <div className="text-gray-500">Transport Mode:</div>
                                    <div className="text-gray-800">{packageDetails.transportMode}</div>

                                    <div className="text-gray-500">Route:</div>
                                    <div className="text-gray-800">{packageDetails.senderCountry} &rarr; {packageDetails.destinationCountry}</div>
                                </div>

                                {packageDetails.packages && packageDetails.packages.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="font-semibold text-gray-700 mb-2">Package Pieces</h4>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm space-y-3">
                                            {packageDetails.packages.map((pkg, i) => (
                                                <div key={i} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                                    <div><span className="text-gray-500">Weight:</span> {pkg.weight} kg</div>
                                                    <div><span className="text-gray-500">Dimensions:</span> {pkg.length} x {pkg.width} x {pkg.height} cm</div>
                                                    {pkg.contents && <div><span className="text-gray-500">Contents:</span> {pkg.contents}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-red-500">Could not load shipment data.</div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShipmentChat;
