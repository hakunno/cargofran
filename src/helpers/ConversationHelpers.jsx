import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

// --- EXISTING HELPER: Create New Conversation ---
export const createNewConversation = async (db, user, userData, initialMessage) => {
  try {
    const convoRef = await addDoc(collection(db, "conversations"), {
      userId: user.uid,
      userFullName: userData?.firstName 
        ? `${userData.firstName} ${userData.lastName}` 
        : (user.displayName || "Guest"),
      userEmail: user.email || "No Email",
      role: userData?.role || "guest",
      status: "pending", // pending, approved, rejected, faqchat, ended
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: initialMessage,
      adminId: null, 
    });

    // Add initial message to subcollection
    await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
      text: initialMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    return convoRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

// --- EXISTING HELPER: Update Status ---
export const updateConversationStatus = async (db, conversationId, newStatus) => {
  try {
    const convoRef = doc(db, "conversations", conversationId);
    await updateDoc(convoRef, {
      status: newStatus,
      updatedAt: serverTimestamp(), // Update timestamp to reorder lists
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

// --- NEW HELPER: Archive Conversation (End Chat & Save History) ---
export const archiveConversation = async (db, conversationId) => {
  try {
    // 1. Get the Main Conversation Details
    const convoRef = doc(db, "conversations", conversationId);
    const convoSnap = await getDoc(convoRef);

    if (!convoSnap.exists()) {
      console.error("Conversation to archive not found");
      return false;
    }

    const convoData = convoSnap.data();

    // 2. Get All Messages (Ordered by time to ensure history is correct)
    const msgsRef = collection(db, "conversations", conversationId, "messages");
    const q = query(msgsRef, orderBy("timestamp", "asc"));
    const msgsSnap = await getDocs(q);

    // Convert messages snapshot to a clean array of objects
    const messages = msgsSnap.docs.map(d => ({
       id: d.id,
       ...d.data()
    }));

    // 3. Calculate Duration
    let durationString = "0m 0s";
    let startTime = new Date();
    
    // Check if createdAt exists (it should, but safety first)
    if (convoData.createdAt) {
      // Handle Firestore Timestamp conversion
      startTime = convoData.createdAt.toDate ? convoData.createdAt.toDate() : new Date(convoData.createdAt);
      const endTime = new Date();
      const durationMs = endTime - startTime;

      // Calculate minutes and seconds
      const minutes = Math.floor(durationMs / 60000);
      const seconds = ((durationMs % 60000) / 1000).toFixed(0);
      durationString = `${minutes}m ${seconds}s`;
    }

    // 4. Create the Archived Document in a NEW collection
    await addDoc(collection(db, "archived_conversations"), {
      ...convoData, // Copy all original user data
      status: "ended",
      endedAt: serverTimestamp(),
      duration: durationString, // Saved calculation: e.g., "15m 30s"
      messages: messages,       // The full chat history array
      originalConversationId: conversationId
    });

    // 5. Delete the original conversation from the 'Active' list
    // This moves it out of the Inbox completely.
    await deleteDoc(convoRef);

    // Optional: Loop through and delete the subcollection messages to save storage space
    // Firestore does not automatically delete subcollections when parent is deleted.
    const deletePromises = msgsSnap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    return true;
  } catch (error) {
    console.error("Error archiving conversation:", error);
    return false;
  }
};