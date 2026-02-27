require('dotenv').config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { randomUUID } = require("crypto");
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Load environment variables (optional)
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize Firebase Admin SDK
const db = admin.firestore();
const auth = admin.auth();
const ROLE_INACTIVITY_MS = {
  user: 5 * 60 * 1000,
  admin: 10 * 60 * 1000,
  staff: 10 * 60 * 1000,
};
const WS_HEARTBEAT_MS = 30 * 1000;
const wsMeta = new WeakMap();
const socketsByUid = new Map();
const sessionActivity = new Map();

const ensureUidBucket = (uid) => {
  if (!socketsByUid.has(uid)) {
    socketsByUid.set(uid, new Map());
  }
  return socketsByUid.get(uid);
};

const detachSocket = (socket) => {
  const meta = wsMeta.get(socket);
  if (!meta) return;

  const sessions = socketsByUid.get(meta.uid);
  if (!sessions) return;

  const bucket = sessions.get(meta.sessionId);
  if (bucket) {
    bucket.delete(socket);
    if (bucket.size === 0) {
      sessions.delete(meta.sessionId);
    }
  }

  if (sessions.size === 0) {
    socketsByUid.delete(meta.uid);
  }

  if (!sessions.get(meta.sessionId)) {
    sessionActivity.delete(`${meta.uid}:${meta.sessionId}`);
  }

  wsMeta.delete(socket);
};

const clearSessionIfMatches = async (uid, sessionId) => {
  const userRef = db.collection("Users").doc(uid);
  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(userRef);
    if (!snapshot.exists) return;
    const data = snapshot.data() || {};
    if (data.currentSessionId === sessionId) {
      tx.update(userRef, {
        currentSessionId: null,
        forceLogout: null,
        lastLogoutAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
};

const sendJson = (socket, payload) => {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(payload));
  }
};

const markSessionActivity = (uid, sessionId) => {
  sessionActivity.set(`${uid}:${sessionId}`, Date.now());
};

const getInactivityPolicy = (role) => {
  if (role === "user") {
    return { limitMs: ROLE_INACTIVITY_MS.user, reason: "inactivity_user" };
  }

  if (role === "admin" || role === "staff") {
    return { limitMs: ROLE_INACTIVITY_MS[role], reason: "inactivity_admin" };
  }

  return null;
};

const forceLogoutSession = async (uid, sessionId, reason, code, closeReason, clearSession) => {
  const sessions = socketsByUid.get(uid);
  const sockets = sessions?.get(sessionId);

  if (sockets) {
    sockets.forEach((socket) => {
      sendJson(socket, { type: "force_logout", reason });
      socket.close(code, closeReason);
    });
  }

  if (clearSession) {
    await clearSessionIfMatches(uid, sessionId);
  }
};

const registerSocket = async (socket, idToken, sessionId) => {
  if (!idToken || !sessionId) {
    throw new Error("Missing idToken or sessionId");
  }

  const decodedToken = await auth.verifyIdToken(idToken);
  const uid = decodedToken.uid;
  const userRef = db.collection("Users").doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.data() || {};
  const currentSessionId = userData.currentSessionId;
  const role = userData.role || "user";

  if (!currentSessionId || currentSessionId !== sessionId) {
    sendJson(socket, { type: "force_logout", reason: "another_device" });
    socket.close(4001, "session_mismatch");
    return;
  }

  const uidSessions = ensureUidBucket(uid);

  for (const [existingSessionId, existingSockets] of uidSessions.entries()) {
    if (existingSessionId === sessionId) continue;
    existingSockets.forEach((existingSocket) => {
      sendJson(existingSocket, { type: "force_logout", reason: "another_device" });
      existingSocket.close(4001, "another_device");
    });
  }

  if (!uidSessions.has(sessionId)) {
    uidSessions.set(sessionId, new Set());
  }
  uidSessions.get(sessionId).add(socket);

  wsMeta.set(socket, {
    uid,
    sessionId,
    role,
    isAuthenticated: true,
  });
  markSessionActivity(uid, sessionId);

  sendJson(socket, { type: "session_ready", role });
};

wss.on("connection", (socket) => {
  socket.isAlive = true;

  socket.on("pong", () => {
    socket.isAlive = true;
    const meta = wsMeta.get(socket);
    if (meta) {
      markSessionActivity(meta.uid, meta.sessionId);
    }
  });

  socket.on("message", async (rawPayload) => {
    let message;

    try {
      message = JSON.parse(rawPayload.toString());
    } catch {
      sendJson(socket, { type: "error", reason: "invalid_payload" });
      return;
    }

    const meta = wsMeta.get(socket);

    if (!meta) {
      if (message.type !== "auth") {
        sendJson(socket, { type: "error", reason: "auth_required" });
        return;
      }

      try {
        await registerSocket(socket, message.idToken, message.sessionId);
      } catch (error) {
        console.error("WebSocket auth error:", error);
        sendJson(socket, { type: "error", reason: "invalid_auth" });
        socket.close(4003, "invalid_auth");
      }
      return;
    }

    if (message.type === "activity") {
      markSessionActivity(meta.uid, meta.sessionId);
      return;
    }

    if (message.type === "ping") {
      markSessionActivity(meta.uid, meta.sessionId);
      sendJson(socket, { type: "pong" });
    }
  });

  socket.on("close", () => {
    detachSocket(socket);
  });

  socket.on("error", () => {
    detachSocket(socket);
  });
});

setInterval(() => {
  const now = Date.now();
  const checkedSessionKeys = new Set();

  wss.clients.forEach((socket) => {
    const meta = wsMeta.get(socket);

    if (meta) {
      const sessionKey = `${meta.uid}:${meta.sessionId}`;
      const inactivityPolicy = getInactivityPolicy(meta.role);
      if (!inactivityPolicy) {
        return;
      }

      if (!checkedSessionKeys.has(sessionKey)) {
        checkedSessionKeys.add(sessionKey);

        const lastActivityAt = sessionActivity.get(sessionKey) || 0;
        if (now - lastActivityAt > inactivityPolicy.limitMs) {
          forceLogoutSession(
            meta.uid,
            meta.sessionId,
            inactivityPolicy.reason,
            4000,
            "inactivity_timeout",
            true
          ).catch((error) => {
            console.error("Failed to force logout inactive session:", error);
          });
        }
      }
    }

    if (socket.isAlive === false) {
      socket.terminate();
      return;
    }

    socket.isAlive = false;
    socket.ping();
  });
}, WS_HEARTBEAT_MS);

const deleteExpiredConversations = async () => {
  try {
    const olderThanOneMinute = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
    const snapshot = await db.collection("conversations").get();

    if (snapshot.empty) {
      console.log("No conversations found.");
      return;
    }

    const statusesToDelete = ["pending", "ended", "rejected", "faqchat"];
    const deletePromises = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Build a condition:
      // 1. If the document is completely empty (likely orphaned).
      // 2. Or if it has a createdAt field (and it's older than one minute)
      //    and its status is either missing or one of the statuses to delete.
      if (
        Object.keys(data).length === 0 ||
        (
          (!data.createdAt || (data.createdAt.toDate && data.createdAt.toDate() <= olderThanOneMinute)) &&
          (!data.status || statusesToDelete.includes(data.status))
        )
      ) {
        console.log(`Deleting conversation: ${doc.id}`);
        // Use recursiveDelete to completely remove the document and its subcollections.
        deletePromises.push(admin.firestore().recursiveDelete(doc.ref));
      }
    });

    await Promise.all(deletePromises);
    console.log("Deleted expired conversations (including subcollections) that met the conditions.");
  } catch (error) {
    console.error("Error deleting expired conversations:", error);
  }
};

