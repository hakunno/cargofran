import React, { useState, useEffect } from "react";
import Sidebar from "../../component/adminstaff/Sidebar";
import { auth } from "../../jsfile/firebase";
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    getDocs,
    where,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import AdminShipmentChat from "../../component/adminstaff/AdminShipmentChat";
import { FaArrowLeft, FaSearch, FaUserCircle, FaCommentSlash, FaTimesCircle, FaTruck, FaArchive, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

const AdminShipmentMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("active"); // 'active' or 'archived'

    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    // Modal fields
    const [usersList, setUsersList] = useState([]);
    const [userShipments, setUserShipments] = useState([]);
    const [selectedUserForChat, setSelectedUserForChat] = useState("");
    const [chatReasonType, setChatReasonType] = useState("shipment"); // "shipment" or "other"
    const [selectedPackageForChat, setSelectedPackageForChat] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");

    // Get Current Admin ID
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const { markAsSeen } = useAdminNotifications();
    useEffect(() => {
        markAsSeen('shipmentChats');
    }, [markAsSeen]);

    // Fetch Shipment Conversations
    useEffect(() => {
        const q = query(collection(db, "shipment_conversations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConversations(convs);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Users for Dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "Users"));
                const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsersList(usersData.filter(u => u.role === "user" || !u.role));
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    // Fetch Shipments when User changes
    useEffect(() => {
        const fetchUserShipments = async () => {
            if (!selectedUserForChat) {
                setUserShipments([]);
                setSelectedPackageForChat("");
                return;
            }
            try {
                const pkgQuery = query(collection(db, "Packages"), where("userUid", "==", selectedUserForChat));
                const pkgSnap = await getDocs(pkgQuery);
                const pkgs = pkgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setUserShipments(pkgs);
                if (pkgs.length > 0) {
                    setSelectedPackageForChat(pkgs[0].packageNumber);
                } else {
                    setSelectedPackageForChat("");
                }
            } catch (err) {
                console.error("Error fetching user shipments:", err);
            }
        };
        fetchUserShipments();
    }, [selectedUserForChat]);

    const handleCreateNewShipmentChat = async (e) => {
        e.preventDefault();
        if (!selectedUserForChat) {
            toast.error("Please select a user.");
            return;
        }

        if (chatReasonType === "shipment" && !selectedPackageForChat) {
            toast.error("Please select a shipment from the dropdown or ensure the user has shipments.");
            return;
        }

        if (chatReasonType === "other" && !otherReasonText.trim()) {
            toast.error("Please enter a reason for contacting the user.");
            return;
        }

        setIsCreatingChat(true);
        try {
            const userObj = usersList.find(u => u.id === selectedUserForChat);
            if (!userObj) throw new Error("User not found");

            const packageSearch = chatReasonType === "shipment" ? selectedPackageForChat : "General Inquiry";

            // Check if conversation already exists for THIS user and THIS package
            const convQuery = query(
                collection(db, "shipment_conversations"),
                where("userId", "==", selectedUserForChat),
                where("packageNumber", "==", packageSearch),
                where("status", "==", "active")
            );
            const convSnap = await getDocs(convQuery);

            let convId = null;

            if (!convSnap.empty) {
                toast.info("Active chat already exists for this query. Opening it now.");
                convId = convSnap.docs[0].id;
            } else {
                const fullName = `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() || userObj.fullName || userObj.email || "Unknown User";

                const newConvRef = await addDoc(collection(db, "shipment_conversations"), {
                    userId: selectedUserForChat,
                    packageNumber: packageSearch,
                    adminId: currentUserId,
                    userEmail: userObj.email || "",
                    userFullName: fullName,
                    status: "active",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                convId = newConvRef.id;

                let systemMessageText = "";
                if (chatReasonType === "shipment") {
                    const pkgObj = userShipments.find(p => p.packageNumber === selectedPackageForChat);
                    systemMessageText = `Admin has started a chat regarding your shipment #${selectedPackageForChat}.`;
                    if (pkgObj) {
                        systemMessageText += `\nStatus: ${pkgObj.status || "N/A"}\nCarrier: ${pkgObj.carrier || "N/A"}`;
                    }
                } else {
                    systemMessageText = `Reason for contact: ${otherReasonText.trim()}`;
                }

                await addDoc(collection(db, "shipment_conversations", convId, "messages"), {
                    senderId: currentUserId,
                    senderRole: "admin",
                    text: systemMessageText,
                    timestamp: serverTimestamp(),
                    isSystemMessage: true
                });

                await addDoc(collection(db, "userNotifications"), {
                    userId: selectedUserForChat,
                    title: "New Message from Admin",
                    message: `An admin has started a chat with you regarding: ${packageSearch}.`,
                    read: false,
                    createdAt: serverTimestamp(),
                    relatedId: convId,
                    type: "shipment_message"
                });

                toast.success("New chat created!");
            }

            setSelectedConversationId(convId);
            setShowNewChatModal(false);

            setSelectedUserForChat("");
            setChatReasonType("shipment");
            setSelectedPackageForChat("");
            setOtherReasonText("");

        } catch (err) {
            console.error(err);
            toast.error("Error creating chat.");
        } finally {
            setIsCreatingChat(false);
        }
    };

    const archiveConversation = async (convId) => {
        try {
            await updateDoc(doc(db, "shipment_conversations", convId), {
                status: "archived",
                archivedAt: serverTimestamp(),
            });
            toast.success("Chat archived.");
            setSelectedConversationId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to archive chat.");
        }
    };

    const deleteConversation = async (convId) => {
        if (!window.confirm("Are you sure you want to permanently delete this conversation and all its messages?")) return;
        try {
            const messagesSnap = await getDocs(collection(db, "shipment_conversations", convId, "messages"));
            const deletePromises = messagesSnap.docs.map((docSnap) =>
                deleteDoc(doc(db, "shipment_conversations", convId, "messages", docSnap.id))
            );
            await Promise.all(deletePromises);
            await deleteDoc(doc(db, "shipment_conversations", convId));

            toast.success("Chat deleted.");
            setSelectedConversationId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete chat.");
        }
    };

    const filteredConversations = conversations.filter((conv) => {
        const matchesStatus = (viewMode === "active" && conv.status !== "archived") || (viewMode === "archived" && conv.status === "archived");
        const name = (conv.userFullName || "").toLowerCase();
        const email = (conv.userEmail || "").toLowerCase();
        const pkg = (conv.packageNumber || "").toLowerCase();
        const q = searchQuery.toLowerCase();
        return matchesStatus && (name.includes(q) || email.includes(q) || pkg.includes(q));
    });

    const getActiveUserName = () => {
        const conv = filteredConversations.find(c => c.id === selectedConversationId);
        if (!conv) return "Shipment Chat";
        return `Shipment ${conv.packageNumber} - ${conv.userFullName || conv.userEmail}`;
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col md:flex-row md:ml-64 h-full relative">
                <div className={`${selectedConversationId ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 bg-white border-r border-gray-200 h-full shadow-sm z-10`}>
                    <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Contact User</h2>
                        </div>

                        {/* TOGGLE BUTTONS */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => { setViewMode('active'); setSelectedConversationId(null); }}
                                className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 text-xs font-medium rounded-md transition-all ${viewMode === 'active'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => { setViewMode('archived'); setSelectedConversationId(null); }}
                                className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 text-xs font-medium rounded-md transition-all ${viewMode === 'archived'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <FaArchive /> Archived
                            </button>
                        </div>

                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition shadow-sm"
                        >
                            + New Message
                        </button>

                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search package or user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

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
                                            onClick={() => setSelectedConversationId(conv.id)}
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

                                                            {/* Display Date for Archive */}
                                                            {viewMode === 'archived' && conv.archivedAt && (
                                                                <span className="text-[10px] text-gray-400">
                                                                    {new Date(conv.archivedAt.seconds * 1000).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className={`text-xs truncate ${isActive ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                                                            {conv.userEmail}
                                                        </p>

                                                        <div className="mt-1 text-xs text-gray-400 truncate">
                                                            Package {conv.packageNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                <div className={`flex-1 flex flex-col bg-gray-50 h-full relative ${selectedConversationId ? "block" : "hidden md:flex"}`}>
                    {selectedConversationId && (
                        <div className="flex items-center justify-between bg-white border-b p-3 shadow-sm sticky top-0 z-20">
                            <div className="flex items-center">
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
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {viewMode === "active" ? (
                                    <button
                                        onClick={() => archiveConversation(selectedConversationId)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-sm font-medium transition"
                                        title="Archive Chat"
                                    >
                                        <FaArchive /> Archive
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => deleteConversation(selectedConversationId)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition"
                                        title="Delete Chat Permanently"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedConversationId ? (
                        <div className="flex-1 h-full overflow-hidden flex flex-col">
                            <AdminShipmentChat conversationId={selectedConversationId} currentAdminId={currentUserId} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <FaUserCircle size={48} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Chat Selected</h3>
                            <p className="text-gray-400 text-center max-w-sm">Select a shipment conversation to view details.</p>
                        </div>
                    )}
                </div>
            </div>

            {showNewChatModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
                        <button onClick={() => setShowNewChatModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <FaTimesCircle size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Start New Chat</h3>
                        <form onSubmit={handleCreateNewShipmentChat} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                                <select
                                    value={selectedUserForChat}
                                    onChange={(e) => setSelectedUserForChat(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select a user...</option>
                                    {usersList.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""} (${u.email})` : u.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedUserForChat && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                    <select
                                        value={chatReasonType}
                                        onChange={(e) => setChatReasonType(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="shipment">Specific Shipment</option>
                                        <option value="other">Other / General Inquiry</option>
                                    </select>
                                </div>
                            )}

                            {selectedUserForChat && chatReasonType === "shipment" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Shipment</label>
                                    {userShipments.length > 0 ? (
                                        <select
                                            value={selectedPackageForChat}
                                            onChange={(e) => setSelectedPackageForChat(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" disabled>Select a shipment...</option>
                                            {userShipments.map(s => (
                                                <option key={s.id} value={s.packageNumber}>
                                                    #{s.packageNumber} ({s.status || "No Status"})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded italic">This user has no shipments. Please select "Other" to message them.</p>
                                    )}
                                </div>
                            )}

                            {selectedUserForChat && chatReasonType === "other" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Contact</label>
                                    <textarea
                                        required
                                        value={otherReasonText}
                                        onChange={(e) => setOtherReasonText(e.target.value)}
                                        placeholder="Type the reason you are contacting this user..."
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isCreatingChat || (!selectedPackageForChat && chatReasonType === 'shipment')}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition"
                            >
                                {isCreatingChat ? "Creating..." : "Start Chat"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShipmentMessages;
