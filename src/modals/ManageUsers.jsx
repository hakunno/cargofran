import React, { useState, useEffect } from "react";
import { getDocs, updateDoc, collection, doc, addDoc } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../jsfile/firebase"; // Adjust path as needed
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../assets/css/ManageUsers.css"; // Ensure this file contains styling

function ManageUsers({ show, onHide }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [resetCooldown, setResetCooldown] = useState({}); // Cooldown state

  const usersCollection = collection(db, "Users");
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(usersCollection);
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Interval to decrease cooldown every second
    const interval = setInterval(() => {
      setResetCooldown((prevCooldown) => {
        const updatedCooldown = { ...prevCooldown };

        Object.keys(updatedCooldown).forEach((email) => {
          if (updatedCooldown[email] > 0) {
            updatedCooldown[email] -= 1;
          } else {
            delete updatedCooldown[email]; // Remove from cooldown when it reaches 0
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

      // Set cooldown to 60 seconds
      setResetCooldown((prev) => ({ ...prev, [email]: 60 }));

    } catch (error) {
      console.error("Error sending reset email:", error.message);
      alert("Failed to send reset email. Please try again.");
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      alert("Please enter an email and password.");
      return;
    }

    if (newUserPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      const userId = userCredential.user.uid;

      // Add user to Firestore
      await addDoc(usersCollection, {
        email: newUserEmail,
        role: newUserRole,
        uid: userId,
      });

      setUsers([...users, { id: userId, email: newUserEmail, role: newUserRole }]);
      alert("User added successfully!");
      setShowAddUserModal(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("user");
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Failed to add user. The email might already be in use or invalid.");
    }
  };

  return (
    <>
      {/* Main Manage Users Modal */}
      <Modal show={show} onHide={onHide} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Manage Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
                <th>Reset Password</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) =>
                  user.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === "admin" ? (
                        <Button variant="secondary" disabled className="w-100">
                          Admin
                        </Button>
                      ) : (
                        <Button
                          variant={user.role === "staff" ? "danger" : "success"}
                          onClick={() => handleRoleChange(user.id, user.role)}
                          className="w-100"
                        >
                          Change to {user.role === "staff" ? "User" : "Staff"}
                        </Button>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleResetPassword(user.email)}
                        disabled={!!resetCooldown[user.email]}
                        className="w-100"
                      >
                        {resetCooldown[user.email] ? `Wait (${resetCooldown[user.email]}s)` : "Send Reset Email"}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => setShowAddUserModal(true)}>
            + Add New User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
              <option value="user">User</option>
              <option value="staff">Staff</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageUsers;
