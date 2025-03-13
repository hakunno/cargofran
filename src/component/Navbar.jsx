import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Logo from '../assets/logo.png';
import LoginModal from '../pages/Login';
import '../css/Navbar.css';

function BasicExample() {
  const [modalShow, setModalShow] = useState(false); // State for the modal

  return (
    <Navbar expand="md" className="custom-navbar">
      <Container>
        {/* Top Section with Logo and Hamburger */}
        <div className="nav-top">
          <div className="logo-container">
            <Link to="/">
              <img src={Logo} alt="CargoFran" className="logo" />
            </Link>
          </div>
          <Navbar.Toggle aria-controls="offcanvasNavbar" className="hamburger" />
        </div>

        {/* Offcanvas Menu */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="offcanvas-fullscreen"
        >
          {/* Offcanvas Header */}
          <Offcanvas.Header className="offcanvas-header-custom">
            <div className="offcanvas-logo">
              <Link to="/" className="logo-link">
                <img src={Logo} alt="CargoFran" className="logo-offcanvas" />
              </Link>
            </div>
          </Offcanvas.Header>

          {/* Offcanvas Body */}
          <Offcanvas.Body>
            <div className="page-links">
              <NavLink to="/FirebaseTest" className="nav-item"><p>Track Package</p></NavLink>
              <NavLink to="/About" className="nav-item"><p>About</p></NavLink>
              <NavLink to="/Contact" className="nav-item"><p>Contact</p></NavLink>
              <NavLink to="/Services" className="nav-item"><p>Services</p></NavLink>

              {/* Trigger Login Modal */}
              <div
                className="nav-item nav-itemlogin loginmargin"
                onClick={() => setModalShow(true)} // Show modal on click
              >
                <p><LoginModal show={modalShow} onHide={() => setModalShow(false)} /></p>
              </div>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default BasicExample;