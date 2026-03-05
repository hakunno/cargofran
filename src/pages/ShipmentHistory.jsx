import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import { auth, db } from "../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const UserShipmentHistory = () => {
  const [entries, setEntries] = useState([]); // merged results from shipRequests + Packages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [infoHistory, setInfoHistory] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);
  const [userChatPackages, setUserChatPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be logged in to view your shipment history.");
        setEntries([]);
        setLoading(false);
        return;
      }

      const authEmail = user.email || "";
      const emailForFilter = authEmail.toLowerCase().trim();
      const uid = user.uid;

      try {
        // helper to safely query with fallback
        const safeQuery = async ({ collectionName, whereField, orderValue, orderField }) => {
          try {
            const q = query(
              collection(db, collectionName),
              where(whereField, "==", orderValue),
              orderBy(orderField, "desc")
            );
            const snap = await getDocs(q);
            return snap.docs.map((d) => ({ docId: d.id, collection: collectionName, ...d.data() }));
          } catch (err) {
            console.warn(`Query failed for ${collectionName} (maybe missing index). Falling back to client sort.`, err);
            // fallback: fetch using only 'where' clause (which relies on single-field index)
            try {
              const qFallback = query(
                collection(db, collectionName),
                where(whereField, "==", orderValue)
              );
              const snapFallback = await getDocs(qFallback);
              return snapFallback.docs.map((d) => ({ docId: d.id, collection: collectionName, ...d.data() }))
                .filter((doc) => {
                  const docEmail = (doc.email || "").toLowerCase().trim();
                  const docUid = doc.userUid || null;
                  return docEmail === emailForFilter || (uid && docUid === uid);
                });
            } catch (fallbackErr) {
              console.error(`Fallback query also failed for ${collectionName}: `, fallbackErr);
              return [];
            }
          }
        };

        const [packagesDocs, requestsDocs] = await Promise.all([
          safeQuery({ collectionName: "Packages", whereField: "email", orderValue: authEmail, orderField: "createdTime" }),
          safeQuery({ collectionName: "shipRequests", whereField: "email", orderValue: authEmail, orderField: "createdAt" }),
        ]);

        const normalizeTimestamp = (doc) => {
          // prefer server timestamps: createdTime / createdAt, then requestTime, then dateStarted
          const t = doc.createdTime || doc.createdAt || doc.requestTime || doc.dateStarted || null;
          if (!t) return 0;
          if (typeof t.toDate === "function") {
            return t.toDate().getTime();
          }
          const parsed = new Date(t).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };

        let merged = [...packagesDocs, ...requestsDocs].map((d) => ({
          ...d,
          _ts: normalizeTimestamp(d),
        }));

        // Filter out any invalid (null/undefined) entries
        merged = merged.filter(d => d && d.collection);

        // sort by timestamp descending (latest first)
        merged.sort((a, b) => b._ts - a._ts);

        setEntries(merged);

        // Fetch user's shipment conversations to see which packages have active chats
        if (uid) {
          const chatQuery = query(
            collection(db, "shipment_conversations"),
            where("userId", "==", uid)
          );
          const chatSnap = await getDocs(chatQuery);
          const packagesWithChats = chatSnap.docs.map(doc => doc.data().packageNumber);
          setUserChatPackages(packagesWithChats);
        }

      } catch (err) {
        console.error("Error loading history:", err);
        setError("Failed to load shipments. Please try again later.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // open modal for packages (view statusHistory) or show request details
  const openInfoModal = async (entry) => {
    setCurrentEntry(entry);
    setInfoLoading(true);
    setInfoHistory([]);
    setInfoModal(true);

    if (entry.collection === "Packages") {
      try {
        const q = query(collection(db, "Packages", entry.docId, "statusHistory"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        setInfoHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching package history:", err);
        setInfoHistory([]);
      } finally {
        setInfoLoading(false);
      }
    } else {
      // shipRequests may not have statusHistory - just show request info
      setInfoHistory([]);
      setInfoLoading(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    if (typeof ts.toDate === "function") {
      return ts.toDate().toLocaleString();
    }
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch (e) { }
    return String(ts);
  };

  const getAcceptanceStatus = (e) => {
    if (!e || !e.collection) return "Unknown";
    if (e.collection === "Packages") return "Accepted";
    if (e.status === "Processing" || !e.status) return "Pending";
    if (e.status === "Rejected") return "Rejected";
    if (e.status === "Accepted") return "Accepted"; // in case kept
    return "Unknown";
  };

  const getPackageNumber = (e) => {
    if (!e) return "N/A";
    const acceptance = getAcceptanceStatus(e);
    if (acceptance === "Accepted") return e.packageNumber || "N/A";
    return "N/A";
  };

  if (loading) return <div className="p-4 text-center">Loading your shipment history...</div>;
  if (error) return <div className="p-4 text-center text-danger">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <h2 className="text-center mb-4">Your Shipment & Request History</h2>

        {entries.length === 0 ? (
          <p className="text-center">No shipments or requests found for your account.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded-lg">
            <Table className="min-w-full divide-y divide-gray-200 mb-0">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Acceptance Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Package Number</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">From</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Destination</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((e) => (
                  <tr key={`${e.collection}-${e.docId}`} className="text-center">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{getAcceptanceStatus(e)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{getPackageNumber(e)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{e.senderCountry || "N/A"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{e.destinationCountry || "N/A"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{e.packageStatus || e.status || "N/A"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{e.email || "N/A"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(e.createdTime || e.createdAt || e.requestTime || e.dateStarted)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="info" onClick={() => openInfoModal(e)}>
                          View
                        </Button>
                        {getAcceptanceStatus(e) === "Accepted" && userChatPackages.includes(getPackageNumber(e)) && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate('/ShipmentMessages', { state: { packageNumber: getPackageNumber(e) } })}
                          >
                            Message
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={infoModal} onHide={() => { setInfoModal(false); setCurrentEntry(null); setInfoHistory([]); }} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentEntry ? `Shipment Number: ${getPackageNumber(currentEntry)}` : "Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {infoLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {currentEntry && (
                  <div className="mb-3">
                    <strong>Email:</strong> {currentEntry.email || "N/A"} <br />
                    <strong>Status:</strong> {getAcceptanceStatus(currentEntry)} <br />
                    <strong>Created:</strong> {formatTimestamp(currentEntry.createdTime || currentEntry.createdAt || currentEntry.requestTime)} <br />
                  </div>
                )}

                {currentEntry && currentEntry.collection === "Packages" ? (
                  <>
                    <h6>Status History</h6>
                    {infoHistory.length === 0 ? <p>No status history available.</p> : (
                      <div className="overflow-x-auto overflow-y-auto max-h-[40vh] border rounded-lg">
                        <Table size="sm" className="min-w-full divide-y divide-gray-200 mb-0">
                          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm"><tr><th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"></th><th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th><th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Timestamp</th></tr></thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {infoHistory.map((h, idx) => (
                              <tr key={h.id || idx}>
                                <td className="px-3 py-2 text-sm text-gray-900">{infoHistory.length - idx}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{h.status}</td>
                                <td className="px-3 py-2 text-sm text-gray-900">{formatTimestamp(h.timestamp)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <h6>Request Details</h6>
                    {getAcceptanceStatus(currentEntry) === "Pending" ? (
                      <p>Request is pending processing.</p>
                    ) : getAcceptanceStatus(currentEntry) === "Rejected" ? (
                      <>
                        <p>This request was rejected.</p>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(currentEntry, null, 2)}</pre>
                      </>
                    ) : (
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(currentEntry, null, 2)}</pre>
                    )}
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setInfoModal(false); setCurrentEntry(null); setInfoHistory([]); }}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserShipmentHistory;
