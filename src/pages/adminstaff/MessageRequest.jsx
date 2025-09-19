import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../jsfile/firebase"; // ✅ Ensure auth is imported
import Sidebar from "../../component/adminstaff/Sidebar";
import { logActivity } from "../../modals/StaffActivity.jsx"; // Adjust path to where ActivityModal/logActivity is exported

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch only pending conversations that have request set to "sent"
    const convRef = collection(db, "conversations");
    const q = query(
      convRef,
      where("status", "==", "pending"),
      where("request", "==", "sent")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminDetails = async () => {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      alert("Admin not logged in.");
      return { adminFirstName: "Unknown", adminLastName: "" };
    }

    let adminFirstName = "";
    let adminLastName = "";

    if (currentAdmin.displayName) {
      const nameParts = currentAdmin.displayName.split(" ");
      adminFirstName = nameParts[0];
      adminLastName = nameParts.slice(1).join(" ");
    } else {
      // Fetch admin details from Firestore if displayName is missing
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

    // Fetch messages for the conversation
    const messagesRef = collection(db, "conversations", conv.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);
    });

    // Note: You may want to unsubscribe when modal closes, but for simplicity, we'll let it run.
  };

  const handleApprove = async () => {
    if (!selectedConversation) return;
    const confirmApprove = window.confirm("Approve this conversation?");
    if (!confirmApprove) return;
  
    try {
      const currentAdmin = auth.currentUser;
      if (!currentAdmin) {
        alert("Admin not logged in.");
        return;
      }
      
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();
      
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        status: "approved",
        adminFirstName,
        adminLastName,
        adminId: currentAdmin.uid, // store the approver's UID
      });

      // Log the activity
      await logActivity(adminFullName, `Approved conversation ${selectedConversation.id}`);

      setShowModal(false);
      setSelectedConversation(null);
      setMessages([]);
    } catch (error) {
      console.error("Error approving conversation:", error);
      alert("Failed to approve conversation. Please try again.");
    }
  };
  
  const handleReject = async () => {
    if (!selectedConversation) return;
    const confirmReject = window.confirm("Reject this conversation?");
    if (!confirmReject) return;
    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        status: "rejected",
      });

      // Log the activity
      await logActivity(adminFullName, `Rejected conversation ${selectedConversation.id}`);

      setShowModal(false);
      setSelectedConversation(null);
      setMessages([]);
    } catch (error) {
      console.error("Error rejecting conversation:", error);
      alert("Failed to reject conversation. Please try again.");
    }
  };

  const getFullName = (conv) => {
    return conv.userFullName?.trim() || `${conv.firstName || ""} ${conv.lastName || ""}`.trim() || "N/A";
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate ? timestamp.toDate().toLocaleString() : new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <h2 className="text-xl font-semibold text-center mb-4">Pending Conversations</h2>
        <div className="overflow-x-auto shadow rounded-lg">
          <Table striped bordered hover className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">User Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Time</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conv, index) => (
                <tr key={conv.id} className="text-center">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{getFullName(conv)}</td>
                  <td className="p-2">{conv.userEmail || "N/A"}</td>
                  <td className="p-2">{formatTimestamp(conv.createdAt)}</td>
                  <td className="p-2">
                    <Button variant="info" size="sm" onClick={() => handleShowDetails(conv)}>
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Conversation Details */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Conversation Details</Modal.Title>
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
                  <ul>
                    {messages.map((msg) => (
                      <li key={msg.id}>
                        <strong>{msg.senderId === "system" ? "System" : "User"}:</strong> {msg.text} 
                        <small> ({formatTimestamp(msg.timestamp)})</small>
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
            <Button variant="success" onClick={handleApprove}>
              Accept
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ConversationsAdmin;