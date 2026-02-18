import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../component/adminstaff/Sidebar";
import { auth } from "../../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Added
  LineElement,  // Added
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler // Added for area chart effect
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2'; // Changed Bar to Line
import {
  FaBoxOpen,
  FaShippingFast,
  FaExclamationTriangle,
  FaClipboardList,
  FaCommentDots,
  FaComments,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // Register
  LineElement,  // Register
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register
);

const AdminDashboard = () => {
  // --- User State ---
  const [userRole, setUserRole] = useState(null);

  // --- Metrics State ---
  const [kpiData, setKpiData] = useState({
    totalPackages: 0,
    activePackages: 0,
    delayedPackages: 0,
    deliveredToday: 0,
    shipmentRequests: 0,
    messageRequests: 0,
    activeMessages: 0
  });

  // --- Chart & List State ---
  const [volumeFilter, setVolumeFilter] = useState('week');
  const [filterMode, setFilterMode] = useState('preset');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [shipmentVolumeData, setShipmentVolumeData] = useState({ labels: [], datasets: [] });
  const [statusDistributionData, setStatusDistributionData] = useState({ labels: [], datasets: [] });

  // Per Data Lists
  const [delayedShipments, setDelayedShipments] = useState([]);
  const [pendingShipmentRequests, setPendingShipmentRequests] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);

  // --- Helpers ---
  const getStartOfDay = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  // --- 1. Fetch User Role ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) setUserRole(userDoc.data().role);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. Main Data Listeners ---
  useEffect(() => {
    // --- A. PACKAGES ---
    const packagesRef = collection(db, "Packages");
    const unsubPackages = onSnapshot(packagesRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
     
      const startOfDay = getStartOfDay();
      let delayedCount = 0;
      let deliveredTodayCount = 0;
      let activeCount = 0;
      const statusCounts = {};

      docs.forEach(doc => {
        const status = (doc.packageStatus || "Unknown");
        const statusLower = status.toLowerCase();
       
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        if (!doc.canceled && statusLower !== 'delivered' && statusLower !== 'returned') {
          activeCount++;
        }

        if (statusLower === 'delivered') {
          const completionTime = doc.updatedTime ? doc.updatedTime.toDate() : null;
          if (completionTime && completionTime >= startOfDay) {
            deliveredTodayCount++;
          }
        }

        if (statusLower.includes('delayed') || statusLower.includes('exception') || statusLower.includes('hold')) {
          delayedCount++;
        }
      });

      setKpiData(prev => ({
        ...prev,
        totalPackages: docs.length,
        activePackages: activeCount,
        delayedPackages: delayedCount,
        deliveredToday: deliveredTodayCount
      }));

      setDelayedShipments(docs.filter(d => {
        const s = (d.packageStatus || "").toLowerCase();
        return s.includes('delayed') || s.includes('exception') || s.includes('hold');
      }));

      processChartData(docs, volumeFilter, fromDate, toDate);
      processStatusChart(statusCounts);
    });

    // --- B. SHIPMENT REQUESTS ---
    const reqRef = query(collection(db, "shipRequests"), orderBy("requestTime", "desc"));
    const unsubRequests = onSnapshot(reqRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const pending = docs.filter(r => (r.status || "").toLowerCase() !== 'accepted');
     
      setKpiData(prev => ({ ...prev, shipmentRequests: pending.length }));
      setPendingShipmentRequests(pending);
      setRecentBookings(docs.slice(0, 10));
    });

    // --- C. MESSAGES ---
    const convRef = collection(db, "conversations");
    const unsubConvos = onSnapshot(convRef, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
       
        const pending = docs.filter(c => c.status === 'pending' && c.request === 'sent');
        const active = docs.filter(c => c.status === 'approved');

        setPendingMessages(pending);
        setActiveMessages(active);

        setKpiData(prev => ({
            ...prev,
            messageRequests: pending.length,
            activeMessages: active.length
        }));
    });

    // --- D. ACTIVITY LOGS ---
    const updatesRef = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(6));
    const unsubUpdates = onSnapshot(updatesRef, (snapshot) => {
      const activityList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        const baseActivity = {
          id: doc.id,
          userName: data.userName || "Unknown",
          action: data.action || "",
          timestamp: data.timestamp,
          dateString: date ? date.toLocaleDateString("sv-SE") : null,
          formattedTimestamp: date ? date.toLocaleString() : "N/A",
        };

        // Remove any 20-character alphanumeric IDs (Firestore-style) from the displayed action
        const idPattern = /\b[A-Za-z0-9]{20}\b/g;
        baseActivity.displayedAction = baseActivity.action
          .replace(idPattern, '')
          .replace(/\s+/g, ' ')
          .trim();

        return baseActivity;
      });
      setRecentUpdates(activityList);
    });

    return () => {
      unsubPackages();
      unsubRequests();
      unsubConvos();
      unsubUpdates();
    };
  }, [volumeFilter, fromDate, toDate]);

  // --- Chart Processing (UPDATED) ---
  const processChartData = (docs, filter, from = null, to = null) => {
    const today = new Date();
    let startDate, endDate;
    let labels = [];

    if (filterMode === 'custom' && from && to) {
      startDate = new Date(from);
      endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = today;
      if (filter === 'week') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
      } else if (filter === 'month') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (filter === 'year') {
        startDate = new Date(today.getFullYear(), 0, 1);
      } else if (filter === 'last30') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
      } else if (filter === 'last90') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 89);
      }
    }

    if (!startDate || !endDate) return;

    const rangeDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    let granularity = 'day';
    if (rangeDays > 90) granularity = 'month';
    else if (rangeDays > 365) granularity = 'year';

    // Initialize counts structure for both Received and Delivered
    const counts = {};

    // Helper to populate labels and init counts
    const addKey = (key) => {
        labels.push(key);
        counts[key] = { received: 0, delivered: 0 };
    };

    if (granularity === 'day') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        addKey(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (granularity === 'month') {
      for (let m = startDate.getMonth(); m <= endDate.getMonth() || startDate.getFullYear() < endDate.getFullYear(); m++) {
        const year = startDate.getFullYear();
        addKey(new Date(year, m, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        if (m === 11) startDate.setFullYear(year + 1, 0, 1);
      }
    } else if (granularity === 'year') {
      for (let y = startDate.getFullYear(); y <= endDate.getFullYear(); y++) {
        addKey(y.toString());
      }
    }

    // Process Documents
    docs.forEach(doc => {
      // 1. Count Received (Created Time)
      const created = doc.createdTime ? doc.createdTime.toDate() : new Date();
      if (created >= startDate && created <= endDate) {
        let key = getKey(created, granularity);
        if (counts[key]) counts[key].received++;
      }

      // 2. Count Delivered (Updated Time + Status)
      if ((doc.packageStatus || '').toLowerCase() === 'delivered') {
          const updated = doc.updatedTime ? doc.updatedTime.toDate() : null;
          if (updated && updated >= startDate && updated <= endDate) {
              let key = getKey(updated, granularity);
              if (counts[key]) counts[key].delivered++;
          }
      }
    });

    setShipmentVolumeData({
      labels,
      datasets: [
        {
            label: 'Received',
            data: labels.map(l => counts[l].received),
            borderColor: '#3B82F6', // Blue
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
                gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
                return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 2
        },
        {
            label: 'Delivered',
            data: labels.map(l => counts[l].delivered),
            borderColor: '#10B981', // Emerald
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
                gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
                return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 2
        }
      ]
    });
  };

  // Helper for key generation in the chart loop
  const getKey = (date, granularity) => {
      if (granularity === 'day') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (granularity === 'month') return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return date.getFullYear().toString();
  };

  const processStatusChart = (counts) => {
    setStatusDistributionData({
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6366F1', '#8B5CF6'],
        borderWidth: 0,
      }]
    });
  };

  // --- 3. CONSOLIDATE "ATTENTION REQUIRED" LIST ---
  const getAttentionItems = () => {
    const items = [];

    // Priority 1: Message Requests
    pendingMessages.forEach(m => items.push({
      id: m.id, type: 'msg_req',
      title: `Message Request: ${m.userFullName || 'Guest'}`,
      sub: 'Waiting for agent approval',
      link: '/MessageRequest',
      icon: <FaCommentDots className="text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200'
    }));

    // Priority 2: Shipment Requests (Grouped)
    if (pendingShipmentRequests.length > 0) {
      const count = pendingShipmentRequests.length;
      items.push({
        id: 'shipment_requests_summary',
        type: 'ship_req_summary',
        title: count === 1 ? 'Shipment Request' : 'Shipment Requests',
        sub: `${count} new booking${count === 1 ? '' : 's'} pending approval`,
        link: '/ShipmentRequest',
        icon: <FaClipboardList className="text-amber-600" />,
        color: 'bg-amber-50 border-amber-200'
      });
    }

    // Priority 3: Delayed Shipments
    delayedShipments.forEach(s => items.push({
      id: s.id, type: 'delayed',
      title: `Delayed: ${s.packageNumber}`,
      sub: s.packageStatus,
      link: `/Shipments/${s.id}`,
      icon: <FaExclamationTriangle className="text-red-600" />,
      color: 'bg-red-50 border-red-200'
    }));

    // Priority 4: Active Messages
    activeMessages.forEach(m => items.push({
      id: m.id, type: 'active_chat',
      title: `Active Chat: ${m.userFullName}`,
      sub: 'Live conversation',
      link: '/AdminMessages',
      icon: <FaComments className="text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200'
    }));

    return items;
  };

  const attentionItems = getAttentionItems();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
     
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 oswald">DASHBOARD</h1>
          </div>
          <div className="text-right hidden md:block">
             <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-600">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
          </div>
        </div>

        {/* --- KPI CARDS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 lexend">
          <KpiCard
            title="Active Shipments" value={kpiData.activePackages}
            icon={<FaShippingFast className="text-blue-600 text-xl" />} color="bg-blue-50"
            link="/Shipments?view=active"
          />
          <KpiCard
            title="Pending Requests" value={kpiData.shipmentRequests}
            icon={<FaClipboardList className="text-amber-600 text-xl" />} color="bg-amber-50"
            link="/ShipmentRequest"
          />
          <KpiCard
            title="Active Chats" value={kpiData.activeMessages}
            icon={<FaComments className="text-emerald-600 text-xl" />} color="bg-emerald-50"
            link="/AdminMessages"
          />
          <KpiCard
            title="Message Requests" value={kpiData.messageRequests}
            icon={<FaCommentDots className="text-indigo-600 text-xl" />} color="bg-indigo-50"
            link="/MessageRequest"
          />
        </section>

        {/* --- CHARTS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 lexend">
          {/* Volume Chart - UPDATED to Line */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="font-bold text-slate-700">Shipping Volume</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500"
                >
                  <option value="preset">Preset</option>
                  <option value="custom">Custom Range</option>
                </select>
                {filterMode === 'preset' ? (
                  <select
                    value={volumeFilter}
                    onChange={(e) => setVolumeFilter(e.target.value)}
                    className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500"
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={fromDate || ''}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500 px-2 py-1"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="date"
                      value={toDate || ''}
                      onChange={(e) => setToDate(e.target.value)}
                      className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500 px-2 py-1"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="h-64 w-full">
              <Line
                data={shipmentVolumeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index', // Tooltip shows both Recieved and Delivered at once
                    intersect: false,
                  },
                  plugins: {
                    legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 6 } },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 10,
                        cornerRadius: 8,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { borderDash: [4, 4], color: 'rgba(148, 163, 184, 0.2)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Status Doughnut */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">

            <h3 className="font-bold text-slate-700 mb-4 lexend">Status Breakdown</h3>
            <div className="h-48 relative flex justify-center">
              <Doughnut
                data={statusDistributionData}
                options={{
                  responsive: true, maintainAspectRatio: false, cutout: '70%',
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-slate-800">{kpiData.totalPackages}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- OPERATIONAL LISTS --- */}
        <section className={`grid grid-cols-1 gap-6 ${userRole === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
         
          {/* 1. ACTION REQUIRED */}
          <div className="lexend bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Action Required
              </h3>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                {attentionItems.length}
              </span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2">
              {attentionItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FaCheckCircle className="text-4xl mb-3 text-emerald-100" />
                  <p>All clear! No urgent items.</p>
                </div>
              ) : (
                attentionItems.map((item, index) => (
                  <div key={`${item.type}-${item.id}-${index}`} className={`flex items-center justify-between p-3 rounded-lg border ${item.color} bg-opacity-30`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                      </div>
                    </div>
                    <Link to={item.link} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 flex items-center gap-1 shadow-sm">
                      View <FaArrowRight size={10} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. RECENT BOOKINGS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 lexend">
                <FaClipboardList className="text-blue-500" /> Recent Bookings
              </h3>
              <Link to="/ShipmentRequest" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
              {recentBookings.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">No recent bookings</p>
                 </div>
              ) : (
                <ul className="space-y-1">
                  {recentBookings.map(r => (
                    <li key={r.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-start">
                      <div>
                        <div className="font-medium text-slate-700 text-sm">{r.name || "Unknown Sender"}</div>
                        <div className="text-xs text-slate-400">{r.serviceType || "Standard"} • {formatDate(r.requestTime)}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        (r.status || "").toLowerCase() === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {r.status || "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 3. ACTIVITY LOG (ADMIN ONLY) */}
          {userRole === 'admin' && (
            <div className="lexend bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <FaBoxOpen className="text-slate-400" /> System Activity
                </h3>
              </div>
              <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                  {recentUpdates.map(u => (
                    <li key={u.id} className="p-3 text-xs border-l-2 border-slate-200 ml-2 hover:border-blue-500 transition-colors">
                      <p className="text-slate-600 mb-1">
                        <span className="font-semibold text-slate-800">
                          {u.userName}: {u.displayedAction ? u.displayedAction.toUpperCase() : "UPDATE"}
                        </span>
                      </p>
                      <p className="text-slate-400">{u.formattedTimestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
};

// --- Sub-Component ---
const KpiCard = ({ title, value, icon, color, link }) => (
  <Link to={link || "#"} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
  </Link>
);

export default AdminDashboard;