import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../component/adminstaff/Sidebar";

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
      <div className="flex flex-col md:flex-row">
      <Sidebar />
      </div>
    </div>
  );
}

export default AdminDashboard;
