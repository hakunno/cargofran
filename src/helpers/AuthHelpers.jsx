import { doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (db, user) => {
  try {
    const userDocRef = doc(db, "Users", user.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
