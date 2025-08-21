require('dotenv').config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Load environment variables (optional)
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin SDK
const db = admin.firestore();
const auth = admin.auth();

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

const deleteCanceledPackages = async () => {
  try {
    // Calculate timestamp for 24 hours ago 24 * 60 * 60 * 1000
    const twentyFourHoursAgo = new Date(Date.now() - 1 * 60 * 1000);

    // Query for packages with canceled true and createdAt <= 24 hours ago
    const snapshot = await db
      .collection("Packages")
      .where("canceled", "==", true)
      .where("createdTime", "<=", twentyFourHoursAgo)
      .get();

    if (snapshot.empty) {
      console.log("No canceled packages older than 24 hours found.");
      return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} canceled packages older than 24 hours.`);
  } catch (error) {
    console.error("Error deleting canceled packages:", error);
  }
};

// Run deletion every minute
setInterval(deleteExpiredConversations, 60 * 1000);
setInterval(deleteOrphanedConversations, 60 * 1000);

// Run every hour (3600000 milliseconds, 1 mins for now)
setInterval(deleteCanceledPackages, 60 * 1000);

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
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
