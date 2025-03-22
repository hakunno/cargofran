import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div>
      <h1>Welcome {user ? user.email : "Guest"}</h1>
    </div>
  );
}

export default AdminDashboard;
