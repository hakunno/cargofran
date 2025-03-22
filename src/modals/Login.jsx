import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { auth, db } from "../jsfile/firebase"; 
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs
 } from "firebase/firestore";

function LoginModal({ setIsOpen }) {
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

  const changeView = (newView) => {
    setView(newView);
    setError("");          
    setSuccessMessage(""); 
  };

  const handleShow = () => setShow(true);

  // Handle Login
  const handleLogin = async (e) => {
    setIsOpen(false)
    e.preventDefault();
    setError("");
  
    try {
      await setPersistence(auth, browserLocalPersistence);
  
      // ✅ Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // ✅ Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // Redirect based on user role
        if (userData.role === "admin") {
          navigate("/AdminDashboard");
        } else if (userData.role === "staff") {
          navigate("/AdminDashboard");
        } else {
          navigate("/UserDashboard");
        }
  
        // Show verification warning if needed
        if (!userData.verified) {
          setSuccessMessage("Your account is not verified yet. Some features may be restricted.");
        }
      } else {
        setError("User role not found in database.");
        return;
      }
  
      handleClose();
    } catch (error) {
      // ✅ Properly handling Firebase authentication errors
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later or reset your password.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
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
      const formattedEmail = email.trim().toLowerCase();
  
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", formattedEmail));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setError("No account found with this email. Please check or sign up.");
        return;
      }

      await sendPasswordResetEmail(auth, formattedEmail);
      setSuccessMessage("Password reset link sent to your email.");
      setEmail(""); 
  
    } catch (error) {
      setError("Failed to send reset link. Please try again later.");
      console.error("Reset Password Error:", error);
    }
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <div
        className="lexend text-xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)] font-bold relative block py-2 px-0 no-underline transition-all duration-200 transform hover:scale-110 active:scale-95 
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black/90 after:transition-all after:duration-300 
                  hover:after:w-full text-white/100 hover:text-green-400 cursor-pointer"
        onClick={handleShow}
      >
        Log In / Sign Up
      </div>

      <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="lexend">
          {view === "login" && "Log In"}
          {view === "signup" && "Sign Up"}
          {view === "forgotPassword" && "Reset Password"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <p className="text-danger text-center">{error}</p>}
        {successMessage && <p className="text-success text-center">{successMessage}</p>}

        {/* Forgot Password Form */}
        {view === "forgotPassword" && (
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="forgot-email">Email Address</Form.Label>
              <Form.Control
                type="email"
                id="forgot-email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Reset Link
            </Button>
            <div className="mt-3 text-center">
              <a href="#" onClick={(e) => { e.preventDefault(); changeView("login"); }}>
                Back to Login
              </a>
            </div>
          </Form>
        )}

        {/* Login Form */}
        {view === "login" && (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-email">Email</Form.Label>
              <Form.Control
                type="email"
                id="login-email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-password">Password</Form.Label>
              <Form.Control
                type="password"
                id="login-password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="lexend text-end mt-2">
                <a href="#" onClick={(e) => { e.preventDefault(); changeView("forgotPassword"); }}>
                  Forgot Password?
                </a>
              </div>
            </Form.Group>
            <Button variant="primary" type="submit" className="lexend w-100">
              Log In
            </Button>
            <div className="lexend mt-3 text-center">
              <a href="#" onClick={(e) => { e.preventDefault(); changeView("signup"); }}>
                First time? Sign up
              </a>
            </div>
          </Form>
        )}

        {/* Signup Form */}
        {view === "signup" && (
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="signup-first-name">First Name</Form.Label>
              <Form.Control
                type="text"
                id="signup-first-name"
                name="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(toTitleCase(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="signup-last-name">Last Name</Form.Label>
              <Form.Control
                type="text"
                id="signup-last-name"
                name="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(toTitleCase(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="signup-email">Email</Form.Label>
              <Form.Control
                type="email"
                id="signup-email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="signup-password">Password</Form.Label>
              <Form.Control
                type="password"
                id="signup-password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="signup-confirm-password">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                id="signup-confirm-password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
            <div className="mt-3 lexend text-center">
              <a href="#" onClick={(e) => { e.preventDefault(); changeView("login"); }}>
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
