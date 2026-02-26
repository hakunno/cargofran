import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../component/adminstaff/Sidebar";
import { db, auth } from "../../jsfile/firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FaPrint, FaBox, FaClipboardList, FaComments, FaChartPie, FaSearch, FaFilter, FaCalendarAlt, FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const PAGE_SIZE = 25;

const Reports = () => {
  const [shipments, setShipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [adminName, setAdminName] = useState("Authorized Admin");

  const [filterType, setFilterType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [specificDate, setSpecificDate] = useState(new Date().toISOString().split('T')[0]);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const componentRef = useRef();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, "Users", auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAdminName(`${data.firstName} ${data.lastName}`);
          }
        }

        const packagesSnap = await getDocs(collection(db, "Packages"));
        setShipments(packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const reqQuery = query(collection(db, "shipRequests"), where("status", "in", ["Accepted", "Rejected"]));
        const reqSnap = await getDocs(reqQuery);
        setRequests(reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const msgQuery = query(collection(db, "conversation_requests_history"), orderBy("processedAt", "desc"));
        const msgSnap = await getDocs(msgQuery);
        setConversations(msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, filterType, selectedMonth, selectedYear, specificDate, customStart, customEnd]);

  const getDate = (item, field = null) => {
    if (field) {
      if (item[field]?.toDate) return item[field].toDate();
      if (item[field]) return new Date(item[field]);
    }
    if (item.processedAt?.toDate) return item.processedAt.toDate();
    if (item.acceptedAt?.toDate) return item.acceptedAt.toDate();
    if (item.rejectedAt?.toDate) return item.rejectedAt.toDate();
    if (item.requestTime) return new Date(item.requestTime);
    if (item.dateStarted) return new Date(item.dateStarted);
    if (item.createdTime?.toDate) return item.createdTime.toDate();
    return new Date();
  };

  const filterData = (data, type) => {
    return data.filter(item => {
      let itemDate;
      if (type === 'shipment') itemDate = item.dateStarted ? new Date(item.dateStarted) : getDate(item, 'createdTime');
      else itemDate = getDate(item);

      let dateMatch = false;
      if (filterType === 'month') dateMatch = itemDate.getMonth() === parseInt(selectedMonth) && itemDate.getFullYear() === parseInt(selectedYear);
      else if (filterType === 'year') dateMatch = itemDate.getFullYear() === parseInt(selectedYear);
      else if (filterType === 'day') dateMatch = itemDate.toISOString().split('T')[0] === specificDate;
      else if (filterType === 'custom') {
        if (customStart && customEnd) {
          const start = new Date(customStart); start.setHours(0, 0, 0, 0);
          const end = new Date(customEnd); end.setHours(23, 59, 59, 999);
          dateMatch = itemDate >= start && itemDate <= end;
        } else dateMatch = true;
      }

      if (!dateMatch) return false;
      if (statusFilter !== "All") {
        const status = (item.packageStatus || item.status || "").toLowerCase();
        if (status !== statusFilter.toLowerCase()) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (type === 'shipment') return item.packageNumber?.toLowerCase().includes(q) || item.shipperName?.toLowerCase().includes(q) || item.destinationCountry?.toLowerCase().includes(q) || item.senderCountry?.toLowerCase().includes(q);
        else return item.name?.toLowerCase().includes(q) || item.userFullName?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q) || item.userEmail?.toLowerCase().includes(q);
      }
      return true;
    });
  };

  const processedShipments = filterData(shipments, 'shipment');
  const processedRequests = filterData(requests, 'request');
  const processedConversations = filterData(conversations, 'message');

  // Pagination helper
  const paginate = (data) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };
  const totalPages = (data) => Math.ceil(data.length / PAGE_SIZE);

  const getStatusOptions = () => {
    if (activeTab === 'shipments') return ["All", "Pending", "In Transit", "Delivered", "Cancelled", "Returned"];
    if (activeTab === 'requests') return ["All", "Accepted", "Rejected"];
    if (activeTab === 'messages') return ["All", "Approved", "Rejected", "Ended"];
    return [];
  };

  const getPeriodString = () => {
    if (filterType === 'month') return `${months[selectedMonth]} ${selectedYear}`;
    if (filterType === 'year') return `Year ${selectedYear}`;
    if (filterType === 'day') return new Date(specificDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (filterType === 'custom') {
      if (!customStart || !customEnd) return "Custom Range (Incomplete)";
      return `${new Date(customStart).toLocaleDateString()} to ${new Date(customEnd).toLocaleDateString()}`;
    }
    return "";
  };

  const getNarrative = () => {
    const periodStr = getPeriodString();
    const filterContext = [];
    if (searchQuery) filterContext.push(`matching keyword "${searchQuery}"`);
    if (statusFilter !== "All") filterContext.push(`with status "${statusFilter}"`);
    const contextStr = filterContext.length > 0 ? ` (${filterContext.join(", ")})` : "";
    switch (activeTab) {
      case "overview": return `Executive Summary Report for ${periodStr}. Total shipments: ${processedShipments.length}, processed requests: ${processedRequests.length}, processed conversations: ${processedConversations.length}.`;
      case "shipments": return `Detailed Shipment Report for ${periodStr}${contextStr}. Lists ${processedShipments.length} packages.`;
      case "requests": return `Shipment Requests History Report for ${periodStr}${contextStr}. Details ${processedRequests.length} inquiries.`;
      case "messages": return `Conversation Request History Report for ${periodStr}${contextStr}. Lists ${processedConversations.length} message requests.`;
      default: return "System Report";
    }
  };

  // CSV Export
  const exportCSV = (data, type) => {
    let headers, rows;
    if (type === 'shipment') {
      headers = ["Package #", "Date", "Shipper", "Origin", "Destination", "Mode", "Status", "Airway Bill", "Paid"];
      rows = data.map(s => [s.packageNumber, s.dateStarted ? new Date(s.dateStarted).toLocaleDateString() : 'N/A', s.shipperName, s.senderCountry, s.destinationCountry, s.transportMode, s.packageStatus, s.airwayBill || 'N/A', s.paid ? 'Yes' : 'No']);
    } else if (type === 'request') {
      headers = ["Name", "Email", "Service Type", "Origin", "Destination", "Status", "Date"];
      rows = data.map(r => [r.name, r.email, r.serviceType || 'N/A', r.senderCountry || 'N/A', r.destinationCountry || 'N/A', r.status, getDate(r).toLocaleDateString()]);
    } else {
      headers = ["User Name", "Email", "Status", "Processed By", "Date"];
      rows = data.map(c => [c.userFullName || c.firstName, c.userEmail, c.status, c.processedBy || 'System', getDate(c).toLocaleDateString()]);
    }
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report_${type}_${getPeriodString().replace(/ /g, '_')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const statusCounts = processedShipments.reduce((acc, curr) => { const s = curr.packageStatus || "Unknown"; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const pieChartData = { labels: Object.keys(statusCounts), datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'], borderWidth: 1 }] };
  const activityData = {
    labels: ['Overview'],
    datasets: [
      { label: 'Delivered', data: [processedShipments.filter(s => s.packageStatus === 'Delivered').length], backgroundColor: '#10B981' },
      { label: 'In Transit', data: [processedShipments.filter(s => s.packageStatus !== 'Delivered' && s.packageStatus !== 'Cancelled').length], backgroundColor: '#3B82F6' },
      { label: 'Ship Requests', data: [processedRequests.length], backgroundColor: '#F59E0B' },
      { label: 'Msg Requests', data: [processedConversations.length], backgroundColor: '#8B5CF6' },
    ],
  };

  // Trend chart (shipments received per day/month in current filter)
  const buildTrendChart = () => {
    const counts = {};
    const today = new Date();
    let startDate, endDate = today;

    if (filterType === 'month') { startDate = new Date(selectedYear, selectedMonth, 1); endDate = new Date(selectedYear, parseInt(selectedMonth) + 1, 0); }
    else if (filterType === 'year') { startDate = new Date(selectedYear, 0, 1); endDate = new Date(selectedYear, 11, 31); }
    else if (filterType === 'day') { startDate = new Date(specificDate + 'T00:00:00'); endDate = new Date(specificDate + 'T23:59:59'); }
    else { startDate = customStart ? new Date(customStart) : new Date(today.getFullYear(), today.getMonth(), 1); endDate = customEnd ? new Date(customEnd) : today; }

    const rangeDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const granularity = rangeDays > 60 ? 'month' : 'day';
    const labels = [];

    const getKey = (d) => granularity === 'day' ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (granularity === 'day') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) { const k = getKey(new Date(d)); labels.push(k); counts[k] = 0; }
    } else {
      const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cur <= endDate) { const k = getKey(new Date(cur)); labels.push(k); counts[k] = 0; cur.setMonth(cur.getMonth() + 1); }
    }

    processedShipments.forEach(s => {
      const d = s.dateStarted ? new Date(s.dateStarted) : (s.createdTime?.toDate ? s.createdTime.toDate() : null);
      if (d) { const k = getKey(d); if (counts[k] !== undefined) counts[k]++; }
    });

    return {
      labels,
      datasets: [{
        label: 'Shipments',
        data: labels.map(l => counts[l]),
        borderColor: '#3B82F6',
        backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, "rgba(59,130,246,0.3)"); g.addColorStop(1, "rgba(59,130,246,0)"); return g; },
        fill: true, tension: 0.4, pointRadius: 2
      }]
    };
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Report_${activeTab}_${getPeriodString().replace(/ /g, '_')}`,
    pageStyle: `
      @page { size: landscape; margin: 15mm; }
      @media print {
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #1e293b; -webkit-print-color-adjust: exact; margin: 0; }
        .print-header-block { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #1e293b; }
        .print-header-block h1 { font-size: 15pt; font-weight: bold; margin: 0 0 1px 0; }
        .print-header-block .subtitle { font-size: 7.5pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px 0; }
        .print-header-block .narrative { font-size: 8.5pt; color: #334155; margin: 4px 0 2px 0; line-height: 1.4; }
        .print-header-block .meta { display: flex; justify-content: space-between; font-size: 7.5pt; color: #64748b; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 7.5pt; table-layout: fixed; }
        thead { display: table-header-group; }
        th { background-color: #f1f5f9 !important; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 6.5pt; letter-spacing: 0.05em; padding: 4px 6px; border: 1px solid #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
        td { border: 1px solid #e2e8f0; padding: 4px 6px; vertical-align: top; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        canvas { max-height: 100% !important; max-width: 100% !important; width: auto !important; height: auto !important; margin: 0 auto; display: block; }
        .chart-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; }
        .chart-box { border: 1px solid #e2e8f0 !important; padding: 5px !important; margin: 0 !important; height: 160px !important; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .chart-box h3 { font-size: 7.5pt !important; text-transform: uppercase; color: #64748b; margin-bottom: 3px !important; text-align: center; width: 100%; }
        .chart-box > div { flex: 1; min-height: 0; width: 100%; display: flex; justify-content: center; }
        .trend-section { margin-bottom: 10px; }
        .trend-section h3 { font-size: 8pt; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
        .trend-box { border: 1px solid #e2e8f0; padding: 4px; margin-bottom: 6px; height: 140px !important; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; }
        .no-print { display: none !important; }
        .print-footer-bar { margin-top: 14px; padding-top: 8px; border-top: 1px solid #94a3b8; display: flex; justify-content: space-between; font-size: 8.5pt; color: #475569; }
        .summary-cards-print { display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 8px; }
        .summary-card-print { border: 1px solid #e2e8f0; padding: 5px 7px; }
        .summary-card-print .sc-label { font-size: 6.5pt; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em; margin: 0; }
        .summary-card-print .sc-value { font-size: 17pt; font-weight: bold; color: #0f172a; margin: 0; line-height: 1.1; }
      }
    `,
  });

  // Mini stats for each tab
  const shipmentStats = { total: processedShipments.length, delivered: processedShipments.filter(s => s.packageStatus === 'Delivered').length, inTransit: processedShipments.filter(s => ['In Transit', 'In transit'].includes(s.packageStatus)).length, delayed: processedShipments.filter(s => (s.packageStatus || '').toLowerCase().includes('delayed')).length };
  const requestStats = { total: processedRequests.length, accepted: processedRequests.filter(r => r.status === 'Accepted').length, rejected: processedRequests.filter(r => r.status === 'Rejected').length };
  const messageStats = { total: processedConversations.length, approved: processedConversations.filter(c => c.status === 'approved').length, rejected: processedConversations.filter(c => c.status === 'rejected').length, ended: processedConversations.filter(c => c.status === 'ended').length };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="no-print"><Sidebar /></div>
      <div className="flex-1 p-4 md:p-8 md:ml-64">

        {/* Controls Section */}
        <div className="flex flex-col gap-4 mb-6 no-print">

          {/* Top Bar */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-4 rounded-lg shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">System Reports</h1>
              <p className="text-sm text-gray-500 mt-0.5">Period: <span className="font-semibold text-gray-700">{getPeriodString()}</span></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 border border-gray-300 rounded px-3 py-1.5 bg-white w-full sm:w-auto">
                <FaCalendarAlt className="text-gray-400" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="py-1 text-sm font-semibold bg-transparent focus:outline-none border-r border-gray-200 pr-2 mr-1">
                  <option value="day">Daily</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
                <div className="flex gap-2 items-center">
                  {filterType === 'day' && <input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} className="text-sm p-1 border rounded focus:outline-blue-500" />}
                  {filterType === 'month' && (<>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm bg-transparent focus:outline-none">{months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}</select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm bg-transparent focus:outline-none border-l pl-2 ml-1">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                  </>)}
                  {filterType === 'year' && <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm bg-transparent focus:outline-none">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>}
                  {filterType === 'custom' && (
                    <div className="flex items-center gap-1">
                      <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="text-sm p-1 border rounded max-w-[130px]" />
                      <span className="text-gray-400">-</span>
                      <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="text-sm p-1 border rounded max-w-[130px]" />
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto justify-center">
                <FaPrint /> Print
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-lg overflow-x-auto">
            {['overview', 'shipments', 'requests', 'messages'].map(tab => (
              <button key={tab} className={`flex items-center gap-2 py-3 px-6 font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`} onClick={() => setActiveTab(tab)}>
                {tab === 'overview' && <FaChartPie />}{tab === 'shipments' && <FaBox />}{tab === 'requests' && <FaClipboardList />}{tab === 'messages' && <FaComments />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search & Filter Bar (non-overview) */}
          {activeTab !== 'overview' && (
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-b-lg shadow-sm border-t border-gray-100 items-center">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Search by ID, Name, Email, Country..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2 min-w-[200px]">
                <FaFilter className="text-gray-500" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none">
                  {getStatusOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <button onClick={() => exportCSV(activeTab === 'shipments' ? processedShipments : activeTab === 'requests' ? processedRequests : processedConversations, activeTab === 'shipments' ? 'shipment' : activeTab === 'requests' ? 'request' : 'message')} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition whitespace-nowrap">
                <FaDownload /> Export CSV
              </button>
            </div>
          )}
        </div>

        {/* Printable Content */}
        <div ref={componentRef} className="bg-white p-6 md:p-8 rounded-xl shadow-lg print:shadow-none min-h-[500px]">
          <div>
            {/* Print Header (consistent design) */}
            <div className="hidden print:block print-header-block mb-6">
              <h1>
                {activeTab === 'overview' ? 'Executive Summary' :
                  activeTab === 'shipments' ? 'Shipment Manifest' :
                    activeTab === 'requests' ? 'Shipment Requests Log' : 'Communication Log'}
              </h1>
              <p className="subtitle">Logistics Management System</p>
              <p className="narrative">{getNarrative()}</p>
              <div className="meta">
                <span>Period: <strong>{getPeriodString()}</strong></span>
                <span>Printed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* ===== OVERVIEW TAB ===== */}
            <div className={activeTab === 'overview' ? 'block' : 'hidden'}>

              {/* 8 Summary Cards — print-safe grid */}
              <div className="summary-cards-print grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Total Shipments" value={processedShipments.length} color="blue" />
                <SummaryCard title="Delivered" value={shipmentStats.delivered} color="green" />
                <SummaryCard title="In Transit" value={shipmentStats.inTransit} color="indigo" />
                <SummaryCard title="Delayed" value={shipmentStats.delayed} color="red" />
                <SummaryCard title="Processed Requests" value={processedRequests.length} color="yellow" />
                <SummaryCard title="Req. Accepted" value={requestStats.accepted} color="green" />
                <SummaryCard title="Processed Messages" value={processedConversations.length} color="purple" />
                <SummaryCard title="Msg. Approved" value={messageStats.approved} color="green" />
              </div>

              {/* Trend Chart */}
              <div className="trend-box mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Shipment Trend</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-44">
                  <Line data={buildTrendChart()} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { borderDash: [4, 4], color: 'rgba(148,163,184,0.2)' } }, x: { grid: { display: false } } } }} />
                </div>
              </div>

              <div className="chart-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Reports Metrics"><Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={activityData} /></ChartCard>
                <ChartCard title="Status Distribution"><Pie data={pieChartData} /></ChartCard>
              </div>
            </div>

            {/* ===== SHIPMENTS TAB ===== */}
            <div className={activeTab === 'shipments' ? 'block' : 'hidden'}>
              {/* Mini stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniStat label="Total" value={shipmentStats.total} color="blue" />
                <MiniStat label="Delivered" value={shipmentStats.delivered} pct={shipmentStats.total > 0 ? Math.round(shipmentStats.delivered / shipmentStats.total * 100) : 0} color="green" />
                <MiniStat label="In Transit" value={shipmentStats.inTransit} color="indigo" />
                <MiniStat label="Delayed" value={shipmentStats.delayed} color="red" />
              </div>
              <PaginationBar current={currentPage} total={totalPages(processedShipments)} count={processedShipments.length} onChange={setCurrentPage} />
              <TableContainer headers={["Package #", "Date", "Shipper", "Origin", "Destination", "Mode", "Status", "Airway Bill", "Paid"]}>
                {processedShipments.length > 0 ? paginate(processedShipments).map(s => (
                  <tr key={s.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{s.packageNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.dateStarted ? new Date(s.dateStarted).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.shipperName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.senderCountry || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.destinationCountry}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.transportMode}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={s.packageStatus} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.airwayBill || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-center">{s.paid ? <span className="text-emerald-600 font-semibold">Yes</span> : <span className="text-gray-400">No</span>}</td>
                  </tr>
                )) : <NoDataRow colSpan={9} />}
              </TableContainer>
            </div>

            {/* ===== REQUESTS TAB ===== */}
            <div className={activeTab === 'requests' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <MiniStat label="Total" value={requestStats.total} color="blue" />
                <MiniStat label="Accepted" value={requestStats.accepted} color="green" />
                <MiniStat label="Rejected" value={requestStats.rejected} color="red" />
              </div>
              <PaginationBar current={currentPage} total={totalPages(processedRequests)} count={processedRequests.length} onChange={setCurrentPage} />
              <TableContainer headers={["Name", "Email", "Service Type", "Origin", "Destination", "Status", "Date"]}>
                {processedRequests.length > 0 ? paginate(processedRequests).map(r => (
                  <tr key={r.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.serviceType || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.senderCountry || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.destinationCountry || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(r.acceptedAt || r.rejectedAt || r.requestTime) ? getDate(r).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                )) : <NoDataRow colSpan={7} />}
              </TableContainer>
            </div>

            {/* ===== MESSAGES TAB ===== */}
            <div className={activeTab === 'messages' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniStat label="Total" value={messageStats.total} color="blue" />
                <MiniStat label="Approved" value={messageStats.approved} color="green" />
                <MiniStat label="Rejected" value={messageStats.rejected} color="red" />
                <MiniStat label="Ended" value={messageStats.ended} color="gray" />
              </div>
              <PaginationBar current={currentPage} total={totalPages(processedConversations)} count={processedConversations.length} onChange={setCurrentPage} />
              <TableContainer headers={["User Name", "Email", "Status", "Processed By", "Date"]}>
                {processedConversations.length > 0 ? paginate(processedConversations).map(c => (
                  <tr key={c.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{c.userFullName || c.firstName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.userEmail}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.processedBy || 'System'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getDate(c).toLocaleDateString()}</td>
                  </tr>
                )) : <NoDataRow colSpan={5} />}
              </TableContainer>
            </div>
          </div>

          {/* Print Footer - consistent design */}
          <div className="hidden print:flex print-footer-bar mt-12">
            <span>Produced by: <strong>{adminName}</strong></span>
            <span>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const SummaryCard = ({ title, value, color }) => {
  const colors = { blue: 'bg-blue-50 border-blue-500 text-blue-700', green: 'bg-green-50 border-green-500 text-green-700', red: 'bg-red-50 border-red-500 text-red-700', yellow: 'bg-yellow-50 border-yellow-500 text-yellow-700', purple: 'bg-purple-50 border-purple-500 text-purple-700', indigo: 'bg-indigo-50 border-indigo-500 text-indigo-700', gray: 'bg-gray-50 border-gray-400 text-gray-600' };
  const cls = colors[color] || colors.blue;
  return (
    <div className={`p-4 rounded-lg border-l-4 print:border ${cls} summary-card-print`}>
      <p className="text-gray-500 text-xs font-bold uppercase sc-label">{title}</p>
      <p className="text-3xl font-bold text-gray-800 sc-value">{value}</p>
    </div>
  );
};

const MiniStat = ({ label, value, pct, color }) => {
  const colors = { blue: 'text-blue-600 bg-blue-50', green: 'text-emerald-600 bg-emerald-50', red: 'text-red-600 bg-red-50', gray: 'text-gray-600 bg-gray-50', indigo: 'text-indigo-600 bg-indigo-50' };
  const cls = colors[color] || colors.blue;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${cls} border-opacity-50`}>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold">{value}</p>
        {pct !== undefined && <p className="text-xs opacity-70">{pct}%</p>}
      </div>
    </div>
  );
};

const PaginationBar = ({ current, total, count, onChange }) => {
  if (total <= 1) return <p className="text-xs text-gray-400 mb-2">Showing all {count} records</p>;
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs text-gray-500">Showing page <span className="font-semibold">{current}</span> of <span className="font-semibold">{total}</span> ({count} total records)</p>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
          <FaChevronLeft size={10} />
        </button>
        <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total} className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
          <FaChevronRight size={10} />
        </button>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 chart-box">
    <h3 className="text-sm font-bold uppercase text-center mb-2 text-gray-500">{title}</h3>
    <div className="h-64 print:h-40 flex justify-center">{children}</div>
  </div>
);

const TableContainer = ({ headers, children }) => (
  <div className="overflow-x-auto overflow-y-auto max-h-[65vh] border rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
        <tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>)}</tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
);

const NoDataRow = ({ colSpan }) => (
  <tr><td colSpan={colSpan} className="text-center py-12 text-gray-400 italic">No records found matching current filters.</td></tr>
);

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  let cls = "bg-gray-100 text-gray-700";
  if (s === 'accepted' || s === 'approved' || s === 'delivered') cls = "bg-emerald-100 text-emerald-700";
  else if (s === 'rejected') cls = "bg-red-100 text-red-700";
  else if (s === 'pending' || s === 'in transit') cls = "bg-blue-100 text-blue-700";
  else if (s === 'ended') cls = "bg-slate-100 text-slate-600";
  else if (s.includes('delayed') || s.includes('exception')) cls = "bg-orange-100 text-orange-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls} print:border print:border-gray-300 print:bg-white print:text-black`}>{status}</span>;
};

export default Reports;
