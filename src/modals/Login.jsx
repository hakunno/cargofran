import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Added Spinner
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth, db } from "../jsfile/firebase";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LoginModal = forwardRef(({ hideTrigger = false }, ref) => {
  const [show, setShow] = useState(false);
  const [view, setView] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  
  // New Loading State
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Detect incognito mode
  const isIncognito = async () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) return resolve(false);
      fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
    });
  };

  useImperativeHandle(ref, () => ({
    openModal: (redirect) => {
      if (redirect) setRedirectAfterLogin(redirect);
      setShow(true);
    },
  }));

  const handleClose = () => {
    setShow(false);
    setView("login");
    setError("");
    setRedirectAfterLogin(null);
    setIsLoading(false); // Reset loading on close
  };

  const changeView = (newView) => {
    setView(newView);
    setError("");
  };

  // === LOGIN LOGIC ===
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start Spinner

    // 1. Block incognito
    const incognito = await isIncognito();
    if (incognito) {
      setError("Login is not allowed in incognito/private mode.");
      toast.error("Login is not allowed in incognito mode.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Force a token refresh to ensure claims/state are 100% fresh
      await user.getIdToken(true); 
      // Force local user reload to sync with server
      await user.reload(); 

      // 3. Single Device Check (Backend Call)
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/revokeOtherSessions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Session setup failed");

      const { sessionId } = await res.json();
      localStorage.setItem("sessionId", sessionId);

      // 4. Reset forceLogout flag
      await setDoc(doc(db, "Users", user.uid), { forceLogout: null }, { merge: true });

      // 5. Get Role for Redirection
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists()) {
        setError("User role not found.");
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const targetPath = redirectAfterLogin ||
        (userData.role === "admin" || userData.role === "staff" ? "/AdminDashboard" : "/");

      // 6. UI Updates
      toast.success(`Welcome back, ${userData.firstName || "User"}!`);

      // 7. NAVIGATE with DELAY
      // We wait 800ms to allow your AuthProvider/Context to finish fetching 
      // the user role in the background. This prevents the "Footer Only" glitch.
      setTimeout(() => {
        handleClose(); // Close modal visually
        navigate(targetPath);
      }, 800);

    } catch (error) {
      console.error(error);
      setError("Login failed. Check your credentials.");
      toast.error("Login failed.");
      setIsLoading(false); // Stop spinner on error
    }
  };

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const userDocRef = doc(db, "Users", uid);
      await setDoc(userDocRef, {
        uid,
        firstName,
        lastName,
        email,
        role: "user",
        verified: false,
        createdAt: new Date(),
      });

      toast.success("Account created! Please log in.");
      setView("login");
    } catch (error) {
      setError(error.message);
      toast.error("Error creating account.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const formattedEmail = email.trim().toLowerCase();
      await sendPasswordResetEmail(auth, formattedEmail);
      toast.success("Password reset link sent to your email!");
      setEmail("");
      changeView("login");
    } catch (error) {
      setError("Failed to send reset link.");
      toast.error("Failed to send reset link.");
      console.error("Reset Password Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      {!hideTrigger && (
        <div
          className="lexend text-xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)] font-bold relative block py-2 px-0 no-underline transition-all duration-200 transform hover:scale-110 active:scale-95 
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black/90 after:transition-all after:duration-300 
                  hover:after:w-full text-white/100 hover:text-green-400 cursor-pointer"
          onClick={() => setShow(true)}
        >
          Log In / Sign Up
        </div>
      )}

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
              <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Send Reset Link"}
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
              <Button variant="primary" type="submit" className="lexend w-100" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                    </>
                ) : (
                    "Log In"
                )}
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
              <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                 {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
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
});

// === UPDATED LOGOUT MODAL ===
export const LogoutModal = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setShow(true);
    },
  }));

  const handleClose = () => {
    setShow(false);
  };

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const currentUser = auth.currentUser;

      if (currentUser && sessionId) {
        try {
          const idToken = await currentUser.getIdToken();
          await fetch(`${API_BASE_URL}/logoutSession`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });
        } catch (error) {
          console.error("Server logout session cleanup failed:", error);
        }
      }

      localStorage.removeItem("sessionId");

      handleClose();

      await signOut(auth);

      toast.success("Logged out successfully!");

      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error(error);
      toast.error("Error logging out.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="lexend">Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">Are you sure you want to log out?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleLogout}>
          Yes, Log Out
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default LoginModal;
