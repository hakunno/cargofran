import { useEffect, useRef, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth, db } from "../jsfile/firebase"; 
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const WARNING_MS = 60 * 1000;     // 1 minute before

export const useIdleTimeout = () => {
  const navigate = useNavigate(); // Use this to keep Toasts visible
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  const cleanUp = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
  };

  const startTimer = () => {
    cleanUp(); 

    // Warning Timer
    warningRef.current = setTimeout(() => {
      toast.warning("Session expiring in 1 minute...", {
        position: "top-center",
        autoClose: 10000, 
      });
    }, TIMEOUT_MS - WARNING_MS);

    // Logout Timer
    timeoutRef.current = setTimeout(async () => {
      try {
        await signOut(auth);
        cleanUp();
        
        // 1. Redirect smoothly without refreshing the page
        navigate("/"); 
        
        // 2. Show toast AFTER navigation so it doesn't get wiped
        setTimeout(() => {
            toast.info("Logged out due to inactivity.");
        }, 100);
        
      } catch (err) {
        console.error("Logout Error:", err);
      }
    }, TIMEOUT_MS);
  };

  // 1. Check Role Dynamically (Fixes Page Refresh & Login issues)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
         // User is not logged in
         setIsChecking(false);
         setIsAdmin(false);
         return;
      }

      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          if (role === "admin" || role === "staff") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Manage Listeners
  useEffect(() => {
    // If checking or Admin, STOP here. (Admins get no listeners = no logout)
    if (isChecking || isAdmin) return;

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    const handleActivity = () => startTimer();

    events.forEach((ev) => window.addEventListener(ev, handleActivity));
    startTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      cleanUp();
    };
  }, [isChecking, isAdmin, navigate]); 
};