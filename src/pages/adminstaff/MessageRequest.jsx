import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import Sidebar from "../../component/adminstaff/Sidebar";

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Only fetch pending conversations (so once approved, they are removed)
    const convRef = collection(db, "conversations");
    const q = query(convRef, where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setConversations(convos);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (conv) => {
    const confirmApprove = window.confirm("Approve this conversation?");
    if (!confirmApprove) return;
    try {
      await updateDoc(doc(db, "conversations", conv.id), {
        status: "approved",
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

  // Helper: Get the full name by checking userFullName; if not available, combine firstName and lastName.
  const getFullName = (conv) => {
    if (conv.userFullName && conv.userFullName.trim() !== "") {
      return conv.userFullName;
    }
    const firstName = conv.firstName || "";
    const lastName = conv.lastName || "";
    const combined = `${firstName} ${lastName}`.trim();
    return combined !== "" ? combined : "N/A";
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
                <th className="p-2">#</th>
                <th className="p-2">Conversation ID</th>
                <th className="p-2">User Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">User Concern</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conv, index) => (
                <tr key={conv.id} className="text-center">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{conv.id}</td>
                  <td className="p-2">{getFullName(conv)}</td>
                  <td className="p-2">{conv.userEmail || "N/A"}</td>
                  <td className="p-2">{conv.userConcern || "N/A"}</td>
                  <td className="p-2">{conv.status}</td>
                  <td className="p-2">
                    <div className="flex flex-col md:flex-row gap-2 justify-center">
                      <Button variant="success" size="sm" onClick={() => handleApprove(conv)}>Approve</Button>
                      <Button variant="danger" size="sm" onClick={() => handleReject(conv)}>Reject</Button>
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
