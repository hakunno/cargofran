import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Navbar from "./component/Navbar";
import LoginModal from "./pages/Login";
import FirebaseTest from "./pages/FirebaseTest";
import TrackPackage from "./pages/TrackPackage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<LoginModal />} />
        <Route path="/FirebaseTest" element={<FirebaseTest />} />
        <Route path="/TrackPackage" element={<TrackPackage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

export default App;
