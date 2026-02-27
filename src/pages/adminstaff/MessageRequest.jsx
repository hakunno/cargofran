import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Badge } from "react-bootstrap";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  addDoc, // Imported addDoc
  orderBy,
  serverTimestamp // Imported serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../../jsfile/firebase";
import Sidebar from "../../component/adminstaff/Sidebar";
import { logActivity } from "../../modals/StaffActivity.jsx";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]); // Pending conversations
  const [historyConversations, setHistoryConversations] = useState([]); // History from separate DB
  const [showModal, setShowModal] = useState(false); // Detail modal
  const [showHistoryModal, setShowHistoryModal] = useState(false); // History List modal
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminName, setAdminName] = useState('');

  const historyTableRef = useRef();

  const [now, setNow] = useState(Date.now());

  // Live timer for countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch PENDING conversations (From active 'conversations' collection)
  useEffect(() => {
    const convRef = collection(db, "conversations");
    const q = query(
      convRef,
      where("status", "==", "pending"),
      where("request", "==", "sent")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Filter out any that have firmly expired by more than 5 minutes past their expiry 
      // just so the list doesn't get flooded with ancient dead requests, but we let 
      // the UI handle the actual exact 00:00 live countdown.
      const convos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch REQUEST HISTORY (From NEW 'conversation_requests_history' collection)
  useEffect(() => {
    const historyRef = collection(db, "conversation_requests_history");
    const q = query(historyRef, orderBy("processedAt", "desc")); // Order by when it was processed

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setHistoryConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Admin Name for Print Footer
  useEffect(() => {
    const fetchAdminName = async () => {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      setAdminName(`${adminFirstName} ${adminLastName}`.trim());
    };
    fetchAdminName();
  }, []);

  const fetchAdminDetails = async () => {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      return { adminFirstName: "Unknown", adminLastName: "" };
    }

    let adminFirstName = "";
    let adminLastName = "";

    if (currentAdmin.displayName) {
      const nameParts = currentAdmin.displayName.split(" ");
      adminFirstName = nameParts[0];
      adminLastName = nameParts.slice(1).join(" ");
    } else {
      const adminRef = doc(db, "Users", currentAdmin.uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        adminFirstName = adminData.firstName || "Unknown";
        adminLastName = adminData.lastName || "";
      }
    }

    return { adminFirstName, adminLastName };
  };

  const handleShowDetails = async (conv) => {
    setSelectedConversation(conv);
    setShowModal(true);

    // If it's a pending request, messages are in the subcollection of 'conversations'
    // If it's history, we might have stored messages in the history doc, or we fetch from original if not deleted.
    // For now, assuming pending request logic is primary for this modal.
    if (conv.originalConversationId || conv.id) {
      const targetId = conv.originalConversationId || conv.id;
      const messagesRef = collection(db, "conversations", targetId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      // Note: If original is deleted, this might return empty. 
      // For 'Request History', usually we just want to see who accepted/rejected it.
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setMessages(msgs);
      });
    }
  };

  // --- APPROVE LOGIC ---
  const handleApprove = async () => {
    if (!selectedConversation) return;
    const confirmApprove = window.confirm("Approve this conversation?");
    if (!confirmApprove) return;

    try {
      const currentAdmin = auth.currentUser;
      if (!currentAdmin) {
        toast.error("Admin not logged in.");
        return;
      }

      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

      // 1. Update Active DB to 'approved' (This pushes it to Chat Window)
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        status: "approved",
        adminFirstName,
        adminLastName,
        adminId: currentAdmin.uid,
        approvedAt: serverTimestamp()
      });

      // 2. Add to separate History DB
      await addDoc(collection(db, "conversation_requests_history"), {
        ...selectedConversation, // Copy user details
        originalConversationId: selectedConversation.id,
        status: "approved",
        processedBy: adminFullName,
        processedAt: serverTimestamp(),
        adminId: currentAdmin.uid
      });

      await logActivity(adminFullName, `Approved conversation ${selectedConversation.id}`);

      setShowModal(false);
      setSelectedConversation(null);
      setMessages([]);
      toast.success("Conversation approved successfully!");
    } catch (error) {
      console.error("Error approving conversation:", error);
      toast.error("Failed to approve conversation. Please try again.");
    }
  };

  // --- REJECT LOGIC ---
  const handleReject = async () => {
    if (!selectedConversation) return;
    const confirmReject = window.confirm("Reject this conversation?");
    if (!confirmReject) return;
    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();
      const currentAdmin = auth.currentUser;

      // 1. Add to separate History DB
      await addDoc(collection(db, "conversation_requests_history"), {
        ...selectedConversation, // Copy user details
        originalConversationId: selectedConversation.id,
        status: "rejected",
        processedBy: adminFullName,
        processedAt: serverTimestamp(),
        adminId: currentAdmin ? currentAdmin.uid : 'unknown'
      });

      // 2. Update Active DB to 'rejected' (Removes from Pending list)
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        status: "rejected",
        rejectedAt: serverTimestamp()
      });

      await logActivity(adminFullName, `Rejected conversation ${selectedConversation.id}`);

      setShowModal(false);
      setSelectedConversation(null);
      setMessages([]);
      toast.success("Conversation rejected successfully!");
    } catch (error) {
      console.error("Error rejecting conversation:", error);
      toast.error("Failed to reject conversation. Please try again.");
    }
  };

  const getFullName = (conv) => {
    return conv.userFullName?.trim() || `${conv.firstName || ""} ${conv.lastName || ""}`.trim() || "N/A";
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate ? timestamp.toDate().toLocaleString() : new Date(timestamp).toLocaleString();
  };

  const getCountdown = (expiresAtIso) => {
    if (!expiresAtIso) return { expired: false, text: "No Expiry" };
    const expiresMs = new Date(expiresAtIso).getTime();
    const diff = expiresMs - now;
    if (diff <= 0) return { expired: true, text: "Expired" };

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return { expired: false, text: `${mins}:${secs.toString().padStart(2, '0')}` };
  };

  // --- CSV Export Logic for History ---
  const escapeCsv = (str) => {
    if (str === null || str === undefined) return "";
    const stringValue = String(str);
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleHistoryExportCSV = () => {
    if (historyConversations.length === 0) {
      toast.info("No data to export.");
      return;
    }
    const headers = ["User Name", "Email", "Status", "Processed By", "Date Processed"];
    const rows = historyConversations.map((conv) => [
      getFullName(conv),
      conv.userEmail || "N/A",
      conv.status,
      conv.processedBy || "System",
      formatTimestamp(conv.processedAt)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCsv).join(","))
    ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `conversation_requests_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Print Logic for History ---
  const handleHistoryPrint = useReactToPrint({
    contentRef: historyTableRef,
    documentTitle: "Conversation Request History",
    pageStyle: `
      @page { size: landscape; margin: 15mm; }
      @media print {
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #1e293b; -webkit-print-color-adjust: exact; margin: 0; }
        .print-header { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid #1e293b; }
        .print-header h2 { font-size: 16pt; font-weight: bold; margin: 0 0 2px 0; }
        .print-header .subtitle { font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 6px 0; }
        .print-header .narrative { font-size: 9pt; color: #334155; margin: 6px 0 4px 0; line-height: 1.5; }
        .print-header .meta { display: flex; justify-content: space-between; font-size: 8pt; color: #64748b; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 8pt; table-layout: fixed; }
        thead { display: table-header-group; }
        th { background-color: #f1f5f9 !important; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 7pt; letter-spacing: 0.05em; padding: 5px 8px; border: 1px solid #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
        td { border: 1px solid #e2e8f0; padding: 5px 8px; vertical-align: top; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; }
        .no-print { display: none !important; }
        .print-footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #94a3b8; display: flex; justify-content: space-between; font-size: 9pt; color: #475569; }
        .badge { font-size: 7pt; padding: 2px 6px; border: 1px solid #e2e8f0; border-radius: 3px; color: #334155; background: none !important; }
      }
    `,
  });

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64">


        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-xl font-semibold text-center m-0">Pending Conversations</h2>
          {/* Button to open History Modal */}
          <Button variant="secondary" onClick={() => setShowHistoryModal(true)}>
            View Request History
          </Button>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded-lg">
          <Table className="min-w-full divide-y divide-gray-200 mb-0">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">User Full Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conversations.length > 0 ? (
                conversations.map((conv, index) => {
                  const countdown = getCountdown(conv.requestExpiresAt);
                  return (
                    <tr key={conv.id} className={`text-center ${countdown.expired ? "bg-red-50 opacity-50" : ""}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{getFullName(conv)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{conv.userEmail || "N/A"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(conv.createdAt)}
                        {conv.requestExpiresAt && (
                          <div className={`mt-1 font-bold ${countdown.expired ? "text-red-600" : "text-orange-500"}`}>
                            {countdown.text}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {countdown.expired ? (
                          <Badge bg="danger">Expired</Badge>
                        ) : (
                          <Button variant="info" size="sm" onClick={() => handleShowDetails(conv)}>
                            Detail
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">No pending requests found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* ------------------------------------------- */}
        {/* MODAL 1: Detail View (Pending)              */}
        {/* ------------------------------------------- */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Conversation Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedConversation && (
              <>
                <p><strong>User Full Name:</strong> {getFullName(selectedConversation)}</p>
                <p><strong>Email:</strong> {selectedConversation.userEmail || "N/A"}</p>
                <p><strong>Created At:</strong> {formatTimestamp(selectedConversation.createdAt)}</p>
                <hr />
                <h5>Chat History</h5>
                {messages.length > 0 ? (
                  <ul className="list-unstyled">
                    {messages.map((msg) => (
                      <li key={msg.id} className="mb-2">
                        <strong>{msg.senderId === "system" ? "System" : "User"}:</strong> {msg.text}
                        <br />
                        <small className="text-muted">({formatTimestamp(msg.timestamp)})</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No messages yet.</p>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {/* Only show Approve/Decline buttons if status is PENDING */}
            {selectedConversation?.status === 'pending' && (
              <>
                <Button variant="success" onClick={handleApprove}>
                  Accept
                </Button>
                <Button variant="danger" onClick={handleReject}>
                  Decline
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>

        {/* ------------------------------------------- */}
        {/* MODAL 2: History (Approved & Rejected)      */}
        {/* ------------------------------------------- */}
        <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Request History</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div ref={historyTableRef}>
              {/* Print Header (Visible only in print) */}
              <div className="print-header hidden print:block">
                <h2>Conversation Request History</h2>
                <p className="subtitle">Logistics Management System</p>
                <p className="narrative">This report lists all processed conversation requests (Approved / Rejected). Printed on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                <div className="meta">
                  <span>Status: <strong>All History</strong></span>
                  <span>Printed: {currentDate}</span>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded-lg">
                <Table className="min-w-full divide-y divide-gray-200 mb-0">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">User Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Processed By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date Processed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historyConversations.length > 0 ? (
                      historyConversations.map((conv) => (
                        <tr key={conv.id} className="text-center">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{getFullName(conv)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{conv.userEmail || "N/A"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {conv.status === 'approved'
                              ? <Badge bg="success">Approved</Badge>
                              : <Badge bg="danger">Rejected</Badge>
                            }
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{conv.processedBy || "N/A"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(conv.processedAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center p-3">No history found.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Print Footer */}
              <div className="print-footer hidden print:flex">
                <span>Produced by: <strong>{adminName.toUpperCase()}</strong></span>
                <span>Date: {currentDate}</span>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <div className="me-auto">
              <Button variant="success" className="me-2" onClick={handleHistoryExportCSV}>
                Export CSV
              </Button>
              <Button variant="primary" onClick={handleHistoryPrint}>
                Print Table
              </Button>
            </div>
            <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default ConversationsAdmin;
