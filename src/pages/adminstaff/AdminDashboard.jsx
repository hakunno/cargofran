import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../component/adminstaff/Sidebar";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [totalShipments, setTotalShipments] = useState(0);
  const [activeShipments, setActiveShipments] = useState(0);
  const [recentShipments, setRecentShipments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [allUpdates, setAllUpdates] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);

  const [pendingConvosCount, setPendingConvosCount] = useState(0);
  const [approvedConvosCount, setApprovedConvosCount] = useState(0);
  const [recentPendingConvos, setRecentPendingConvos] = useState([]);

  const prevDocsRef = useRef(new Map());
  const initializedRef = useRef(false);
  const prevReqsRef = useRef(new Map());
  const initializedReqRef = useRef(false);
  const prevConvosRef = useRef(new Map());
  const initializedConvosRef = useRef(false);

  const serializeDoc = (doc) => {
    const copy = {};
    for (const [key, value] of Object.entries(doc)) {
      if (value && typeof value === 'object' && typeof value.toDate === 'function') {
        copy[key] = value.toDate().toISOString();
      } else if (Array.isArray(value)) {
        copy[key] = value.map(v =>
          v && typeof v === 'object' && typeof v.toDate === 'function' ? v.toDate().toISOString() :
          typeof v === 'object' && v !== null ? serializeDoc(v) : v
        );
      } else if (typeof value === 'object' && value !== null) {
        copy[key] = serializeDoc(value);
      } else {
        copy[key] = value;
      }
    }
    return JSON.stringify(copy);
  };

  const getDocTime = (data, type) => {
    let ts;
    if (type === "added") {
      ts = data.createdTime || data.dateStarted || data.requestTime || data.createdAt;
    } else {
      ts = data.updatedTime || data.createdTime || data.dateStarted || data.requestTime || data.createdAt;
    }
    if (!ts) return new Date();
    if (ts.toDate) return ts.toDate();
    return new Date(ts);
  };

  // Log update to Firestore
  const logUpdate = async (type, details, source) => {
    try {
      await addDoc(collection(db, "recentUpdates"), {
        type,
        details,
        source,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error logging update:", error);
    }
  };

  useEffect(() => {
    // Fetch recent updates (latest 5)
    const recentQ = query(
      collection(db, "recentUpdates"),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const unsubRecent = onSnapshot(recentQ, (snap) => {
      setRecentUpdates(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          time: data.timestamp ? data.timestamp.toDate() : new Date()  // Add time as Date for consistency
        };
      }));
    }, (error) => {
      console.error("Error in recentUpdates snapshot:", error);
    });

    // Fetch all updates
    const allQ = query(
      collection(db, "recentUpdates"),
      orderBy("timestamp", "desc")
    );
    const unsubAll = onSnapshot(allQ, (snap) => {
      setAllUpdates(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          time: data.timestamp ? data.timestamp.toDate() : new Date()  // Add time as Date for consistency
        };
      }));
    }, (error) => {
      console.error("Error in allUpdates snapshot:", error);
    });

    return () => {
      unsubRecent();
      unsubAll();
    };
  }, []);

  useEffect(() => {
    // Packages: total count + active (status not Delivered / not canceled) + recent 3
    const packagesRef = collection(db, "Packages");

    const unsubAll = onSnapshot(packagesRef, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTotalShipments(docs.length);

      const active = docs.filter(
        (p) => !p.canceled && (p.packageStatus || "").toLowerCase() !== "delivered"
      );
      setActiveShipments(active.length);

      const counts = docs.reduce((acc, p) => {
        const status = (p.packageStatus || "unknown").toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setStatusCounts(counts);

      // Change detection for recent updates
      const currentMap = new Map(docs.map((d) => [d.id, d]));
      if (initializedRef.current) {
        const prevMap = prevDocsRef.current;
        // const updates = []; // Removed local updates to avoid inconsistency; rely on Firestore listener
        // Check for new and modified
        docs.forEach((doc) => {
          const prevDoc = prevMap.get(doc.id);
          if (!prevDoc) {
            // New shipment
            logUpdate("new_shipment", {
              packageNumber: doc.packageNumber || `#${doc.id.slice(-6)}`,
              shipperName: doc.shipperName || "Unknown",
            }, "package");
            // updates.push({ id: doc.id, type: "added", data: doc, time: getDocTime(doc, "added"), source: "package" });
          } else if (serializeDoc(prevDoc) !== serializeDoc(doc)) {
            // Edited shipment
            const changes = {};
            Object.keys(doc).forEach(key => {
              if (serializeDoc(prevDoc[key]) !== serializeDoc(doc[key])) {
                changes[key] = { old: prevDoc[key], new: doc[key] };
              }
            });
            logUpdate("shipment_edited", {
              packageNumber: doc.packageNumber || `#${doc.id.slice(-6)}`,
              changes,
            }, "package");
            // updates.push({ id: doc.id, type: "edited", data: doc, time: getDocTime(doc, "edited"), source: "package" });
          }
        });
        // if (updates.length > 0) {
        //   setRecentUpdates((prev) => [...updates, ...prev].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5));
        // }
      } else {
        initializedRef.current = true;
      }
      prevDocsRef.current = currentMap;
    }, (error) => {
      console.error("Error in packages snapshot:", error);
    });

    // recent shipments (ordered by createdTime desc) - separate listener for ordered query
    const recentQ = query(packagesRef, orderBy("createdTime", "desc"), limit(3));
    const unsubRecent = onSnapshot(recentQ, (snap) => {
      setRecentShipments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Error in recent shipments snapshot:", error);
    });

    return () => {
      unsubAll();
      unsubRecent();
    };
  }, []);

  useEffect(() => {
    // Shipment requests (collection name: shipRequests in your code)
    const reqRef = collection(db, "shipRequests");

    // Count pending requests (status !== 'Accepted' or missing -> show as pending)
    const unsubReqAll = onSnapshot(reqRef, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const pending = docs.filter((r) => (r.status || "").toLowerCase() !== "accepted");
      setPendingRequestsCount(pending.length);

      // Change detection for recent updates
      const currentMap = new Map(docs.map((d) => [d.id, d]));
      if (initializedReqRef.current) {
        const prevMap = prevReqsRef.current;
        // const updates = []; // Removed local updates to avoid inconsistency; rely on Firestore listener
        // Check for new and modified
        docs.forEach((doc) => {
          const prevDoc = prevMap.get(doc.id);
          if (!prevDoc) {
            // New request
            logUpdate("new_request", {
              name: doc.name || "Unknown",
              email: doc.email || "Unknown",
            }, "request");
            // updates.push({ id: doc.id, type: "added", data: doc, time: getDocTime(doc, "added"), source: "request" });
          } else if (serializeDoc(prevDoc) !== serializeDoc(doc)) {
            const prevStatus = prevDoc.status || "";
            const newStatus = doc.status || "";
            if (newStatus.toLowerCase() === "accepted" && prevStatus.toLowerCase() !== "accepted") {
              // Request accepted
              logUpdate("request_accepted", {
                name: doc.name || "Unknown",
                packageNumber: doc.packageNumber || "N/A",
              }, "request");
            } else if (newStatus.toLowerCase() === "rejected" && prevStatus.toLowerCase() !== "rejected") {
              // Request rejected
              logUpdate("request_rejected", {
                name: doc.name || "Unknown",
              }, "request");
            }
            // updates.push({ id: doc.id, type: "edited", data: doc, time: getDocTime(doc, "edited"), source: "request" });
          }
        });
        // if (updates.length > 0) {
        //   setRecentUpdates((prev) => [...updates, ...prev].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5));
        // }
      } else {
        initializedReqRef.current = true;
      }
      prevReqsRef.current = currentMap;
    }, (error) => {
      console.error("Error in shipRequests snapshot:", error);
    });

    // recent requests - order by requestTime if it exists, fallback to document order
    const recentReqQ = query(reqRef, orderBy("requestTime", "desc"), limit(3));
    const unsubRecentReq = onSnapshot(recentReqQ, (snap) => {
      setRecentRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Error in recent requests snapshot:", error);
    });

    return () => {
      unsubReqAll();
      unsubRecentReq();
    };
  }, []);

  useEffect(() => {
    // Conversations: pending (request sent & status pending) and approved counts
    const convRef = collection(db, "conversations");

    const qPending = query(convRef, where("status", "==", "pending"), where("request", "==", "sent"), orderBy("createdAt", "desc"));
    const unsubPending = onSnapshot(qPending, (snap) => {
      setPendingConvosCount(snap.docs.length);
      setRecentPendingConvos(snap.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Error in pending conversations snapshot:", error);
    });

    const qApproved = query(convRef, where("status", "==", "approved"));
    const unsubApproved = onSnapshot(qApproved, (snap) => {
      setApprovedConvosCount(snap.docs.length);
    }, (error) => {
      console.error("Error in approved conversations snapshot:", error);
    });

    // Separate listener for change detection on all conversations
    const unsubConvAll = onSnapshot(convRef, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const currentMap = new Map(docs.map((d) => [d.id, d]));
      if (initializedConvosRef.current) {
        const prevMap = prevConvosRef.current;
        // const updates = []; // Removed local updates to avoid inconsistency; rely on Firestore listener
        // Check for new and modified
        docs.forEach((doc) => {
          const prevDoc = prevMap.get(doc.id);
          if (!prevDoc) {
            // New convo request
            logUpdate("new_convo_request", {
              user: doc.userFullName || doc.userEmail || "Unknown",
            }, "conversation");
            // updates.push({ id: doc.id, type: "added", data: doc, time: getDocTime(doc, "added"), source: "conversation" });
          } else if (serializeDoc(prevDoc) !== serializeDoc(doc)) {
            const prevStatus = prevDoc.status || "";
            const newStatus = doc.status || "";
            if (newStatus === "approved" && prevStatus !== "approved") {
              // Convo approved
              logUpdate("convo_approved", {
                user: doc.userFullName || doc.userEmail || "Unknown",
              }, "conversation");
            } else if (newStatus === "rejected" && prevStatus !== "rejected") {
              // Convo rejected
              logUpdate("convo_rejected", {
                user: doc.userFullName || doc.userEmail || "Unknown",
              }, "conversation");
            }
            // updates.push({ id: doc.id, type: "edited", data: doc, time: getDocTime(doc, "edited"), source: "conversation" });
          }
        });
        // if (updates.length > 0) {
        //   setRecentUpdates((prev) => [...updates, ...prev].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5));
        // }
      } else {
        initializedConvosRef.current = true;
      }
      prevConvosRef.current = currentMap;
    }, (error) => {
      console.error("Error in conversations snapshot:", error);
    });

    return () => {
      unsubPending();
      unsubApproved();
      unsubConvAll();
    };
  }, []);

  // Chart data for bar graph
  const chartData = {
    labels: Object.keys(statusCounts).map(status => status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')),
    datasets: [
      {
        label: 'Shipments',
        data: Object.values(statusCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Package Status Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Helpers
  const shortText = (s, n = 40) => (s ? (s.length > n ? s.slice(0, n) + "..." : s) : "—");
  const formatDate = (tsOrIso) => {
    if (!tsOrIso) return "N/A";
    try {
      if (tsOrIso instanceof Date) return tsOrIso.toLocaleString();
      // Firestore Timestamp
      if (tsOrIso.toDate) return tsOrIso.toDate().toLocaleString();
      // ISO string
      const d = new Date(tsOrIso);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch (e) {}
    return String(tsOrIso);
  };

  const formatUpdateText = (update) => {
    const time = formatDate(update.time || update.timestamp);
    let text = "";
    switch (update.type) {
      case "new_shipment":
        text = `New shipment ${update.details.packageNumber} added by ${update.details.shipperName}`;
        break;
      case "shipment_edited":
        text = `Shipment ${update.details.packageNumber} edited (changes: ${JSON.stringify(update.details.changes)})`;
        break;
      case "new_request":
        text = `New shipment request from ${update.details.name}`;
        break;
      case "request_accepted":
        text = `Shipment request from ${update.details.name} accepted (Package: ${update.details.packageNumber})`;
        break;
      case "request_rejected":
        text = `Shipment request from ${update.details.name} rejected`;
        break;
      case "new_convo_request":
        text = `New conversation request from ${update.details.user}`;
        break;
      case "convo_approved":
        text = `Conversation with ${update.details.user} approved`;
        break;
      case "convo_rejected":
        text = `Conversation with ${update.details.user} rejected`;
        break;
      default:
        text = "Update logged";
    }
    return `${text} at ${time}`;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Top summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Total Shipments" value={totalShipments} link="/Shipments" />
          <SummaryCard title="Active Shipments" value={activeShipments} link="/Shipments?view=active" />
          <SummaryCard title="Shipment Requests" value={pendingRequestsCount} link="/ShipmentRequest" />
          <SummaryCard title="Active Conversations" value={approvedConvosCount} link="/AdminMessages" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Shipments */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Recent Shipments</h2>
              <Link to="/Shipments" className="text-sm text-blue-600">View all</Link>
            </div>

            {recentShipments.length === 0 ? (
              <p className="text-sm text-gray-500">No shipments yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {recentShipments.map((s) => (
                  <li key={s.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{s.packageNumber || `#${s.customId || s.id}`}</div>
                        <div className="text-gray-500">{s.shipperName || "—"}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{s.packageStatus || "—"}</div>
                        <div>{formatDate(s.createdTime || s.dateStarted)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Recent Shipment Requests</h2>
              <Link to="/ShipmentRequest" className="text-sm text-blue-600">View all</Link>
            </div>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No requests found.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {recentRequests.map((r) => (
                  <li key={r.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{r.name || r.email || `Request ${r.id}`}</div>
                        <div className="text-gray-500">{r.serviceType || "—"}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{r.status || "Pending"}</div>
                        <div>{formatDate(r.requestTime)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pending Conversations */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Pending Conversations</h2>
              <Link to="/MessageRequest" className="text-sm text-blue-600">Manage</Link>
            </div>

            {recentPendingConvos.length === 0 ? (
              <p className="text-sm text-gray-500">No pending conversations.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {recentPendingConvos.map((c) => (
                  <li key={c.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{c.userFullName || c.userEmail || `User ${c.id}`}</div>
                        <div className="text-gray-500">{shortText(c.message || c.intro || "")}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">{formatDate(c.createdAt)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer area for updates and graph */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Recent Updates</h3>
              <button 
                onClick={() => setShowAllModal(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>
            {recentUpdates.length === 0 ? (
              <p className="text-sm text-gray-500">No recent updates.</p>
            ) : (
              <ul className="space-y-2">
                {recentUpdates.map((u) => (
                  <li key={u.id} className="text-sm border-b pb-2 last:border-b-0">
                    <div className="font-medium text-gray-900">{formatUpdateText(u)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Package Status Distribution</h3>
            {totalShipments === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div style={{ height: '300px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        </section>

        {/* Modal for All Updates */}
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">All Updates</h3>
              {allUpdates.length === 0 ? (
                <p>No updates available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border border-gray-300">Type</th>
                        <th className="p-2 border border-gray-300">Details</th>
                        <th className="p-2 border border-gray-300">Source</th>
                        <th className="p-2 border border-gray-300">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUpdates.map((u) => (
                        <tr key={u.id}>
                          <td className="p-2 border border-gray-300">{u.type}</td>
                          <td className="p-2 border border-gray-300">{JSON.stringify(u.details)}</td>
                          <td className="p-2 border border-gray-300">{u.source}</td>
                          <td className="p-2 border border-gray-300">{formatDate(u.time || u.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => setShowAllModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SummaryCard = ({ title, value, link }) => {
  return (
    <Link to={link} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </Link>
  );
};

export default AdminDashboard;