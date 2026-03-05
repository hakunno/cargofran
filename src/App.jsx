import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import ChatWidget from "./component/ChatWidget";

// Toastify
import { ToastContainer } from "react-toastify";
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
import ShipmentMessages from "./pages/ShipmentMessages";
import MaintenancePage from "./pages/MaintenancePage";

// Admin / Staff
import AdminDashboard from "./pages/adminstaff/AdminDashboard";
import Shipments from "./pages/adminstaff/Shipments";
import AdminMessages from "./pages/adminstaff/AdminMessages";
import AdminShipmentMessages from "./pages/adminstaff/AdminShipmentMessages";
import MessageRequest from "./pages/adminstaff/MessageRequest";
import ShipmentRequest from "./pages/adminstaff/ShipmentRequest";
import Reports from "./pages/adminstaff/Reports";

// Hooks
import { useSessionSocket } from "./hooks/useSessionSocket";
import { useAutoLogout } from "./hooks/useAutoLogout";
import { AuthProvider } from "./utils/AuthContext";
import { db } from "./jsfile/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const App = () => {
  useSessionSocket();
  useAutoLogout();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);

  // Subscribe to the kill switch in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "config", "app"),
      (snap) => {
        if (snap.exists()) {
          setMaintenanceMode(snap.data()?.maintenanceMode === true);
        }
        setMaintenanceLoading(false);
      },
      () => setMaintenanceLoading(false) // Allow app to load if Firestore is unreachable
    );
    return () => unsub();
  }, []);

  const location = useLocation();

  // Routes that should NOT show the Footer
  const hiddenFooterRoutes = [
    "/Shipments",
    "/AdminMessages",
    "/AdminShipmentMessages",
    "/AdminDashboard",
    "/Messages",
    "/MessageRequest",
    "/ShipmentRequest",
    "/TrackPackage",
    "/TermsAndConditions",
    "/Reports",
    "/Contact",
    "/MyShipments",
    "/ShipmentMessages",
    "/ManageSystem",
  ];

  // Show nothing while checking maintenance status (avoids flash)
  if (maintenanceLoading) return null;
  // Show maintenance page if kill switch is active
  if (maintenanceMode) return <MaintenancePage />;

  return (
    <>
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
          <Route
            path="/ShipmentMessages"
            element={
              <ProtectedRoute requiredRoles={["user"]}>
                <ShipmentMessages />
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
            path="/AdminShipmentMessages"
            element={
              <ProtectedRoute requiredRoles={["admin", "staff"]}>
                <AdminShipmentMessages />
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
    </>
  );
};

export default App;
