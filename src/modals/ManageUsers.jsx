import React, { useState, useEffect } from "react";
import {
  getDocs,
  updateDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../jsfile/firebase";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../assets/css/ManageUsers.css"; // Ensure this file contains styling

function ManageUsers({ show, onHide }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [resetCooldown, setResetCooldown] = useState({});

  const usersCollection = collection(db, "Users");
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(usersCollection);
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Sort users by createdAt (ascending)
      userList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
      setUsers(userList);
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetCooldown((prevCooldown) => {
        const updatedCooldown = { ...prevCooldown };

        Object.keys(updatedCooldown).forEach((email) => {
          if (updatedCooldown[email] > 0) {
            updatedCooldown[email] -= 1;
          } else {
            delete updatedCooldown[email];
          }
        });

        return updatedCooldown;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "staff" ? "user" : "staff";
    await updateDoc(doc(db, "Users", userId), { role: newRole });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleResetPassword = async (email) => {
    if (resetCooldown[email]) {
      alert("Please wait before sending another reset email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email sent to ${email}`);
      setResetCooldown((prev) => ({ ...prev, [email]: 60 }));
    } catch (error) {
      console.error("Error sending reset email:", error.message);
      alert("Failed to send reset email. Please try again.");
    }
  };

  const handleOpenAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleAddUser = async () => {
    if (!newUserFirstName || !newUserLastName || !newUserEmail || !newUserPassword) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (newUserPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    const createdAt = new Date().toISOString(); // Capture the current timestamp
  
    try {
      const response = await fetch("http://localhost:5000/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newUserFirstName,
          lastName: newUserLastName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          createdAt: new Date().toISOString(),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUsers((prevUsers) =>
          [...prevUsers,
            {
              id: data.uid,
              firstName: newUserFirstName,
              lastName: newUserLastName,
              email: newUserEmail,
              role: newUserRole,
              createdAt, // Store timestamp
              verified: false,
            },
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt (newest first)
        );
  
        alert("User created successfully!");
        setShowAddUserModal(false);
        setNewUserFirstName("");
        setNewUserLastName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("user");
      } else {
        alert("Failed to create user: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };
  
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
  
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/deleteUser/${userId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while deleting the user.");
    }
  };  

  const handleToggleVerification = async (userId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle verification status
  
    try {
      await updateDoc(doc(db, "Users", userId), { verified: newStatus });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, verified: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating verification status:", error);
      alert("Failed to update verification status.");
    }
  };
  

  const handleBackToManageUsers = () => {
    setShowAddUserModal(false); // Hide Add User Modal
  };

  return (
    <>
      {/* Main Manage Users Modal */}
      <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      className="sm:max-w-full sm:h-screen sm:modal-dialog"
    >
        <Modal.Header closeButton>
          <Modal.Title>Manage Users</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Form.Control
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border"></th>
                  <th className="p-2 border">Verified</th>
                  <th className="p-2 border"></th>
                  <th className="p-2 border">Reset Password</th>
                </tr>
              </thead>
              <tbody className="max-h-[300px] overflow-y-auto">
                {users
                  .filter((user) =>
                    user.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user.id} className="text-center">
                      <td className="p-2 border">{user.email}</td>
                      <td className="p-2 border">{user.role}</td>
                      <td className="p-2 border">
                        <Button
                          variant={user.role === "staff" ? "danger" : "success"}
                          onClick={() =>
                            user.role !== "admin" && handleRoleChange(user.id, user.role)
                          }
                          disabled={user.role === "admin"}
                          className={
                            user.role === "admin"
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : ""
                          }
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : `Change to ${user.role === "staff" ? "User" : "Staff"}`}
                        </Button>
                      </td>
                      <td className="p-2 border">
                        {user.verified ? "Yes" : "No"}
                      </td>
                      <td className="p-2 border">
                        <Button
                          variant={user.verified ? "danger" : "success"} // Red if Verified, Green if Unverified
                          onClick={() => handleToggleVerification(user.id, user.verified)}
                        >
                          {user.verified ? "Unverify" : "Verify"}
                        </Button>
                      </td>
                      <td className="p-2 border">
                        <Button
                          variant="warning"
                          onClick={() => handleResetPassword(user.email)}
                          disabled={!!resetCooldown[user.email]}
                        >
                          {resetCooldown[user.email]
                            ? `Wait (${resetCooldown[user.email]}s)`
                            : "Send Reset Email"}
                        </Button>
                      </td>
                      <td className="p-2 border">
                        <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button variant="primary" onClick={handleOpenAddUserModal}>
            Add New User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal 
        show={showAddUserModal} 
        onHide={() => setShowAddUserModal(false)} 
        centered 
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-full">Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newUserFirstName}
                onChange={(e) => {
                  const formattedText = e.target.value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  setNewUserFirstName(formattedText);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newUserLastName}
                onChange={(e) => {
                  const formattedText = e.target.value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  setNewUserLastName(formattedText);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="flex justify-between w-full">
          <Button variant="secondary" onClick={handleBackToManageUsers}>
            Back
          </Button>

          <Button
            variant="success"
            onClick={async () => {
              await handleAddUser();
            }}
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ManageUsers;
