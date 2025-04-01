import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export const createNewConversation = async (db, authUser, userData, firstMessage) => {
  const fullName = userData
    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
    : "Unknown User";

  const convoRef = await addDoc(collection(db, "conversations"), {
    userId: authUser.uid,
    userFirstName: userData?.firstName || "",
    userLastName: userData?.lastName || "",
    userFullName: fullName,
    userEmail: userData?.email || authUser.email,
    status: "faqchat",
    createdAt: serverTimestamp(),
  });

  // Add first message
  await addDoc(collection(db, "conversations", convoRef.id, "messages"), {
    text: firstMessage,
    senderId: authUser.uid,
    timestamp: new Date(),
  });

  return convoRef.id;
};

export const updateConversationStatus = async (db, conversationId, status) => {
  const convoDocRef = doc(db, "conversations", conversationId);
  await updateDoc(convoDocRef, { status });
};

export const stopConversation = async (db, conversationId) => {
  const convoDocRef = doc(db, "conversations", conversationId);
  await updateDoc(convoDocRef, { status: "ended" });
};
