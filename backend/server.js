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
    const olderThanFiveMinutes = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

    // Fetch conversations where status is 'pending' or 'ended' and updatedAt is older than 5 mins
    const snapshot = await db
      .collection("conversations")
      .where("status", "in", ["pending", "ended","rejected","faqchat"])
      .where("createdAt", "<=", olderThanFiveMinutes) // Ensure correct timestamp comparison
      .get();

    if (snapshot.empty) {
      console.log("No expired conversations to delete.");
      return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
    console.log(`Deleted ${snapshot.size} expired conversations.`);
  } catch (error) {
    console.error("Error deleting expired conversations:", error);
  }
};

// Run deletion every minute
setInterval(deleteExpiredConversations, 60 * 1000);

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
