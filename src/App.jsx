import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute"; // Role-based protection
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import OurCommitment from "./pages/OurCommitment";
import Contact from "./pages/Contact";
import TrackPackage from "./pages/TrackPackage";
import UserDashboard from "./pages/UserDashboard";
import FaqChat from "./pages/FaqChat";
import Messages from "./pages/Messages";
import ChatWidget from "./component/ChatWidget";
import ShippingInquiry from "./pages/ShippingInquiry";
import TermsAndConditions from "./pages/TermsAndConditions";

/* ADMIN / STAFF */
import AdminDashboard from "./pages/adminstaff/AdminDashboard";
import Shipments from "./pages/adminstaff/Shipments";
import AdminMessages from "./pages/adminstaff/AdminMessages";
import MessageRequest from "./pages/adminstaff/MessageRequest";
import ShipmentRequest from "./pages/adminstaff/ShipmentRequest";

const App = () => {
  const location = useLocation(); 

  const hiddenFooterRoutes = ["/Shipments","/AdminMessages","/AdminDashboard","/Messages","/MessageRequest","/ShipmentRequest","/TrackPackage","/ShippingInquiry","/TermsAndConditions"];
  
  return (
    <>
      <Navbar />
      <ChatWidget />
      <Routes>
        {/* Home route now uses redirectForAdmin */}
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
        <Route path="/OurCommitment" element={<OurCommitment />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/TrackPackage" element={<TrackPackage />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/ChatHelp" element={<FaqChat />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/ShippingInquiry" element={<ShippingInquiry/>} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions/>} />

        {/* Protected Routes for Admin and Staff */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hiddenFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
