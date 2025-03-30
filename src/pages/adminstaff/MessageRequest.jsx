import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../jsfile/firebase"; // ✅ Ensure auth is imported
import Sidebar from "../../component/adminstaff/Sidebar";

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]);

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

  const handleApprove = async (conv) => {
    const confirmApprove = window.confirm("Approve this conversation?");
    if (!confirmApprove) return;

    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      await updateDoc(doc(db, "conversations", conv.id), {
        status: "approved",
        adminFirstName,
        adminLastName,
      });
    } catch (error) {
      console.error("Error approving conversation:", error);
      alert("Failed to approve conversation. Please try again.");
    }
  };

  const handleReject = async (conv) => {
    const confirmReject = window.confirm("Reject this conversation?");
    if (!confirmReject) return;
    try {
      await updateDoc(doc(db, "conversations", conv.id), {
        status: "rejected",
      });
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
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Pending Conversations</h2>
        <div className="overflow-x-auto shadow rounded-lg">
          <Table striped bordered hover className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">User Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
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
                  <td className="p-2">{conv.status}</td>
                  <td className="p-2">
                    <div className="flex flex-col md:flex-row gap-2 justify-center">
                      <Button variant="success" size="sm" onClick={() => handleApprove(conv)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleReject(conv)}>
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ConversationsAdmin;
