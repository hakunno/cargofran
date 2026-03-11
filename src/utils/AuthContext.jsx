import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../jsfile/firebase";
import { db } from "../jsfile/firebase";
import { fetchUserData } from "../helpers/AuthHelpers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // === OFFLINE DEMO MODE BYPASS ===
    const offlineMode = localStorage.getItem("offlineDemoMode");
    if (offlineMode === "admin" || offlineMode === "true") {
      setUser({
        uid: "demo-admin-uid",
        email: "demo-admin@cargofran.com",
        displayName: "Offline Demo Admin"
      });
      setRole("admin");
      setLoading(false);
      return;
    } else if (offlineMode === "user") {
      setUser({
        uid: "demo-user-uid",
        email: "demo-user@cargofran.com",
        displayName: "Offline Demo User",
        firstName: "Demo",
        lastName: "User",
        mobile: "09123456789"
      });
      setRole("user");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.isAnonymous) {
          setRole("guest");
        } else {
          try {
            const data = await fetchUserData(db, currentUser);
            setRole(data?.role || "user");
          } catch (error) {
            console.error("Error fetching user data:", error);
            setRole("user");
          }
        }
      } else {
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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