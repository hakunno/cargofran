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
  getDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../../jsfile/firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  FaBoxOpen,
  FaShippingFast,
  FaClipboardList,
  FaCommentDots,
  FaComments,
  FaCheckCircle,
  FaArrowRight,
  FaTruck,
  FaUsers,
  FaExclamationTriangle,
  FaBox,
  FaGlobe,
  FaRegClock
} from "react-icons/fa";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const AdminDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [kpiData, setKpiData] = useState({
    totalPackages: 0, activePackages: 0, delayedPackages: 0,
    deliveredToday: 0, deliveredTotal: 0, shipmentRequests: 0,
    acceptedRequests: 0, messageRequests: 0, activeMessages: 0, totalUsers: 0
  });

  const [volumeFilter, setVolumeFilter] = useState('week');
  const [filterMode, setFilterMode] = useState('preset');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [shipmentVolumeData, setShipmentVolumeData] = useState({ labels: [], datasets: [] });
  const [statusDistributionData, setStatusDistributionData] = useState({ labels: [], datasets: [] });
  const [topDestinations, setTopDestinations] = useState([]);
  const [transportModes, setTransportModes] = useState([]);

  const [delayedShipments, setDelayedShipments] = useState([]);
  const [pendingShipmentRequests, setPendingShipmentRequests] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [allPackages, setAllPackages] = useState([]);

  // Derived filtered status counts for date-range-aware doughnut
  const [filteredStatusCounts, setFilteredStatusCounts] = useState({});

  const getStartOfDay = () => { const now = new Date(); now.setHours(0, 0, 0, 0); return now; };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- 1. Fetch User Role & Total Users ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            setUserRole(role);
            if (role === 'admin') {
              const usersSnap = await getDocs(collection(db, "Users"));
              setKpiData(prev => ({ ...prev, totalUsers: usersSnap.size }));
            }
          }
        } catch (error) { console.error("Error fetching role:", error); }
      } else { setUserRole(null); }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. Main Data Listeners ---
  useEffect(() => {
    // A. PACKAGES
    const packagesRef = collection(db, "Packages");
    const unsubPackages = onSnapshot(packagesRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllPackages(docs);

      const startOfDay = getStartOfDay();
      let delayedCount = 0, deliveredTodayCount = 0, activeCount = 0, deliveredTotal = 0;
      const statusCounts = {};
      const destCounts = {};
      const modeCounts = {};

      docs.forEach(p => {
        const status = (p.packageStatus || "Unknown");
        const statusLower = status.toLowerCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        // Destinations
        const dest = p.destinationCountry || "Unknown";
        destCounts[dest] = (destCounts[dest] || 0) + 1;

        // Transport modes
        const mode = p.transportMode || "Unknown";
        modeCounts[mode] = (modeCounts[mode] || 0) + 1;

        if (!p.canceled && statusLower !== 'delivered' && statusLower !== 'returned') activeCount++;
        if (statusLower === 'delivered') {
          deliveredTotal++;
          const completionTime = p.updatedTime ? p.updatedTime.toDate() : null;
          if (completionTime && completionTime >= startOfDay) deliveredTodayCount++;
        }
        if (statusLower.includes('delayed') || statusLower.includes('exception') || statusLower.includes('hold')) delayedCount++;
      });

      setKpiData(prev => ({ ...prev, totalPackages: docs.length, activePackages: activeCount, delayedPackages: delayedCount, deliveredToday: deliveredTodayCount, deliveredTotal }));
      setDelayedShipments(docs.filter(d => { const s = (d.packageStatus || "").toLowerCase(); return s.includes('delayed') || s.includes('exception') || s.includes('hold'); }));

      // Top 5 destinations
      const sortedDest = Object.entries(destCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setTopDestinations(sortedDest);

      // Transport modes
      const sortedModes = Object.entries(modeCounts).sort((a, b) => b[1] - a[1]);
      setTransportModes(sortedModes);

      processChartData(docs, volumeFilter, fromDate, toDate);
      processStatusChart(statusCounts, docs, volumeFilter, fromDate, toDate);
    });

    // B. SHIPMENT REQUESTS
    const reqRef = query(collection(db, "shipRequests"), orderBy("requestTime", "desc"));
    const unsubRequests = onSnapshot(reqRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const pending = docs.filter(r => (r.status || "").toLowerCase() !== 'accepted');
      const accepted = docs.filter(r => (r.status || "").toLowerCase() === 'accepted');
      setKpiData(prev => ({ ...prev, shipmentRequests: pending.length, acceptedRequests: accepted.length }));
      setPendingShipmentRequests(pending);
      setRecentBookings(docs.slice(0, 15));
    });

    // C. MESSAGES/CONVERSATIONS
    const convRef = collection(db, "conversations");
    const unsubConvos = onSnapshot(convRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const pending = docs.filter(c => c.status === 'pending' && c.request === 'sent');
      const active = docs.filter(c => c.status === 'approved');
      setPendingMessages(pending);
      setActiveMessages(active);
      setKpiData(prev => ({ ...prev, messageRequests: pending.length, activeMessages: active.length }));
    });

    // D. ACTIVITY LOGS
    const updatesRef = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(10));
    const unsubUpdates = onSnapshot(updatesRef, (snapshot) => {
      const activityList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        const baseActivity = {
          id: doc.id, userName: data.userName || "Unknown", action: data.action || "",
          timestamp: data.timestamp, dateString: date ? date.toLocaleDateString("sv-SE") : null,
          formattedTimestamp: date ? date.toLocaleString() : "N/A",
        };
        const idPattern = /\b[A-Za-z0-9]{20}\b/g;
        baseActivity.displayedAction = baseActivity.action.replace(idPattern, '').replace(/\s+/g, ' ').trim();
        return baseActivity;
      });
      setRecentUpdates(activityList);
    });

    return () => { unsubPackages(); unsubRequests(); unsubConvos(); unsubUpdates(); };
  }, [volumeFilter, fromDate, toDate]);

  // --- Chart Processing ---
  const getDateRange = (filter, from, to) => {
    const today = new Date();
    let startDate, endDate = today;
    if (filterMode === 'custom' && from && to) {
      startDate = new Date(from); endDate = new Date(to); endDate.setHours(23, 59, 59, 999);
    } else {
      if (filter === 'week') { startDate = new Date(today); startDate.setDate(today.getDate() - 6); }
      else if (filter === 'month') { startDate = new Date(today.getFullYear(), today.getMonth(), 1); }
      else if (filter === 'year') { startDate = new Date(today.getFullYear(), 0, 1); }
      else if (filter === 'last30') { startDate = new Date(today); startDate.setDate(today.getDate() - 29); }
      else if (filter === 'last90') { startDate = new Date(today); startDate.setDate(today.getDate() - 89); }
    }
    return { startDate, endDate };
  };

  const processChartData = (docs, filter, from = null, to = null) => {
    const { startDate, endDate } = getDateRange(filter, from, to);
    if (!startDate || !endDate) return;

    const rangeDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    let granularity = rangeDays > 90 ? 'month' : 'day';
    const labels = [], counts = {};

    const addKey = (key) => { labels.push(key); counts[key] = { received: 0, delivered: 0 }; };
    const getKey = (date) => {
      if (granularity === 'day') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (granularity === 'day') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) addKey(getKey(new Date(d)));
    } else {
      const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cur <= endDate) { addKey(getKey(new Date(cur))); cur.setMonth(cur.getMonth() + 1); }
    }

    docs.forEach(p => {
      const created = p.createdTime ? p.createdTime.toDate() : null;
      if (created && created >= startDate && created <= endDate) { const k = getKey(created); if (counts[k]) counts[k].received++; }
      if ((p.packageStatus || '').toLowerCase() === 'delivered') {
        const updated = p.updatedTime ? p.updatedTime.toDate() : null;
        if (updated && updated >= startDate && updated <= endDate) { const k = getKey(updated); if (counts[k]) counts[k].delivered++; }
      }
    });

    setShipmentVolumeData({
      labels,
      datasets: [
        { label: 'Received', data: labels.map(l => counts[l].received), borderColor: '#3B82F6', backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, "rgba(59,130,246,0.4)"); g.addColorStop(1, "rgba(59,130,246,0)"); return g; }, fill: true, tension: 0.4, pointRadius: 2 },
        { label: 'Delivered', data: labels.map(l => counts[l].delivered), borderColor: '#10B981', backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, "rgba(16,185,129,0.4)"); g.addColorStop(1, "rgba(16,185,129,0)"); return g; }, fill: true, tension: 0.4, pointRadius: 2 },
      ]
    });
  };

  const processStatusChart = (allStatusCounts, docs, filter, from, to) => {
    const { startDate, endDate } = getDateRange(filter, from, to);
    let counts = allStatusCounts;

    if (startDate && endDate) {
      counts = {};
      docs.forEach(p => {
        const created = p.createdTime ? p.createdTime.toDate() : null;
        if (created && created >= startDate && created <= endDate) {
          const status = p.packageStatus || "Unknown";
          counts[status] = (counts[status] || 0) + 1;
        }
      });
    }
    setFilteredStatusCounts(counts);
    setStatusDistributionData({
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6366F1', '#8B5CF6', '#06B6D4'], borderWidth: 0 }]
    });
  };

  const getAttentionItems = () => {
    const items = [];
    pendingMessages.forEach(m => items.push({ id: m.id, type: 'msg_req', title: `Message Request: ${m.userFullName || 'Guest'}`, sub: 'Waiting for agent approval', link: '/MessageRequest', icon: <FaCommentDots className="text-indigo-600" />, color: 'bg-indigo-50 border-indigo-200' }));
    if (pendingShipmentRequests.length > 0) { const count = pendingShipmentRequests.length; items.push({ id: 'shipment_requests_summary', type: 'ship_req_summary', title: count === 1 ? 'Shipment Request' : 'Shipment Requests', sub: `${count} new booking${count === 1 ? '' : 's'} pending approval`, link: '/ShipmentRequest', icon: <FaClipboardList className="text-amber-600" />, color: 'bg-amber-50 border-amber-200' }); }
    delayedShipments.forEach(s => items.push({ id: s.id, type: 'delayed', title: `Delayed: ${s.packageNumber}`, sub: s.packageStatus, link: `/Shipments/${s.id}`, icon: <FaExclamationTriangle className="text-red-600" />, color: 'bg-red-50 border-red-200' }));
    activeMessages.forEach(m => items.push({ id: m.id, type: 'active_chat', title: `Active Chat: ${m.userFullName}`, sub: 'Live conversation', link: '/AdminMessages', icon: <FaComments className="text-emerald-600" />, color: 'bg-emerald-50 border-emerald-200' }));
    return items;
  };

  const attentionItems = getAttentionItems();
  const totalFilteredStatus = Object.values(filteredStatusCounts).reduce((a, b) => a + b, 0);

  // Transport mode chart data
  const transportChartData = {
    labels: transportModes.map(([m]) => m),
    datasets: [{ data: transportModes.map(([, c]) => c), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'], borderWidth: 0 }]
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 md:ml-64">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 oswald">DASHBOARD</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time operational overview</p>
          </div>
          <div className="text-right hidden md:block">
            <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* --- KPI CARDS ROW 1 --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 lexend">
          <KpiCard title="Total Packages" value={kpiData.totalPackages} icon={<FaBox className="text-slate-600 text-xl" />} color="bg-slate-100" link="/Shipments" />
          <KpiCard title="Active Shipments" value={kpiData.activePackages} icon={<FaShippingFast className="text-blue-600 text-xl" />} color="bg-blue-50" link="/Shipments?view=active" />
          <KpiCard title="Delivered Today" value={kpiData.deliveredToday} icon={<FaCheckCircle className="text-emerald-600 text-xl" />} color="bg-emerald-50" link="/Shipments" />
          <KpiCard title="Delayed / Exception" value={kpiData.delayedPackages} icon={<FaExclamationTriangle className="text-red-600 text-xl" />} color="bg-red-50" link="/Shipments" />
        </section>

        {/* --- KPI CARDS ROW 2 --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 lexend">
          <KpiCard title="Pending Requests" value={kpiData.shipmentRequests} icon={<FaClipboardList className="text-amber-600 text-xl" />} color="bg-amber-50" link="/ShipmentRequest" />
          <KpiCard title="Accepted Requests" value={kpiData.acceptedRequests} icon={<FaTruck className="text-teal-600 text-xl" />} color="bg-teal-50" link="/ShipmentRequest" />
          <KpiCard title="Active Chats" value={kpiData.activeMessages} icon={<FaComments className="text-emerald-600 text-xl" />} color="bg-emerald-50" link="/AdminMessages" />
          <KpiCard title="Msg. Requests" value={kpiData.messageRequests} icon={<FaCommentDots className="text-indigo-600 text-xl" />} color="bg-indigo-50" link="/MessageRequest" />
        </section>

        {/* --- CHARTS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 lexend">
          {/* Volume Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="font-bold text-slate-700">Shipping Volume</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500 px-2 py-1">
                  <option value="preset">Preset</option>
                  <option value="custom">Custom Range</option>
                </select>
                {filterMode === 'preset' ? (
                  <select value={volumeFilter} onChange={(e) => setVolumeFilter(e.target.value)} className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 focus:ring-blue-500 px-2 py-1">
                    <option value="week">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input type="date" value={fromDate || ''} onChange={(e) => setFromDate(e.target.value)} className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 px-2 py-1" />
                    <span className="text-slate-500">to</span>
                    <input type="date" value={toDate || ''} onChange={(e) => setToDate(e.target.value)} className="text-sm border-slate-200 bg-slate-50 rounded-md text-slate-600 px-2 py-1" />
                  </div>
                )}
              </div>
            </div>
            <div className="h-64 w-full">
              <Line data={shipmentVolumeData} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 6 } }, tooltip: { backgroundColor: 'rgba(15,23,42,0.9)', padding: 10, cornerRadius: 8 } }, scales: { y: { beginAtZero: true, grid: { borderDash: [4, 4], color: 'rgba(148,163,184,0.2)' } }, x: { grid: { display: false } } } }} />
            </div>
          </div>

          {/* Status Doughnut — now filtered by same date range */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 lexend">Status Breakdown</h3>
              <span className="text-xs text-slate-400 italic">{filterMode === 'preset' ? volumeFilter === 'week' ? 'Last 7 days' : volumeFilter === 'last30' ? 'Last 30 days' : volumeFilter === 'last90' ? 'Last 90 days' : volumeFilter === 'month' ? 'This Month' : 'This Year' : 'Custom range'}</span>
            </div>
            <div className="h-48 relative flex justify-center">
              <Doughnut data={statusDistributionData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, usePointStyle: true, font: { size: 10 } } } } }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-slate-800">{totalFilteredStatus}</span>
                  <span className="text-xs text-slate-400">packages</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- ANALYTICS ROW --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lexend">
          {/* Top Destinations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <FaGlobe className="text-blue-500" />
              <h3 className="font-bold text-slate-700">Top Destination Countries</h3>
            </div>
            {topDestinations.length === 0 ? (
              <p className="text-slate-400 text-sm">No destination data available.</p>
            ) : (
              <ul className="space-y-3">
                {topDestinations.map(([dest, count], i) => {
                  const pct = kpiData.totalPackages > 0 ? Math.round((count / kpiData.totalPackages) * 100) : 0;
                  return (
                    <li key={dest}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{dest}</span>
                        <span className="text-slate-500">{count} pkgs ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Transport Mode Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <FaTruck className="text-amber-500" />
              <h3 className="font-bold text-slate-700">Transport Mode Breakdown</h3>
            </div>
            {transportModes.length === 0 ? (
              <p className="text-slate-400 text-sm">No transport mode data.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {transportModes.map(([mode, count]) => {
                  const pct = kpiData.totalPackages > 0 ? Math.round((count / kpiData.totalPackages) * 100) : 0;
                  const colors = { Air: 'bg-blue-100 text-blue-700', Sea: 'bg-cyan-100 text-cyan-700', Road: 'bg-amber-100 text-amber-700', Rail: 'bg-purple-100 text-purple-700' };
                  const cls = colors[mode] || 'bg-slate-100 text-slate-700';
                  return (
                    <div key={mode} className={`p-3 rounded-lg ${cls}`}>
                      <p className="text-xs font-semibold">{mode}</p>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs opacity-75">{pct}% of total</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* --- OPERATIONAL LISTS --- */}
        <section className={`grid grid-cols-1 gap-6 ${userRole === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>

          {/* 1. ACTION REQUIRED */}
          <div className="lexend bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[420px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">Action Required</h3>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{attentionItems.length}</span>
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
                      <div className="p-2 bg-white rounded-full shadow-sm">{item.icon}</div>
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[420px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 lexend">Recent Bookings</h3>
              <Link to="/ShipmentRequest" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {recentBookings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p className="text-sm">No recent bookings</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-2 text-slate-500 font-semibold">Sender</th>
                      <th className="text-left px-4 py-2 text-slate-500 font-semibold">Route</th>
                      <th className="text-left px-4 py-2 text-slate-500 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentBookings.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-slate-700">{r.name || "Unknown"}</div>
                          <div className="text-slate-400">{formatDate(r.requestTime)}</div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {r.senderCountry || '?'} → {r.destinationCountry || '?'}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${(r.status || "").toLowerCase() === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* 3. ACTIVITY LOG (ADMIN ONLY) */}
          {userRole === 'admin' && (
            <div className="lexend bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[420px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <FaRegClock className="text-slate-400" /> System Activity
                </h3>
                <span className="text-xs text-slate-400">Latest {recentUpdates.length} entries</span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                  {recentUpdates.map(u => (
                    <li key={u.id} className="p-3 text-xs border-l-2 border-slate-200 ml-2 hover:border-blue-500 transition-colors">
                      <p className="text-slate-600 mb-1">
                        <span className="font-semibold text-slate-800">{u.userName}:</span>{' '}
                        {u.displayedAction ? u.displayedAction.toUpperCase() : "UPDATE"}
                      </p>
                      <p className="text-slate-400">{u.formattedTimestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* --- USER COUNT (ADMIN ONLY) --- */}
        {userRole === 'admin' && (
          <section className="mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between lexend">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-50 rounded-lg">
                  <FaUsers className="text-violet-600 text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Registered Users</p>
                  <h3 className="text-3xl font-bold text-slate-800">{kpiData.totalUsers}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">All registered accounts</p>
                <p className="text-xs text-slate-400 mt-1">including admins & staff</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// --- Sub-Components ---
const KpiCard = ({ title, value, icon, color, link }) => (
  <Link to={link || "#"} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
  </Link>
);

export default AdminDashboard;