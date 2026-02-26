import { useState, useEffect } from 'react';
import { db, auth } from '../jsfile/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    updateDoc,
    doc
} from 'firebase/firestore';

export const useUserNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let unsubscribe = () => { };

        const setupListener = (user) => {
            if (!user) {
                setNotifications([]);
                setUnreadCount(0);
                return;
            }

            const q = query(
                collection(db, 'userNotifications'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const notifs = snapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));

                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.read).length);
            }, (error) => {
                console.error("Error fetching user notifications: ", error);
                // Fallback for missing composite indexes typically
                if (error.code === 'failed-precondition') {
                    console.warn("Missing index for userNotifications. Falling back to simple query.");
                    const fallbackQ = query(
                        collection(db, 'userNotifications'),
                        where('userId', '==', user.uid)
                    );
                    unsubscribe = onSnapshot(fallbackQ, (fallbackSnap) => {
                        const fallbackNotifs = fallbackSnap.docs.map(docSnap => ({
                            id: docSnap.id,
                            ...docSnap.data()
                        }));

                        // Sort client side
                        fallbackNotifs.sort((a, b) => {
                            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                            return timeB - timeA;
                        });

                        setNotifications(fallbackNotifs);
                        setUnreadCount(fallbackNotifs.filter(n => !n.read).length);
                    });
                }
            });
        };

        const authUnsub = auth.onAuthStateChanged((user) => {
            setupListener(user);
        });

        return () => {
            authUnsub();
            unsubscribe();
        };
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await updateDoc(doc(db, 'userNotifications', notificationId), {
                read: true,
                readAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const activeUnread = notifications.filter(n => !n.read);
            await Promise.all(activeUnread.map(n =>
                updateDoc(doc(db, 'userNotifications', n.id), {
                    read: true,
                    readAt: new Date().toISOString()
                })
            ));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return { notifications, unreadCount, markAsRead, markAllAsRead };
};
