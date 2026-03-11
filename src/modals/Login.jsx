import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Added Spinner
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth, db, functions } from "../jsfile/firebase";
import { httpsCallable } from "firebase/functions";
import { logActivity } from "./StaffActivity";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";


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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
    setIsLoading(true);

    try {
      // 0. MUST clear old session ID to prevent race condition with useSessionSocket
      localStorage.removeItem("sessionId");

      // 1. Enforce Local Persistence (shared across tabs)
      await setPersistence(auth, browserLocalPersistence);

      // 2. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Force a token refresh to ensure claims/state are 100% fresh
      await user.getIdToken(true);
      // Force local user reload to sync with server
      await user.reload();

      // 3. Generate a new session ID and write it to Firestore directly.
      // This does NOT require the local backend to be running.
      // Any other device watching the same user doc will detect the change and log out.
      const sessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("lastActivity", Date.now().toString());

      await updateDoc(doc(db, "Users", user.uid), {
        currentSessionId: sessionId,
        lastLoginAt: serverTimestamp(),
        forceLogout: null,
      });

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

      localStorage.setItem("sessionRole", userData.role || "user");

      // 6. UI Updates
      toast.success(`Welcome back, ${userData.firstName || "User"}!`);

      // Log login activity for admin and staff only
      if (userData.role === "admin" || userData.role === "staff") {
        const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || user.email;
        logActivity(fullName, "Logged in");
      }

      // 7. NAVIGATE with DELAY
      // We wait 800ms to allow your AuthProvider/Context to finish fetching 
      // the user role in the background. This prevents the "Footer Only" glitch.
      setTimeout(() => {
        handleClose(); // Close modal visually
        navigate(targetPath);
      }, 800);

    } catch (error) {
      console.error(error);
      if (error.code === "auth/network-request-failed") {
        setError("You must be connected to the internet to log in.");
        toast.warning("No internet connection.");
        setIsOffline(true); // Force reveal the Offline Demo button if they click Login and it fails
      } else {
        setError("Login failed. Check your credentials.");
        toast.error("Login failed.");
      }
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

  // === GOOGLE LOGIN ===
  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 0. MUST clear old session ID to prevent race condition with useSessionSocket
      localStorage.removeItem("sessionId");

      // 1. Enforce Local Persistence for Google Login
      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if a Firestore user doc already exists
      const userDocRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // First-time Google login — create a user doc with role "user"
        const nameParts = (user.displayName || "").split(" ");
        await setDoc(userDocRef, {
          uid: user.uid,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email,
          role: "user",
          verified: true,
          createdAt: serverTimestamp(),
        });
      }

      // Single-device session enforcement (same as email/password login)
      const sessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("lastActivity", Date.now().toString());
      await updateDoc(userDocRef, {
        currentSessionId: sessionId,
        lastLoginAt: serverTimestamp(),
        forceLogout: null,
      });

      const latestSnap = await getDoc(userDocRef);
      const userData = latestSnap.data();
      const targetPath = redirectAfterLogin ||
        (userData.role === "admin" || userData.role === "staff" ? "/AdminDashboard" : "/");

      localStorage.setItem("sessionRole", userData.role || "user");

      toast.success(`Welcome${userSnap.exists() ? " back" : ""}, ${userData.firstName || user.displayName || "User"}!`);

      // Log login activity for admin and staff only
      if (userData.role === "admin" || userData.role === "staff") {
        const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || user.displayName || user.email;
        logActivity(fullName, "Logged in");
      }

      setTimeout(() => {
        handleClose();
        navigate(targetPath);
      }, 800);

    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        // User dismissed the popup — not an error
        setIsLoading(false);
        return;
      }
      console.error("Google login error:", error);
      setError("Google sign-in failed. Please try again.");
      toast.error("Google sign-in failed.");
      setIsLoading(false);
    }
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

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">or</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 16px",
                  border: "1px solid #dadce0",
                  borderRadius: "6px",
                  background: "#fff",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#3c4043",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)"}
              >
                {/* Official Google SVG logo */}
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Continue with Google
              </button>

              <div className="lexend mt-3 text-center">
                <a href="#" onClick={(e) => { e.preventDefault(); changeView("signup"); }}>
                  First time? Sign up
                </a>
              </div>

              {/* OFFLINE DEMO BYPASS BUTTONS */}
              {isOffline && (
                <div className="mt-4 text-center">
                  <div className="text-sm text-yellow-600 font-semibold mb-2">
                    ⚠️ You are currently offline
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("offlineDemoMode", "admin");
                        handleClose();
                        window.location.href = "/AdminDashboard"; // Force full reload to trigger Context
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline bg-transparent border-none p-0 cursor-pointer p-2 bg-blue-50 rounded"
                    >
                      Enter Offline Admin Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("offlineDemoMode", "user");
                        handleClose();
                        window.location.href = "/"; // Force full reload to trigger Context
                      }}
                      className="text-xs text-green-600 hover:text-green-800 underline bg-transparent border-none p-0 cursor-pointer p-2 bg-green-50 rounded"
                    >
                      Enter Offline User Mode
                    </button>
                  </div>
                </div>
              )}
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
          const logoutSessionFn = httpsCallable(functions, 'logoutSession');
          await logoutSessionFn({ sessionId });
        } catch (error) {
          console.error("Server logout session cleanup failed:", error);
        }
      }

      localStorage.removeItem("sessionId");
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("sessionRole");
      localStorage.removeItem("offlineDemoMode"); // Clear Demo Mode

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
