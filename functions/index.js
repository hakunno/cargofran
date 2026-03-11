const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onMessagePublished } = require("firebase-functions/v2/pubsub");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
admin.initializeApp();
const nodemailer = require("nodemailer");

const gmailEmail = defineSecret("GMAIL_EMAIL");
const gmailPassword = defineSecret("GMAIL_PASSWORD");

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getTransporter = (email, password) =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: email, pass: password },
  });

// ─── Email Triggers ────────────────────────────────────────────────────────────

// 1. Email on request submission
exports.sendRequestConfirmation = onDocumentCreated(
  { document: "shipRequests/{requestId}", secrets: [gmailEmail, gmailPassword] },
  async (event) => {
    const data = event.data.data();
    const transporter = getTransporter(gmailEmail.value(), gmailPassword.value());
    await transporter.sendMail({
      from: gmailEmail.value(),
      to: data.email,
      subject: "Shipping Request Submitted",
      text: `Dear ${data.name},\n\nYour shipping request has been submitted successfully. We will review it and get back to you soon.\n\nThank you!`,
    }).catch((err) => console.error("Error sending confirmation email:", err));
  }
);

// 2. Email on request status update (Accepted or Rejected)
exports.sendRequestStatusUpdate = onDocumentUpdated(
  { document: "shipRequests/{requestId}", secrets: [gmailEmail, gmailPassword] },
  async (event) => {
    const newData = event.data.after.data();
    const oldData = event.data.before.data();
    if (newData.status === oldData.status) return;

    let subject = "";
    let text = "";
    if (newData.status === "Accepted") {
      subject = "Shipping Request Accepted";
      text = `Dear ${newData.name},\n\nYour shipping request has been accepted. Your package number is ${newData.packageNumber}.\n\nWe will update you on the status soon.\n\nThank you!`;
    } else if (newData.status === "Rejected") {
      subject = "Shipping Request Rejected";
      text = `Dear ${newData.name},\n\nWe regret to inform you that your shipping request has been rejected.\n\nPlease contact support for more details.\n\nThank you!`;
    }

    if (!subject) return;
    const transporter = getTransporter(gmailEmail.value(), gmailPassword.value());
    await transporter.sendMail({
      from: gmailEmail.value(),
      to: newData.email,
      subject,
      text,
    }).catch((err) => console.error("Error sending status update email:", err));
  }
);

// 3. Email on shipment status update
exports.sendShipmentStatusUpdate = onDocumentCreated(
  { document: "Packages/{packageId}/statusHistory/{historyId}", secrets: [gmailEmail, gmailPassword] },
  async (event) => {
    const newStatus = event.data.data().status;
    const packageId = event.params.packageId;
    const packageSnap = await admin.firestore().collection("Packages").doc(packageId).get();
    const packageData = packageSnap.data();

    const transporter = getTransporter(gmailEmail.value(), gmailPassword.value());
    await transporter.sendMail({
      from: gmailEmail.value(),
      to: packageData.email,
      subject: "Shipment Status Updated",
      text: `Dear ${packageData.shipperName},\n\nYour shipment (Package Number: ${packageData.packageNumber}) status has been updated to: ${newStatus}.\n\nThank you!`,
    }).catch((err) => console.error("Error sending shipment status email:", err));
  }
);

// ─── Callable Functions (replacing Express REST endpoints) ────────────────────

// 4. Create a new user (replaces POST /createUser)
exports.createUser = onCall({ enforceAppCheck: false }, async (request) => {
  // Only admins and staff can create users
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in.");
  }

  const callerDoc = await admin.firestore().collection("Users").doc(request.auth.uid).get();
  const callerRole = callerDoc.data()?.role;
  if (callerRole !== "admin" && callerRole !== "staff") {
    throw new HttpsError("permission-denied", "Only admins or staff can create users.");
  }

  const { firstName, lastName, email, password, role } = request.data;
  if (!firstName || !lastName || !email || !password) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
    emailVerified: false,
  });

  await admin.firestore().collection("Users").doc(userRecord.uid).set({
    firstName,
    lastName,
    email,
    role: role || "user",
    uid: userRecord.uid,
    verified: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { uid: userRecord.uid, message: "User created successfully!" };
});

// 5. Delete a user (replaces DELETE /deleteUser/:uid)
exports.deleteUser = onCall({ enforceAppCheck: false }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in.");
  }

  const callerDoc = await admin.firestore().collection("Users").doc(request.auth.uid).get();
  const callerRole = callerDoc.data()?.role;
  if (callerRole !== "admin") {
    throw new HttpsError("permission-denied", "Only admins can delete users.");
  }

  const { userId } = request.data;
  if (!userId) {
    throw new HttpsError("invalid-argument", "Missing userId.");
  }

  await admin.auth().deleteUser(userId);
  await admin.firestore().collection("Users").doc(userId).delete();

  return { message: "User deleted successfully!" };
});

// 6. Logout a session (replaces POST /logoutSession)
exports.logoutSession = onCall({ enforceAppCheck: false }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in.");
  }

  const uid = request.auth.uid;
  const { sessionId } = request.data;
  if (!sessionId) {
    throw new HttpsError("invalid-argument", "Missing sessionId.");
  }

  // Clear session from Firestore if it still matches
  const userRef = admin.firestore().collection("Users").doc(uid);
  await admin.firestore().runTransaction(async (tx) => {
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

  return { success: true };
});

