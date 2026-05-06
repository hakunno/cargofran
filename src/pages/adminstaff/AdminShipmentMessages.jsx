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
import { FaArrowLeft, FaSearch, FaUserCircle, FaCommentSlash, FaTimesCircle, FaTruck, FaArchive, FaTrash, FaSortAmountDown } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

const AdminShipmentMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("active"); // 'active' or 'archived'
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filterType, setFilterType] = useState("all"); // 'all', 'package', 'general'

    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    // Modal fields
    const [usersList, setUsersList] = useState([]);
    const [userShipments, setUserShipments] = useState([]);
    const [selectedUserForChat, setSelectedUserForChat] = useState("");
    const [chatReasonType, setChatReasonType] = useState("shipment"); // "shipment" or "other"
    const [selectedPackageForChat, setSelectedPackageForChat] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [userSearchQuery, setUserSearchQuery] = useState(""); // Search for New Message modal

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
        return () => markAsSeen(null);
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

    const filteredConversations = conversations
        .filter((conv) => {
            const matchesStatus = (viewMode === "active" && conv.status !== "archived") || (viewMode === "archived" && conv.status === "archived");
            
            // Filter by Chat Type
            const isGeneral = conv.packageNumber === "General Inquiry";
            const matchesType = filterType === "all" || (filterType === "general" && isGeneral) || (filterType === "package" && !isGeneral);

            const name = (conv.userFullName || "").toLowerCase();
            const email = (conv.userEmail || "").toLowerCase();
            const pkg = (conv.packageNumber || "").toLowerCase();
            const q = searchQuery.toLowerCase();
            return matchesStatus && matchesType && (name.includes(q) || email.includes(q) || pkg.includes(q));
        })
        .sort((a, b) => {
            const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
            const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
            return timeB - timeA;
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
                {/* --- LEFT PANEL: Conversation List --- */}
                <div 
                    className={`${selectedConversationId ? "hidden md:flex" : "flex"} flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 h-full shadow-md z-10 
                    ${isSidebarOpen ? "w-full md:w-72" : "w-0 overflow-hidden md:w-0"}`}
                >
                    <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-3">
                        <div className="flex justify-center items-center px-1 relative">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase lexend">CHAT</h2>
                            <button 
                                onClick={() => { setViewMode(viewMode === 'active' ? 'archived' : 'active'); setSelectedConversationId(null); }}
                                className={`absolute right-1 p-1.5 rounded-md transition-all ${viewMode === 'archived' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-100'}`}
                                title="View Archived"
                            >
                                <FaArchive size={12} />
                            </button>
                        </div>

                        {/* NEW CLEAN TABS */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setFilterType("package")}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold rounded-md transition-all ${filterType === 'package' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaTruck size={12} /> Packages
                            </button>
                            <button 
                                onClick={() => setFilterType("general")}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold rounded-md transition-all ${filterType === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaCommentSlash size={12} /> Inquiries
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                                <input
                                    type="text"
                                    placeholder="Find chat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shadow-sm"
                                title="New Message"
                            >
                                <span className="text-xl leading-none">+</span>
                            </button>
                        </div>
                    </div>

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
                                            onClick={() => setSelectedConversationId(conv.id)}
                                            className={`group cursor-pointer px-4 py-2 transition-all duration-200 border-r-4 ${isActive ? "bg-blue-50 border-blue-600 shadow-inner" : "border-transparent hover:bg-gray-50"
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
                                                        <h5 className={`text-[9px] font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                                                            {conv.userFullName || "Unknown User"}
                                                        </h5>
                                                        {viewMode === 'archived' && conv.archivedAt && (
                                                            <span className="text-[7px] text-gray-400 font-bold uppercase">
                                                                {new Date(conv.archivedAt.seconds * 1000).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-[8px] font-bold text-gray-400 bg-gray-100 px-1 rounded">
                                                            {conv.packageNumber === 'General Inquiry' ? 'INQ' : `#${conv.packageNumber}`}
                                                        </span>
                                                        <p className="text-[8px] truncate text-gray-400 flex-1">
                                                            {conv.userEmail}
                                                        </p>
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
                    
                    {/* TOGGLE SIDEBAR BUTTON (Floating) */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -left-3 top-20 z-30 bg-white border border-gray-200 shadow-md p-1 rounded-full text-gray-400 hover:text-blue-600 transition-all hidden md:block"
                    >
                        {isSidebarOpen ? <FaArrowLeft size={12} /> : <span className="rotate-180 block"><FaArrowLeft size={12} /></span>}
                    </button>

                    {selectedConversationId && (
                        <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversationId(null)}
                                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                >
                                    <FaArrowLeft />
                                </button>
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-gray-800 text-base tracking-tight">
                                        {getActiveUserName()}
                                    </span>
                                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        SECURE CHANNEL
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
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">1. Find User</label>
                                <div className="relative mb-3">
                                    <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                                    <input
                                        type="text"
                                        placeholder="Type name or email..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg bg-gray-50 custom-scrollbar">
                                    {usersList
                                        .filter(u => {
                                            const search = userSearchQuery.toLowerCase();
                                            return (u.firstName || "").toLowerCase().includes(search) || 
                                                   (u.lastName || "").toLowerCase().includes(search) || 
                                                   (u.email || "").toLowerCase().includes(search);
                                        })
                                        .map(u => {
                                            const isSelected = selectedUserForChat === u.id;
                                            return (
                                                <div 
                                                    key={u.id} 
                                                    onClick={() => setSelectedUserForChat(u.id)}
                                                    className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-0 transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                                                >
                                                    <p className="text-[11px] font-bold leading-tight">
                                                        {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}` : "No Name"}
                                                    </p>
                                                    <p className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        {u.email}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                </div>
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
