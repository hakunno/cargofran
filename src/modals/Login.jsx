import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth, db } from "../jsfile/firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";

function LoginModal() {
  const [show, setShow] = useState(false);
  const [view, setView] = useState("login"); // "login", "signup", "forgotPassword"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For reset password success message

  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    setView("login"); // Reset view to login when closing
    setError(""); 
    setSuccessMessage(""); 
  };
  const handleShow = () => setShow(true);

  // 🔹 Handle Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Set Firebase auth persistence before login
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get user role from Firestore
      const userDoc = await getDoc(doc(db, "Users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Role:", userData.role);

        // 🔹 Redirect Based on Role
        if (userData.role === "admin") {
          navigate("/AdminDashboard");
        } else if (userData.role === "staff") {
          navigate("/StaffDashboard");
        } else {
          navigate("/UserDashboard");
        }
      } else {
        setError("User role not found in database.");
      }

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  // 🔹 Handle Signup Function
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store new user in Firestore with default role ("user")
      await setDoc(doc(db, "Users", user.uid), {
        email: email,
        uid: user.uid,
        role: "user", // Default role is "user"
        createdAt: new Date(),
      });

      // Redirect to User Dashboard after signup
      navigate("/UserDashboard");

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  // 🔹 Handle Forgot Password Function
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link sent to your email.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div onClick={handleShow}>Log In / Sign Up</div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {view === "login" && "Log In"}
            {view === "signup" && "Sign Up"}
            {view === "forgotPassword" && "Reset Password"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}

          {/* 🔹 Login Form */}
          {view === "login" && (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
              <div className="mt-3 text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("forgotPassword"); }}>
                  Forgot Password?
                </a>
                <br />
                <a href="#" onClick={(e) => { e.preventDefault(); setView("signup"); }}>
                  First time creating an account? Sign up
                </a>
              </div>
            </Form>
          )}

          {/* 🔹 Signup Form */}
          {view === "signup" && (
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
              <div className="mt-3 text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); }}>
                  Already have an account? Log In
                </a>
              </div>
            </Form>
          )}

          {/* 🔹 Forgot Password Form */}
          {view === "forgotPassword" && (
            <Form onSubmit={handleForgotPassword}>
              <Form.Group className="mb-3">
                <Form.Label>Enter Your Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Reset Link
              </Button>
              <div className="mt-3 text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); }}>
                  Back to Login
                </a>
              </div>
            </Form>
          )}

        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;