// 7. Securely create a new shipment (prevents duplicate package numbers)
exports.createShipment = onCall({ enforceAppCheck: false }, async (request) => {
  // 1. Verify Authentication & Role
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in to create a shipment.");
  }

  const callerUid = request.auth.uid;
  const db = admin.firestore();

  const callerDoc = await db.collection("Users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;

  if (callerRole !== "admin" && callerRole !== "staff") {
    throw new HttpsError("permission-denied", "Only admins or staff can create shipments.");
  }

  const shipmentData = request.data;
  const packageNumber = shipmentData.packageNumber?.trim();
  const airwayBill = shipmentData.airwayBill?.trim();

  if (!packageNumber) {
    throw new HttpsError("invalid-argument", "Missing package number.");
  }

  // 2. Transact safely or check for duplicates
  // Using a lock/transaction isn't perfectly feasible across the whole collection without
  // making packageNumber the actual Document ID. 
  // But a robust query check in the backend is much safer than client-side.
  const packageNumberSnap = await db.collection("Packages")
    .where("packageNumber", "==", packageNumber)
    .get();

  if (!packageNumberSnap.empty) {
    throw new HttpsError("already-exists", `A shipment with tracking number "${packageNumber}" already exists.`);
  }

  if (airwayBill) {
    const airwayBillSnap = await db.collection("Packages")
      .where("airwayBill", "==", airwayBill)
      .get();

    if (!airwayBillSnap.empty) {
      throw new HttpsError("already-exists", `A shipment with Airway Bill "${airwayBill}" already exists.`);
    }
  }

  // 3. Create the document safely
  // We cannot use serverTimestamp() directly in nested objects via the SDK easily without FieldValue,
  // but we can attach it at the top level
  const newShipmentRef = db.collection("Packages").doc(); // Generate random ID

  const formattedData = {
    ...shipmentData,
    dateStarted: new Date().toISOString(),
    createdTime: admin.firestore.FieldValue.serverTimestamp(),
    isArchived: false,
  };

  await newShipmentRef.set(formattedData);

  // Return the auto-generated document ID back to the client
  return { id: newShipmentRef.id, message: "Shipment created successfully" };
});


// ─── Scheduled Function (replaces setInterval in server.js) ──────────────────

// 7. Clean up expired/orphaned conversations every 1 hour
exports.cleanupExpiredConversations = onSchedule("every 60 minutes", async () => {
  const db = admin.firestore();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const snapshot = await db.collection("conversations").get();
  if (snapshot.empty) return;

  const statusesToDelete = ["pending", "ended", "rejected", "faqchat"];
  const deletePromises = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // Delete orphaned (empty) documents
    if (Object.keys(data).length === 0) {
      deletePromises.push(db.recursiveDelete(docSnap.ref));
      return;
    }

    // Skip approved live-agent chats (admin ends those manually)
    if (data.status === "approved") return;

    if (!data.status || statusesToDelete.includes(data.status)) {
      const lastActive = data.updatedAt?.toDate?.() || data.createdAt?.toDate?.();
      if (!lastActive || lastActive <= oneHourAgo) {
        deletePromises.push(db.recursiveDelete(docSnap.ref));
      }
    }
  });

  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
    console.log(`Cleaned up ${deletePromises.length} expired conversation(s).`);
  }
});

// ─── Billing Kill Switch ───────────────────────────────────────────────────────
// Triggered when a Google Cloud Billing Budget alert is published to Pub/Sub.
// Set up the billing budget in Google Cloud Console and point it to the
// Pub/Sub topic: "billing-kill-switch" (create it in the same project).
//
// To MANUALLY turn off:  Set config/app { maintenanceMode: false } in Firestore.
// To MANUALLY turn on:   Set config/app { maintenanceMode: true } in Firestore.

exports.billingKillSwitch = onMessagePublished(
  { topic: "billing-kill-switch" },
  async (event) => {
    const db = admin.firestore();

    // Decode the Pub/Sub message from the billing budget alert
    let budgetAlert;
    try {
      const raw = event.data.message.data;
      budgetAlert = raw ? JSON.parse(Buffer.from(raw, "base64").toString()) : {};
    } catch (err) {
      console.error("Failed to parse billing alert message:", err);
      budgetAlert = {};
    }

    const costAmount = budgetAlert.costAmount || 0;
    const budgetAmount = budgetAlert.budgetAmount || Infinity;
    const alertThresholdExceeded = budgetAlert.alertThresholdExceeded || 1.0;

    console.log(`💰 Billing alert: $${costAmount} / $${budgetAmount} (threshold: ${alertThresholdExceeded * 100}%)`);

    // Ensure we ONLY kill the site if the actual cost has reached or exceeded the budget
    if (costAmount >= budgetAmount) {
      console.log("🔴 BUDGET EXCEEDED! Activating Kill Switch...");
      // Enable maintenance mode to take the site offline
      await db.collection("config").doc("app").set(
        {
          maintenanceMode: true,
          maintenanceTrigger: "billing_alert",
          maintenanceTriggeredAt: admin.firestore.FieldValue.serverTimestamp(),
          billingCostAmount: costAmount,
          billingBudgetAmount: budgetAmount,
        },
        { merge: true }
      );
      console.log("🔴 KILL SWITCH ACTIVATED — Site is now in maintenance mode.");
    } else {
      console.log(`🟢 Budget not reached yet. Current cost: $${costAmount}. No action taken.`);
    }
  }
);