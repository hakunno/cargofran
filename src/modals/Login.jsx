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
  const [view, setView] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    setView("login");
    setError(""); 
    setSuccessMessage(""); 
  };

  const handleShow = () => setShow(true);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "admin") {
          navigate("/AdminDashboard");
        } else if (userData.role === "staff") {
          navigate("/StaffDashboard");
        } else {
          navigate("/UserDashboard");
        }

        // ✅ Check verification status
        if (!userData.verified) {
          setSuccessMessage("Your account is not verified yet. Some features may be restricted.");
        }
      } else {
        setError("User role not found in database.");
      }

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Signup (No Verification Required)
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid; // ✅ Get the UID

      // Store User Data in Firestore with UID
      const userDocRef = doc(db, "Users", uid);
      await setDoc(userDocRef, {
        uid, // ✅ Save UID in Firestore
        firstName,
        lastName,
        email,
        role: "user", // Default role
        verified: false, // ✅ Newly registered users are NOT verified
        createdAt: new Date(),
      });

      setSuccessMessage("Account created! You can now log in.");
      setView("login"); // Redirect to login page

    } catch (error) {
      setError(error.message);
    }
  };


  //  Handle Forgot Password
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
      setEmail(""); // ✅ Clear email input after successful request
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div
        className="text-xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)] font-bold relative block py-2 px-0 no-underline transition-all duration-200 transform hover:scale-110 active:scale-95 
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black/90 after:transition-all after:duration-300 
                  hover:after:w-full text-white/100 hover:text-green-400 cursor-pointer"
        onClick={handleShow}
      >
        Log In / Sign Up
      </div>

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

          {/* Forgot Password Form */}
          {view === "forgotPassword" && (
            <Form onSubmit={handleForgotPassword}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
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

          {/* Login Form */}
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
                <a href="#" onClick={(e) => { e.preventDefault(); setView("forgotPassword"); }}>
                  Forgot Password?
                </a>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
              <div className="mt-3 text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("signup"); }}>
                  First time? Sign up
                </a>
              </div>
            </Form>
          )}

          {/* Signup Form */}
          {view === "signup" && (
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter first name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter last name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Sign Up
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