const deleteOrphanedConversations = async () => {
  try {
    const snapshot = await db.collection("conversations").get();

    if (snapshot.empty) {
      console.log("No conversations found.");
      return;
    }

    const batch = db.batch();
    const deletePromises = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // If the document has no fields but has subcollections
      if (Object.keys(data).length === 0) {
        console.log(`Deleting orphaned conversation: ${doc.id}`);

        // Recursively delete the document and its subcollections
        deletePromises.push(admin.firestore().recursiveDelete(doc.ref));
      }
    });

    // Execute all deletions
    await Promise.all(deletePromises);
    console.log("Deleted orphaned conversations with subcollections.");
  } catch (error) {
    console.error("Error deleting orphaned conversations:", error);
  }
};

// --- REMOVED: deleteCanceledPackages function and interval ---

// Run deletion every minute
setInterval(deleteExpiredConversations, 60 * 1000);
setInterval(deleteOrphanedConversations, 60 * 1000);

// Create a new user without logging them in
app.post("/createUser", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false, // User must verify email manually
    });

    // Store user details in Firestore
    await admin.firestore().collection("Users").doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      role,
      uid: userRecord.uid,
      verified: false, // Mark as unverified in Firestore
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "User created successfully!", uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user from Firebase Auth and Firestore
app.delete("/deleteUser/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    // Delete user from Firebase Authentication
    await auth.deleteUser(uid);

    // Remove user from Firestore
    await admin.firestore().collection("Users").doc(uid).delete();

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === ADD THIS AFTER YOUR OTHER ROUTES ===

// Establish new session (single device login) — NO revokeRefreshTokens
app.post("/revokeOtherSessions", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Generate new session ID
    const sessionId = randomUUID();

    // Update Firestore with the new session ID
    await db.collection("Users").doc(uid).update({
      currentSessionId: sessionId,
      forceLogout: null,
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ New session created for ${uid} → ${sessionId}`);

    res.status(200).json({ success: true, sessionId });
  } catch (error) {
    console.error("Session error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/logoutSession", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { sessionId } = req.body || {};

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await clearSessionIfMatches(uid, sessionId);
    await forceLogoutSession(
      uid,
      sessionId,
      "manual_logout",
      4002,
      "manual_logout",
      false
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout session error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
