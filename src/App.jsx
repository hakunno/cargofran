import { Routes, Route } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized"; // Page for access denied
import ProtectedRoute from "./utils/ProtectedRoute"; // Role-based protection
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import OurCommitment from "./pages/OurCommitment";
import Contact from "./pages/Contact";
import Navbartesting from "./component/Navbar"
import LoginModal from "./modals/Login";
import FirebaseTest from "./pages/FirebaseTest";
import TrackPackage from "./pages/TrackPackage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AirCargoTracking from "./pages/AirTracking";
import StaffDashboard from "./pages/StaffDashboard";
import ManageUsers from "./modals/ManageUsers";
import FaqChat from "./pages/FaqChat";

const App = () => {
  return (
    <>
      <Navbartesting />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/OurCommitment" element={<OurCommitment />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<LoginModal />} />
        <Route path="/FirebaseTest" element={<FirebaseTest />} />
        <Route path="/TrackPackage" element={<TrackPackage />} />
        <Route path="/AirCargoTracking" element={<AirCargoTracking />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/ChatHelp" element={<FaqChat />} />

        {/* Protected Routes for Admin and Staff */}
        {/* ADMIN ROUTES */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageUsers"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
      


        {/* STAFF ROUTES */}
        <Route
          path="/StaffDashboard"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
};

export default App;
