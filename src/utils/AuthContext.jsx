import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../jsfile/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../jsfile/firebase";
import { fetchUserData } from "../helpers/AuthHelpers"; // if you have this helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        if (user.isAnonymous) {
          setRole("guest");
          // Optionally, set some guest-specific data if needed
        } else {
          try {
            const data = await fetchUserData(db, user);
            setRole(data?.role || "user");
          } catch (error) {
            console.error("Error fetching user data:", error);
            setRole(null);
          }
        }
      } else {
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
