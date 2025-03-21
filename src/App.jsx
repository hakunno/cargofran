import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute"; // Role-based protection
import Navbar from "./component/Navbar"
import Footer from "./component/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import OurCommitment from "./pages/OurCommitment";
import Contact from "./pages/Contact";
import FirebaseTest from "./pages/FirebaseTest";
import TrackPackage from "./pages/TrackPackage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AirCargoTracking from "./pages/AirTracking";
import FaqChat from "./pages/FaqChat";
import Messages from "./pages/Messages";


const App = () => {
  const location = useLocation(); 

  const hiddenFooterRoutes = ["/AdminDashboard"];
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/OurCommitment" element={<OurCommitment />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FirebaseTest" element={<FirebaseTest />} />
        <Route path="/TrackPackage" element={<TrackPackage />} />
        <Route path="/AirCargoTracking" element={<AirCargoTracking />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/ChatHelp" element={<FaqChat />} />
        <Route path="/Messages" element={<Messages />} />

        {/* Protected Routes for Admin and Staff */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute requiredRoles={["admin", "staff"]}>
              <AdminDashboard />
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
