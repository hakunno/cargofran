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

    return () => unsubscribe();
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