import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../jsfile/firebase"; // Ensure your firebase config exports 'db'

/**
 * docName: 'general', 'home', 'about', 'services', 'contact'
 */
const useSiteContent = (docName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docName) return;

    // Using onSnapshot for real-time updates when you edit in ManageSystem
    const unsub = onSnapshot(doc(db, "siteContent", docName), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(null); // Fallback handled in components
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${docName}:`, error);
      setLoading(false);
    });

    return () => unsub();
  }, [docName]);

  return { data, loading };
};

export default useSiteContent;