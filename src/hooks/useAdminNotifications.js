import { useEffect, useRef, useState, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../jsfile/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const STORAGE_KEY = "adminNotifSeen";

const loadSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveSeen = (seen) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
};

/**
 * Watches 3 Firestore collections in real-time and:
 *  - Returns live badge counts for the Sidebar (only showing NEW items since last visit)
 *  - Shows a toast when a NEW item arrives (compared to the previous snapshot)
 *  - Provides markAsSeen(section) to dismiss a section's badge when the page is visited
 *
 * @returns {{ shipmentRequests: number, messageRequests: number, liveChats: number, markAsSeen: Function }}
 */
export const useAdminNotifications = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  // Live counts from Firestore
  const [liveCounts, setLiveCounts] = useState({
    shipmentRequests: 0,
    messageRequests: 0,
    liveChats: 0,
    shipmentChats: 0,
  });

  // "Seen" counts — how many were visible when the user last visited that page
  const [seenCounts, setSeenCounts] = useState(loadSeen);

  // Track previous live counts so we can detect NEW arrivals and toast
  const prevCountsRef = useRef({ shipmentRequests: 0, messageRequests: 0, liveChats: 0, shipmentChats: 0 });
  // Avoid toasting on the very first snapshot load (app boot)
  const initializedRef = useRef({ shipmentRequests: false, messageRequests: false, liveChats: false, shipmentChats: false });

  useEffect(() => {
    if (!user || (role !== "admin" && role !== "staff")) {
      return;
    }

    // ── 1. Shipment Requests (status == "Processing") ─────────────────────
    const shipQ = query(
      collection(db, "shipRequests"),
      where("status", "==", "Processing")
    );
    const unsubShip = onSnapshot(shipQ, (snap) => {
      const count = snap.size;
      const prev = prevCountsRef.current.shipmentRequests;

      if (initializedRef.current.shipmentRequests && count > prev) {
        const diff = count - prev;
        toast.info(
          `📦 ${diff} new shipment request${diff > 1 ? "s" : ""}!`,
          {
            autoClose: 6000,
            onClick: () => navigate("/ShipmentRequest"),
          }
        );
      }

      initializedRef.current.shipmentRequests = true;
      prevCountsRef.current.shipmentRequests = count;
      setLiveCounts((c) => ({ ...c, shipmentRequests: count }));
    });

    // ── 2. Message / Conversation Requests (pending + sent) ───────────────
    const msgQ = query(
      collection(db, "conversations"),
      where("status", "==", "pending"),
      where("request", "==", "sent")
    );
    const unsubMsg = onSnapshot(msgQ, (snap) => {
      const count = snap.size;
      const prev = prevCountsRef.current.messageRequests;

      if (initializedRef.current.messageRequests && count > prev) {
        const diff = count - prev;
        toast.info(
          `💬 ${diff} new message request${diff > 1 ? "s" : ""}!`,
          {
            autoClose: 6000,
            onClick: () => navigate("/MessageRequest"),
          }
        );
      }

      initializedRef.current.messageRequests = true;
      prevCountsRef.current.messageRequests = count;
      setLiveCounts((c) => ({ ...c, messageRequests: count }));
    });

    // ── 3. Live Chats (approved conversations) ────────────────────────────
    const chatQ = query(
      collection(db, "conversations"),
      where("status", "==", "approved")
    );
    const unsubChat = onSnapshot(chatQ, (snap) => {
      const count = snap.size;
      const prev = prevCountsRef.current.liveChats;

      if (initializedRef.current.liveChats && count > prev) {
        const diff = count - prev;
        toast.info(
          `🟢 ${diff} new live chat${diff > 1 ? "s" : ""} started!`,
          {
            autoClose: 6000,
            onClick: () => navigate("/AdminMessages"),
          }
        );
      }

      initializedRef.current.liveChats = true;
      prevCountsRef.current.liveChats = count;
      setLiveCounts((c) => ({ ...c, liveChats: count }));
    });

    // ── 4. Shipment Chats (active) ────────────────────────────
    const shipmentChatQ = query(
      collection(db, "shipment_conversations"),
      where("status", "==", "active")
    );
    const unsubShipmentChat = onSnapshot(shipmentChatQ, (snap) => {
      const count = snap.size;
      const prev = prevCountsRef.current.shipmentChats;

      if (initializedRef.current.shipmentChats && count > prev) {
        const diff = count - prev;
        toast.info(
          `🚚 ${diff} new shipment message${diff > 1 ? "s" : ""}!`,
          {
            autoClose: 6000,
            onClick: () => navigate("/AdminShipmentMessages"),
          }
        );
      }

      initializedRef.current.shipmentChats = true;
      prevCountsRef.current.shipmentChats = count;
      setLiveCounts((c) => ({ ...c, shipmentChats: count }));
    });

    return () => {
      unsubShip();
      unsubMsg();
      unsubChat();
      unsubShipmentChat();
    };
  }, [user, role, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Call this when the user visits (clicks) a section.
   * It saves the current live count as "seen" so the badge disappears.
   * @param {"shipmentRequests"|"messageRequests"|"liveChats"|"shipmentChats"} section
   */
  const markAsSeen = useCallback((section) => {
    setLiveCounts((currentLive) => {
      const updated = { ...loadSeen(), [section]: currentLive[section] };
      saveSeen(updated);
      setSeenCounts(updated);
      return currentLive; // live counts unchanged
    });
  }, []);

  // Compute visible badge counts: only show if live > seen
  const shipmentRequests = Math.max(0, liveCounts.shipmentRequests - (seenCounts.shipmentRequests ?? 0));
  const messageRequests = Math.max(0, liveCounts.messageRequests - (seenCounts.messageRequests ?? 0));
  const liveChats = Math.max(0, liveCounts.liveChats - (seenCounts.liveChats ?? 0));
  const shipmentChats = Math.max(0, liveCounts.shipmentChats - (seenCounts.shipmentChats ?? 0));

  return { shipmentRequests, messageRequests, liveChats, shipmentChats, markAsSeen };
};
