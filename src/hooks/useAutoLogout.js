import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, functions } from '../jsfile/firebase';
import { signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'react-toastify';

// Role-based inactivity limits
const INACTIVITY_LIMITS = {
    user: 5 * 60 * 1000,   // 5 minutes for regular users
    admin: 10 * 60 * 1000, // 10 minutes for admin/staff
    staff: 10 * 60 * 1000,
};

export const useAutoLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Function to update activity timestamp
        const updateActivity = () => {
            if (localStorage.getItem('sessionId')) {
                localStorage.setItem('lastActivity', Date.now().toString());
            }
        };

        // 2. Attach listeners for user activity
        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        // 3. Initialize the timestamp if it doesn't exist but we are logged in
        if (localStorage.getItem('sessionId') && !localStorage.getItem('lastActivity')) {
            updateActivity();
        }

        // 4. Set up an interval to check for inactivity
        const intervalId = setInterval(async () => {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) return;

            const lastActivity = localStorage.getItem('lastActivity');
            if (!lastActivity) return;

            const role = localStorage.getItem('sessionRole') || 'user';
            const limit = INACTIVITY_LIMITS[role] ?? INACTIVITY_LIMITS.user;
            const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);

            if (timeSinceLastActivity > limit) {
                console.log("Session expired due to inactivity. Logging out.");

                const currentUser = auth.currentUser;
                if (currentUser) {
                    try {
                        // Call the Cloud Function to clear the session in Firestore
                        const logoutSessionFn = httpsCallable(functions, 'logoutSession');
                        await logoutSessionFn({ sessionId });
                    } catch (error) {
                        console.warn("Cloud Function session cleanup failed (non-critical):", error.message);
                    }
                }

                localStorage.removeItem('sessionId');
                localStorage.removeItem('lastActivity');
                localStorage.removeItem('sessionRole');

                try {
                    await signOut(auth);
                } catch (err) {
                    console.error("Firebase signout error:", err);
                }

                toast.info("You've been logged out due to inactivity.");
                navigate("/");
            }
        }, 30000); // Check every 30 seconds

        // 5. Cleanup function
        return () => {
            events.forEach(event => window.removeEventListener(event, updateActivity));
            clearInterval(intervalId);
        };
    }, [navigate]);
};
