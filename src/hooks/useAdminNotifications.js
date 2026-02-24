import { useEffect, useRef, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../jsfile/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 * Watches 3 Firestore collections in real-time and:
 *  - Returns live badge counts for the Sidebar
 *  - Shows a toast when a NEW item arrives (compared to the previous snapshot)
 *
 * @returns {{ shipmentRequests: number, messageRequests: number, liveChats: number }}
 */
export const useAdminNotifications = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        shipmentRequests: 0,
        messageRequests: 0,
        liveChats: 0,
    });

    // Track previous counts so we can detect NEW arrivals and toast
    const prevCountsRef = useRef({ shipmentRequests: 0, messageRequests: 0, liveChats: 0 });
    // Avoid toasting on the very first snapshot load (app boot)
    const initializedRef = useRef({ shipmentRequests: false, messageRequests: false, liveChats: false });

    useEffect(() => {
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
            setCounts((c) => ({ ...c, shipmentRequests: count }));
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
            setCounts((c) => ({ ...c, messageRequests: count }));
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
            setCounts((c) => ({ ...c, liveChats: count }));
        });

        return () => {
            unsubShip();
            unsubMsg();
            unsubChat();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return counts;
};
