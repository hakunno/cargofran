import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../jsfile/firebase";
import { db } from "../jsfile/firebase";
import { fetchUserData } from "../helpers/AuthHelpers"; // Keep this import!

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.isAnonymous) {
          setRole("guest");
        } else {
          try {
            // This uses your helper to get the role!
            const data = await fetchUserData(db, currentUser);
            setRole(data?.role || "user");
          } catch (error) {
            console.error("Error fetching user data:", error);
            setRole("user"); // Fallback to basic user if error
          }
        }
      } else {
        setUser(null);
        setRole("guest");
      }
      // ONLY set loading to false after we have the user AND the role
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- THE FIX IS HERE ---
  // If we are still loading, don't render the app yet.
  // This prevents the "Footer Only" glitch.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);