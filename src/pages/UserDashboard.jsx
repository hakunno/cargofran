import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener when unmounted
  }, []);

  return (
    <div>
      <h1>Welcome {user ? user.email : "Guest"}</h1>
    </div>
  );
}

export default UserDashboard;
