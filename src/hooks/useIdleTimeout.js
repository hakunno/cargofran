import { useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../jsfile/firebase";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../jsfile/firebase";

const TIMEOUT_MS = 5 * 60 * 1000;     // 5 minutes
const WARNING_MS = 60 * 1000;         // warning 1 min before

export const useIdleTimeout = () => {
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const isAdminRef = useRef(false);

  const resetTimer = () => {
    if (isAdminRef.current) return;   // ← SKIP FOR ADMINS

    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      toast.warning("Your session will expire in 1 minute due to inactivity", {
        position: "top-center",
        autoClose: 55000,
      });
    }, TIMEOUT_MS - WARNING_MS);

    timeoutRef.current = setTimeout(async () => {
      try {
        await signOut(auth);
        toast.info("Logged out due to inactivity.");
        window.location.href = "/";
      } catch (err) {
        console.error(err);
      }
    }, TIMEOUT_MS);
  };

  // Check user role once
  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        isAdminRef.current = role === "admin" || role === "staff";
      }
    };

    checkRole();
  }, []);

  // Activity listeners
  useEffect(() => {
    if (isAdminRef.current) return;   // don't even attach listeners for admins

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach(ev => window.addEventListener(ev, handleActivity));
    resetTimer();

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleActivity));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };
  }, []);
};