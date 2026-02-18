import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeContext";

// Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import ChatWidget from "./component/ChatWidget";

// Firebase
import { auth, db } from "./jsfile/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import TrackPackage from "./pages/TrackPackage";
import Messages from "./pages/Messages";
import ShippingInquiry from "./pages/ShippingInquiry";
import TermsAndConditions from "./pages/TermsAndConditions";
import MyShipments from "./pages/ShipmentHistory";

// Admin / Staff
import AdminDashboard from "./pages/adminstaff/AdminDashboard";
import Shipments from "./pages/adminstaff/Shipments";
import AdminMessages from "./pages/adminstaff/AdminMessages";
import MessageRequest from "./pages/adminstaff/MessageRequest";
import ShipmentRequest from "./pages/adminstaff/ShipmentRequest";
import Reports from "./pages/adminstaff/Reports";

// Hook
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import { AuthProvider } from './utils/AuthContext';

const App = () => {
  // Idle timeout hook
  useIdleTimeout();

  // Current user state
  const [currentUser, setCurrentUser] = useState(null);

// Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // 🔥 SESSION VALIDATION + FORCE LOGOUT LISTENER
// Listen to user's Firestore document for session validation
useEffect(() => {
  if (!currentUser) return;

  const userRef = doc(db, "Users", currentUser.uid);

  const unsubscribe = onSnapshot(userRef, async (snapshot) => {
    const data = snapshot.data();
    if (!data) return;

    const storedSessionId = localStorage.getItem("sessionId");

    // 🔥 SAFETY: Skip check during fresh login (race condition fix)
    if (!storedSessionId) return;

    // Another device logged in → kick this one
    if (data.currentSessionId && data.currentSessionId !== storedSessionId) {
      toast.error("Your account was signed in on another device. You have been logged out.", {
        position: "top-center",
        autoClose: 8000,
      });

      localStorage.removeItem("sessionId");
      await signOut(auth);
      window.location.href = "/";
      return;
    }

    // Fallback for old forceLogout system
    if (data?.forceLogout === "another_device") {
      toast.error("Your account was signed in on another device. You have been logged out.", {
        position: "top-center",
        autoClose: 8000,
      });

      await setDoc(userRef, { forceLogout: null }, { merge: true });
      await signOut(auth);
      window.location.href = "/";
    }
  });

  return unsubscribe;
}, [currentUser]);

// === ADD THIS NEW USEEFFECT (aggressive session check) ===
useEffect(() => {
  if (!currentUser) return;

  const checkSession = async () => {
    try {
      const userRef = doc(db, "Users", currentUser.uid);
      const snapshot = await getDoc(userRef);
      const data = snapshot.data();

      if (!data) return;

      const storedSessionId = localStorage.getItem("sessionId");

      if (storedSessionId && data.currentSessionId && data.currentSessionId !== storedSessionId) {
        toast.error("Your account was signed in on another device. You have been logged out.", {
          position: "top-center",
          autoClose: 8000,
        });

        localStorage.removeItem("sessionId");
        await signOut(auth);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Session check failed:", err);
    }
  };

  // Check immediately + every 4 seconds
  checkSession();
  const interval = setInterval(checkSession, 4000);

  return () => clearInterval(interval);
}, [currentUser]);


  const location = useLocation();

  // Routes that should NOT show the Footer
  const hiddenFooterRoutes = [
    "/Shipments",
    "/AdminMessages",
    "/AdminDashboard",
    "/Messages",
    "/MessageRequest",
    "/ShipmentRequest",
    "/TrackPackage",
    "/TermsAndConditions",
    "/Reports",
    "/Contact",
    "/MyShipments",
    "/ManageSystem",
  ];

  return (
    <>
      <ThemeProvider>
      <AuthProvider>
      {/* Toast Container - must be at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Navbar />
      <ChatWidget />
      <Routes>
        {/* Public + Guest routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRoles={["user", "guest"]} redirectForAdmin={true}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/TrackPackage" element={<TrackPackage />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />

        {/* Protected User Routes */}
        <Route
          path="/ShippingInquiry"
          element={
            <ProtectedRoute requiredRoles={["user"]}>
              <ShippingInquiry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MyShipments"
          element={
            <ProtectedRoute requiredRoles={["user"]}>
              <MyShipments />
            </ProtectedRoute>
          }
        />
        {/* Protected Admin/Staff Routes */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Shipments"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <Shipments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminMessages"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MessageRequest"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <MessageRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ShipmentRequest"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <ShipmentRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Reports"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Hide footer on specific admin/user pages */}
      {!hiddenFooterRoutes.includes(location.pathname) && <Footer />}
      </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;