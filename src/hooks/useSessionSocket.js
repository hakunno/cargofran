import { useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../jsfile/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_EVENTS = ["mousemove", "keydown", "scroll", "click", "touchstart"];
const ACTIVITY_THROTTLE_MS = 15 * 1000;

// Client-side warning shown 1 min before the server's inactivity kick
const WARNING_BEFORE_MS = 60 * 1000;
const INACTIVITY_LIMITS = {
  user: 5 * 60 * 1000,
  admin: 10 * 60 * 1000,
  staff: 10 * 60 * 1000,
};

const getWsUrl = () => {
  // Only connect if an explicit WS URL is provided (e.g. when backend is deployed).
  // In production without a backend, the Firestore listener handles session management.
  return import.meta.env.VITE_WS_URL || null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSessionSocket = () => {
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const cleanupActivityRef = useRef(null);
  const warningTimerRef = useRef(null);
  const warningToastIdRef = useRef(null);
  const userRoleRef = useRef("user");
  const firestoreUnsubRef = useRef(null);
  const logoutInProgressRef = useRef(false);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const clearReconnectTimer = () => {
    clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
  };

  const clearWarningTimer = () => {
    clearTimeout(warningTimerRef.current);
    warningTimerRef.current = null;
    if (warningToastIdRef.current) {
      toast.dismiss(warningToastIdRef.current);
      warningToastIdRef.current = null;
    }
  };

  const removeActivityListeners = () => {
    cleanupActivityRef.current?.();
    cleanupActivityRef.current = null;
  };

  const stopFirestoreListener = () => {
    firestoreUnsubRef.current?.();
    firestoreUnsubRef.current = null;
  };

  const closeSocket = () => {
    removeActivityListeners();
    clearWarningTimer();
    if (socketRef.current) {
      try { socketRef.current.close(); } catch (_) { }
      socketRef.current = null;
    }
  };

  // ─── Force logout ────────────────────────────────────────────────────────
  // Uses window.location.href for a hard redirect so React + AuthContext are
  // fully reset and protected admin routes become inaccessible immediately.

  const forceLogout = async (reason) => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true; // set BEFORE closeSocket to block reconnects

    clearReconnectTimer();
    stopFirestoreListener();
    closeSocket();
    localStorage.removeItem("sessionId");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("sessionRole");

    if (reason === "another_device") {
      toast.error(
        "🚫 Your account was signed in on another device. You are being logged out.",
        { autoClose: 4000 }
      );
    } else if (reason === "inactivity_user") {
      toast.info("🕐 Logged out after 5 minutes of inactivity.", { autoClose: 4000 });
    } else if (reason === "inactivity_admin") {
      toast.info("🕐 Logged out after 10 minutes of inactivity.", { autoClose: 4000 });
    } else if (reason === "manual_logout") {
      logoutInProgressRef.current = false;
      return;
    }

    try { await signOut(auth); } catch (e) { console.error("signOut:", e); }

    // Hard redirect after toast has time to display — fully resets React state
    setTimeout(() => { window.location.href = "/"; }, 1500);
  };

  // ─── Firestore session guard (PRIMARY) ───────────────────────────────────
  // Watches the user's Firestore doc. When another device logs in,
  // Login.jsx updates `currentSessionId` in Firestore. The old device detects
  // the mismatch and calls forceLogout. Works without the local WS server.

  const startFirestoreListener = (uid) => {
    stopFirestoreListener();
    const userDocRef = doc(db, "Users", uid);

    firestoreUnsubRef.current = onSnapshot(userDocRef, (snapshot) => {
      if (logoutInProgressRef.current) return;
      if (!snapshot.exists()) return;

      const fsSessionId = snapshot.data()?.currentSessionId;

      // Read fresh from localStorage every time — never capture at startup.
      // The new device stores its sessionId AFTER Firebase auth fires, so
      // capturing it early would cause the new device to falsely kick itself.
      const mySessionId = localStorage.getItem("sessionId");

      if (!mySessionId || !fsSessionId) return; // not ready yet, skip

      if (fsSessionId !== mySessionId) {
        forceLogout("another_device");
      }
    });
  };

  // ─── Inactivity warning ──────────────────────────────────────────────────

  const scheduleWarning = () => {
    clearWarningTimer();
    const limit = INACTIVITY_LIMITS[userRoleRef.current] ?? INACTIVITY_LIMITS.user;
    warningTimerRef.current = setTimeout(() => {
      const id = toast.warning(
        "⏳ Your session will expire in 1 minute due to inactivity.",
        { position: "top-center", autoClose: false, closeOnClick: true }
      );
      warningToastIdRef.current = id;
    }, limit - WARNING_BEFORE_MS);
  };

  // ─── Activity tracking (for WS inactivity server) ────────────────────────

  const attachActivityListeners = (socket, role) => {
    userRoleRef.current = role ?? "user";
    let lastSentAt = 0;
    scheduleWarning();

    const onActivity = () => {
      scheduleWarning();
      const now = Date.now();
      if (now - lastSentAt < ACTIVITY_THROTTLE_MS) return;

      // Update local storage so if they close the tab, the new tab knows their last activity time
      localStorage.setItem("lastActivity", now.toString());

      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ type: "activity", at: now }));
      lastSentAt = now;
    };

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    onActivity();

    cleanupActivityRef.current = () =>
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
  };

  // ─── WebSocket reconnect ─────────────────────────────────────────────────

  const scheduleReconnect = (uid) => {
    if (logoutInProgressRef.current) return;
    clearReconnectTimer();
    const sessionId = localStorage.getItem("sessionId");
    if (!uid || !sessionId) return;
    const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30000);
    reconnectTimerRef.current = setTimeout(() => {
      if (logoutInProgressRef.current) return;
      reconnectAttemptsRef.current++;
      connectWs(uid, sessionId);
    }, delay);
  };

  // ─── WebSocket connect (SECONDARY — for inactivity tracking only) ─────────

  const connectWs = async (uid, sessionId) => {
    if (!uid || !sessionId) return;
    if (socketRef.current) return;
    if (logoutInProgressRef.current) return;

    const wsUrl = getWsUrl();
    if (!wsUrl) {
      // No WebSocket backend configured — rely purely on Firestore for session management.
      // Activity tracking & inactivity logout is handled by useAutoLogout.js.
      return;
    }

    const user = auth.currentUser;
    if (!user || user.uid !== uid) return;

    try {
      const idToken = await user.getIdToken(true);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        socket.send(JSON.stringify({ type: "auth", idToken, sessionId }));
      };

      socket.onmessage = async (event) => {
        if (logoutInProgressRef.current) return;
        let msg;
        try { msg = JSON.parse(event.data); } catch { return; }

        if (msg.type === "session_ready") {
          // WS authenticated — start activity tracking for inactivity logout
          attachActivityListeners(socket, msg.role ?? "user");
          return;
        }

        // WS can also trigger logout (inactivity) — Firestore handles the other-device case
        if (msg.type === "force_logout") {
          logoutInProgressRef.current = true;
          clearReconnectTimer();
          await forceLogout(msg.reason);
        }
      };

      socket.onclose = () => {
        removeActivityListeners();
        clearWarningTimer();
        socketRef.current = null;
        if (!logoutInProgressRef.current) scheduleReconnect(uid);
      };

      socket.onerror = () => removeActivityListeners();

    } catch (err) {
      console.error("WS connect error:", err);
      scheduleReconnect(uid);
    }
  };

  // ─── Auth state → start everything ──────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearReconnectTimer();
      closeSocket();
      stopFirestoreListener();

      if (!user) {
        reconnectAttemptsRef.current = 0;
        setTimeout(() => { logoutInProgressRef.current = false; }, 500);
        return;
      }

      logoutInProgressRef.current = false;

      // onAuthStateChanged fires before Login.jsx stores the sessionId on fresh logins.
      // Poll localStorage until it appears (up to 5 s), then start everything.
      const uid = user.uid;
      let attempts = 0;
      const maxAttempts = 25; // 25 × 200 ms = 5 s

      const tryStart = () => {
        if (logoutInProgressRef.current) return; // aborted by logout

        const sessionId = localStorage.getItem("sessionId");

        // Tab-agnostic offline inactivity checking
        const lastActivityStr = localStorage.getItem("lastActivity");
        const sessionRoleStr = localStorage.getItem("sessionRole") || "user";
        if (lastActivityStr) {
          const lastActivity = parseInt(lastActivityStr, 10);
          const limit = INACTIVITY_LIMITS[sessionRoleStr] || INACTIVITY_LIMITS.user;
          // If the time since last activity is greater than their limit, log them out
          if (Date.now() - lastActivity > limit) {
            forceLogout("inactivity_" + sessionRoleStr);
            return; // Halt startup
          }
        }

        if (sessionId) {
          // Session is ready — start Firestore listener + WS
          startFirestoreListener(uid);
          connectWs(uid, sessionId);
          return;
        }

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryStart, 200);
        }
        // After 5 s with no sessionId, give up (login may have failed)
      };

      tryStart();
    });

    return () => {
      unsubscribe();
      clearReconnectTimer();
      closeSocket();
      stopFirestoreListener();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
