import { Navigate } from "react-router-dom";
import { auth } from "../jsfile/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../jsfile/firebase";

const ProtectedRoute = ({ children, requiredRoles, redirectForAdmin = false }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
        }
      } else {
        // If no user is logged in, treat as guest.
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If the route is set to redirect admin/staff and role is admin or staff.
  if (redirectForAdmin && (role === "admin" || role === "staff")) {
    return <Navigate to="/AdminDashboard" replace />;
  }

  // If requiredRoles is provided, allow access only if role is included.
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
