import { useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../jsfile/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "scroll", "click", "touchstart"];
const ACTIVITY_THROTTLE_MS = 15 * 1000;

const getDefaultWsUrl = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://localhost:5000`;
};

export const useSessionSocket = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const activeSessionRef = useRef(null);
  const cleanupActivityRef = useRef(null);
  const logoutInProgressRef = useRef(false);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const removeActivityListeners = () => {
    if (cleanupActivityRef.current) {
      cleanupActivityRef.current();
      cleanupActivityRef.current = null;
    }
  };

  const closeSocket = () => {
    removeActivityListeners();
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (error) {
        console.error("WebSocket close error:", error);
      }
      socketRef.current = null;
    }
  };

  const forceLogout = async (reason) => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;

    localStorage.removeItem("sessionId");
    activeSessionRef.current = null;

    if (reason === "manual_logout") {
      logoutInProgressRef.current = false;
      return;
    }

    if (reason === "inactivity_user") {
      toast.info("Logged out after 5 minutes of inactivity.");
    } else if (reason === "inactivity_admin") {
      toast.info("Logged out after 10 minutes of inactivity.");
    } else {
      toast.error("Your account was signed in on another device. You have been logged out.");
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("signOut failed:", error);
    }

    navigate("/");
    logoutInProgressRef.current = false;
  };

  const attachActivityListeners = (socket) => {
    let lastSentAt = 0;

    const sendActivity = () => {
      const now = Date.now();
      if (now - lastSentAt < ACTIVITY_THROTTLE_MS) return;
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send(JSON.stringify({ type: "activity", at: now }));
      lastSentAt = now;
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, sendActivity);
    });

    sendActivity();

    cleanupActivityRef.current = () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, sendActivity);
      });
    };
  };

  const scheduleReconnect = (uid) => {
    clearReconnectTimer();
    const sessionId = localStorage.getItem("sessionId");
    if (!uid || !sessionId) return;
    if (logoutInProgressRef.current) return;

    const delayMs = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 15000);
    reconnectTimerRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      connect(uid, sessionId);
    }, delayMs);
  };

  const connect = async (uid, sessionId) => {
    if (!uid || !sessionId) return;
    if (socketRef.current) return;

    const user = auth.currentUser;
    if (!user || user.uid !== uid) return;

    try {
      const idToken = await user.getIdToken(true);
      const wsUrl = import.meta.env.VITE_WS_URL || getDefaultWsUrl();
      const socket = new WebSocket(wsUrl);

      socketRef.current = socket;
      activeSessionRef.current = sessionId;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        socket.send(
          JSON.stringify({
            type: "auth",
            idToken,
            sessionId,
          })
        );
      };

      socket.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "session_ready") {
            attachActivityListeners(socket);
            return;
          }

          if (message.type === "force_logout") {
            closeSocket();
            if (message.reason === "manual_logout") {
              return;
            }
            await forceLogout(message.reason);
          }
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };

      socket.onclose = () => {
        removeActivityListeners();
        socketRef.current = null;
        scheduleReconnect(uid);
      };

      socket.onerror = () => {
        removeActivityListeners();
      };
    } catch (error) {
      console.error("WebSocket connect error:", error);
      scheduleReconnect(uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearReconnectTimer();
      closeSocket();

      if (!user) {
        reconnectAttemptsRef.current = 0;
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      connect(user.uid, sessionId);
    });

    return () => {
      unsubscribe();
      clearReconnectTimer();
      closeSocket();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
