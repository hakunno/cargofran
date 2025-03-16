import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../jsfile/firebase"; // Adjust based on your structure
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Logo from "../assets/logo.png";
import LoginModal from "../modals/Login";
import ManageUsers from "../modals/ManageUsers"; // New modal for user management
import "../assets/css/Navbar.css";

function BasicExample() {
  const [modalShow, setModalShow] = useState(false);
  const [manageUsersShow, setManageUsersShow] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Prevent flickering

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setRole(null);
      }
      setUser(currentUser);
      setLoading(false); // ✅ Only render navbar after loading
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  // ✅ Prevent flickering by not rendering the navbar until `loading` is false
  if (loading) return null;

  // Determine logo link based on role
  const logoLink =
    role === "admin"
      ? "/AdminDashboard"
      : role === "staff"
      ? "/StaffDashboard"
      : "/";

  return (
    <Navbar expand="md" className="custom-navbar">
      <Container>
        <div className="nav-top">
          <div className="logo-container">
            <Link to={logoLink}>
              <img src={Logo} alt="CargoFran" className="logo" />
            </Link>
          </div>
          <Navbar.Toggle aria-controls="offcanvasNavbar" className="hamburger" />
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="offcanvas-fullscreen"
        >
          <Offcanvas.Header className="offcanvas-header-custom">
            <div className="offcanvas-logo">
              <Link to={logoLink} className="logo-link">
                <img src={Logo} alt="CargoFran" className="logo-offcanvas" />
              </Link>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <div className="page-links">
              {/* Show these pages ONLY if NOT Admin/Staff */}
              {role !== "admin" && role !== "staff" && (
                <>
                  <NavLink to="/AirCargoTracking" className="nav-item">
                    <p>Track Package</p>
                  </NavLink>
                  <NavLink to="/About" className="nav-item">
                    <p>About</p>
                  </NavLink>
                  <NavLink to="/Contact" className="nav-item">
                    <p>Contact</p>
                  </NavLink>
                  <NavLink to="/Services" className="nav-item">
                    <p>Services</p>
                  </NavLink>
                </>
              )}

              {/* Admin Role - Show Admin Panel, Manage Users & Messages */}
              {role === "admin" && (
                <>
                  <NavLink to="/AdminDashboard" className="nav-item">
                    <p>Manage Package</p>
                  </NavLink >
                  <div className="nav-item">
                    <p onClick={() => setManageUsersShow(true)}>
                      Manage Users
                    </p>
                  </div>
                </>
              )}

              {/* Staff Role - Show only Staff Dashboard */}
              {role === "staff" && (
                <NavLink to="/StaffDashboard" className="nav-item">
                  <p>Staff</p>
                </NavLink>
              )}

              {/* Show Login or Logout */}
              {user ? (
                <div className="nav-item nav-itemlogin loginmargin" onClick={handleLogout}>
                  <p>Logout</p>
                </div>
              ) : (
                <div className="nav-item nav-itemlogin loginmargin" onClick={() => setModalShow(true)}>
                  <LoginModal show={modalShow} onHide={() => setModalShow(false)} />
                </div>
              )}

              {/* Manage Users Modal */}
              <ManageUsers show={manageUsersShow} onHide={() => setManageUsersShow(false)} />
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
