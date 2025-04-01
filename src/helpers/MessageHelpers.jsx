import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export const sendMessage = async (db, conversationId, text, senderId) => {
  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    text,
    senderId,
    timestamp: new Date(),
  });

  await updateDoc(doc(db, "conversations", conversationId), {
  });
};
