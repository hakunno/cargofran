import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../jsfile/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === requiredRole) {
            setAuthorized(true);
          }
        }
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [requiredRole]);

  if (loading) return <p></p>; // Show a loading message while checking

  return authorized ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
