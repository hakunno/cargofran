import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../jsfile/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

function LoginModal() {
  const [show, setShow] = useState(false);
  const [view, setView] = useState('login'); // Switch between login, forgot password, and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a Users document in Firestore
      await setDoc(doc(db, 'Users', userCredential.Users.uid), {
        email: email,
        uid: userCredential.Users.uid,
        createdAt: new Date()
      });
  
      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setView('login');
      alert('Password reset link sent to your email');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {/* Login Button */}
      <p className="texthovering" variant="primary" onClick={handleShow}>
        Log In / Sign Up
      </p>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {view === 'login' && 'Log In'}
            {view === 'forgotPassword' && 'Forgot Password'}
            {view === 'signup' && 'Sign Up'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          {view === 'login' && (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
              <div className="mt-3 text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView('forgotPassword');
                  }}
                >
                  Forgot Password?
                </a>
                <br />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView('signup');
                  }}
                >
                  Don't have an account? Sign up
                </a>
              </div>
            </Form>
          )}
          {view === 'forgotPassword' && (
            <Form onSubmit={handleForgotPassword}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email to reset password" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Reset Link
              </Button>
              <div className="mt-3 text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView('login');
                  }}
                >
                  Back to Log In
                </a>
              </div>
            </Form>
          )}
          {view === 'signup' && (
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
              <div className="mt-3 text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView('login');
                  }}
                >
                  Already have an account? Log In
                </a>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;