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
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { FaPrint, FaBox, FaClipboardList, FaComments, FaChartPie, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  // --- State Management ---
  const [shipments, setShipments] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [conversations, setConversations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Authorized Admin");
  
  // --- Period Filters ---
  const [filterType, setFilterType] = useState("month"); // 'day', 'month', 'year', 'custom'
  
  // Period States
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [specificDate, setSpecificDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [activeTab, setActiveTab] = useState("overview"); 

  // Per-Tab Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Print Ref
  const componentRef = useRef();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAdmin = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "Users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAdminName(`${data.firstName} ${data.lastName}`);
        }
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchAdmin();
        
        // 1. Shipments
        const packagesSnap = await getDocs(collection(db, "Packages"));
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Requests History
        const reqQuery = query(
            collection(db, "shipRequests"),
            where("status", "in", ["Accepted", "Rejected"])
        );
        const reqSnap = await getDocs(reqQuery);
        const reqData = reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Messages History
        const msgQuery = query(
            collection(db, "conversation_requests_history"),
            orderBy("processedAt", "desc")
        );
        const msgSnap = await getDocs(msgQuery);
        const msgData = msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setShipments(packagesData);
        setRequests(reqData);
        setConversations(msgData);

      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Reset Local Filters on Tab Change ---
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("All");
  }, [activeTab]);

  // --- Helper: Date Parsing ---
  const getDate = (item, field = null) => {
    if (field) {
        if (item[field]?.toDate) return item[field].toDate();
        if (item[field]) return new Date(item[field]);
    }
    // Priority logic
    if (item.processedAt?.toDate) return item.processedAt.toDate();
    if (item.acceptedAt?.toDate) return item.acceptedAt.toDate();
    if (item.rejectedAt?.toDate) return item.rejectedAt.toDate();
    if (item.requestTime) return new Date(item.requestTime);
    if (item.dateStarted) return new Date(item.dateStarted);
    if (item.createdTime?.toDate) return item.createdTime.toDate();
    return new Date(); 
  };

  // --- CORE FILTER LOGIC ---
  const filterData = (data, type) => {
    return data.filter(item => {
      // 1. Time Filter Logic
      let itemDate;
      if (type === 'shipment') itemDate = item.dateStarted ? new Date(item.dateStarted) : getDate(item, 'createdTime');
      else itemDate = getDate(item);
      
      let dateMatch = false;

      if (filterType === 'month') {
        dateMatch = itemDate.getMonth() === parseInt(selectedMonth) && itemDate.getFullYear() === parseInt(selectedYear);
      } else if (filterType === 'year') {
        dateMatch = itemDate.getFullYear() === parseInt(selectedYear);
      } else if (filterType === 'day') {
        // Compare YYYY-MM-DD strings
        const itemDateStr = itemDate.toISOString().split('T')[0];
        dateMatch = itemDateStr === specificDate;
      } else if (filterType === 'custom') {
        if (customStart && customEnd) {
            // Set boundaries to start of day and end of day
            const start = new Date(customStart); start.setHours(0,0,0,0);
            const end = new Date(customEnd); end.setHours(23,59,59,999);
            dateMatch = itemDate >= start && itemDate <= end;
        } else {
            dateMatch = true; // If range not set, show all (or handle as empty)
        }
      }

      if (!dateMatch) return false;

      // 2. Status Filter
      if (statusFilter !== "All") {
        const status = (item.packageStatus || item.status || "").toLowerCase();
        if (status !== statusFilter.toLowerCase()) return false;
      }

      // 3. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (type === 'shipment') {
            return (
                item.packageNumber?.toLowerCase().includes(query) ||
                item.shipperName?.toLowerCase().includes(query) ||
                item.destinationCountry?.toLowerCase().includes(query)
            );
        } else if (type === 'request' || type === 'message') {
            return (
                item.name?.toLowerCase().includes(query) ||
                item.userFullName?.toLowerCase().includes(query) ||
                item.email?.toLowerCase().includes(query) ||
                item.userEmail?.toLowerCase().includes(query)
            );
        }
      }

      return true;
    });
  };

  const processedShipments = filterData(shipments, 'shipment');
  const processedRequests = filterData(requests, 'request');
  const processedConversations = filterData(conversations, 'message');

  // --- Dynamic Options Generator ---
  const getStatusOptions = () => {
    if (activeTab === 'shipments') return ["All", "Pending", "In Transit", "Delivered", "Cancelled", "Returned"];
    if (activeTab === 'requests') return ["All", "Accepted", "Rejected"];
    if (activeTab === 'messages') return ["All", "Approved", "Rejected", "Ended"];
    return [];
  };

  // --- Helper: Format Date Range String ---
  const getPeriodString = () => {
      if (filterType === 'month') return `${months[selectedMonth]} ${selectedYear}`;
      if (filterType === 'year') return `Year ${selectedYear}`;
      if (filterType === 'day') return new Date(specificDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (filterType === 'custom') {
          if (!customStart || !customEnd) return "Custom Range (Incomplete)";
          return `${new Date(customStart).toLocaleDateString()} to ${new Date(customEnd).toLocaleDateString()}`;
      }
      return "";
  };

  // --- Narrative Generator ---
  const getNarrative = () => {
    const periodStr = getPeriodString();
    let text = "";
    
    // Append filter context to narrative
    const filterContext = [];
    if (searchQuery) filterContext.push(`matching keyword "${searchQuery}"`);
    if (statusFilter !== "All") filterContext.push(`with status "${statusFilter}"`);
    const contextStr = filterContext.length > 0 ? ` (${filterContext.join(", ")})` : "";

    switch (activeTab) {
      case "overview":
        text = `This is the Executive Summary Report for ${periodStr}. It provides a high-level overview of operational performance, including total shipment volume (${processedShipments.length}), processed shipment requests (${processedRequests.length}), and processed conversation requests (${processedConversations.length}).`;
        break;
      case "shipments":
        text = `This is the Detailed Shipment Report for ${periodStr}${contextStr}. It lists ${processedShipments.length} packages processed during this period based on applied filters.`;
        break;
      case "requests":
        text = `This is the Shipment Requests History Report for ${periodStr}${contextStr}. It details ${processedRequests.length} inquiries processed during this period.`;
        break;
      case "messages":
        text = `This is the Conversation Request History Report for ${periodStr}${contextStr}. It lists ${processedConversations.length} message requests processed by administrators.`;
        break;
      default:
        text = "System Report";
    }
    return text;
  };

  // --- Chart Data (Overview Only) ---
  const statusCounts = processedShipments.reduce((acc, curr) => {
    const status = curr.packageStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
        label: '# of Shipments',
        data: Object.values(statusCounts),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'],
        borderWidth: 1,
    }],
  };

  const activityData = {
    labels: ['Total Activity'],
    datasets: [
      { label: 'Completed', data: [processedShipments.filter(s => s.packageStatus === 'Delivered').length], backgroundColor: '#10B981' },
      { label: 'Active', data: [processedShipments.filter(s => s.packageStatus !== 'Delivered').length], backgroundColor: '#3B82F6' },
      { label: 'Requests', data: [processedRequests.length], backgroundColor: '#F59E0B' },
      { label: 'Messages', data: [processedConversations.length], backgroundColor: '#8B5CF6' },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Operational Overview' } },
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Report_${activeTab}_${getPeriodString().replace(/ /g, '_')}`,
    pageStyle: `
      @page { size: landscape; margin: 15mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-break-inside { page-break-inside: avoid; }
        .print-footer { position: fixed; bottom: 0; left: 0; right: 0; }
      }
    `,
  });

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Reports...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="no-print"><Sidebar /></div>
      
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        
        {/* --- Controls Section (No Print) --- */}
        <div className="flex flex-col gap-4 mb-6 no-print">
            
            {/* 1. TOP BAR: Title, Time Period Controls, Print Button */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-4 rounded-lg shadow-sm gap-4">
                <h1 className="text-2xl font-bold text-gray-800">System Reports</h1>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">
                    {/* Period Controls Group */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 border border-gray-300 rounded px-3 py-1 bg-white w-full sm:w-auto">
                        <FaCalendarAlt className="text-gray-500" />
                        
                        {/* Type Selector */}
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)} 
                            className="py-2 text-sm font-semibold bg-transparent focus:outline-none border-r border-gray-200 pr-2 mr-2"
                        >
                            <option value="day">Daily</option>
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {/* Conditional Inputs based on Filter Type */}
                        <div className="flex gap-2 items-center">
                            {filterType === 'day' && (
                                <input 
                                    type="date" 
                                    value={specificDate}
                                    onChange={(e) => setSpecificDate(e.target.value)}
                                    className="text-sm p-1 border rounded focus:outline-blue-500"
                                />
                            )}

                            {filterType === 'month' && (
                                <>
                                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm bg-transparent focus:outline-none">
                                        {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm bg-transparent focus:outline-none border-l pl-2 ml-1">
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </>
                            )}

                            {filterType === 'year' && (
                                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm bg-transparent focus:outline-none">
                                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            )}

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

            {/* 2. MIDDLE BAR: Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-lg overflow-x-auto">
                {['overview', 'shipments', 'requests', 'messages'].map(tab => (
                    <button
                        key={tab}
                        className={`flex items-center gap-2 py-3 px-6 font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'overview' && <FaChartPie />}
                        {tab === 'shipments' && <FaBox />}
                        {tab === 'requests' && <FaClipboardList />}
                        {tab === 'messages' && <FaComments />}
                        {tab === 'shipments' ? 'Shipments' : tab === 'requests' ? 'Requests' : tab === 'messages' ? 'Messages' : 'Overview'}
                    </button>
                ))}
            </div>

            {/* 3. BOTTOM BAR: Search & Status Filter (Hidden on Overview) */}
            {activeTab !== 'overview' && (
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-b-lg shadow-sm border-t border-gray-100">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Name, Email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <FaFilter className="text-gray-500" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                        >
                            {getStatusOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            )}
        </div>

        {/* --- Printable Content Area --- */}
        <div ref={componentRef} className="bg-white p-8 rounded-xl shadow-lg print:shadow-none min-h-[500px] flex flex-col justify-between">
          
          <div>
            {/* 1. Print Header */}
            <div className="hidden print:block mb-6 border-b pb-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-800">
                            {activeTab === 'overview' ? 'Executive Summary' : 
                            activeTab === 'shipments' ? 'Shipment Manifest' :
                            activeTab === 'requests' ? 'Shipment Requests Log' : 'Communication Log'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">LOGISTICS MANAGEMENT SYSTEM</p>
                    </div>
                    <div className="text-right">
                        {/* Dynamic Date in Header */}
                        <p className="text-lg font-semibold text-gray-700">{getPeriodString()}</p>
                        <p className="text-xs text-gray-400">Printed: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* 2. Narrative Section (Updates with Filter Context) */}
            <div className="hidden print:block mb-8 bg-gray-50 p-4 border-l-4 border-gray-600 print:bg-white print:border-l-0 print:p-0">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 border-b inline-block">Report Narrative</h4>
                <p className="text-gray-700 text-justify leading-relaxed">{getNarrative()}</p>
            </div>

            {/* 3. Content Body */}

            {/* A. OVERVIEW TAB */}
            <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 print-break-inside">
                    <SummaryCard title="Total Shipments" value={processedShipments.length} color="blue" />
                    <SummaryCard title="Delivered" value={processedShipments.filter(s => s.packageStatus === 'Delivered').length} color="green" />
                    <SummaryCard title="Processed Requests" value={processedRequests.length} color="yellow" />
                    <SummaryCard title="Processed Messages" value={processedConversations.length} color="purple" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-break-inside">
                    <ChartCard title="Activity Metrics"><Bar options={chartOptions} data={activityData} /></ChartCard>
                    <ChartCard title="Status Distribution"><Pie data={pieChartData} /></ChartCard>
                </div>
            </div>

            {/* B. SHIPMENTS TAB */}
            <div className={activeTab === 'shipments' ? 'block' : 'hidden'}>
                <TableContainer headers={["Package #", "Date", "Shipper", "Dest", "Mode", "Status", "Paid"]}>
                    {processedShipments.length > 0 ? processedShipments.map((s) => (
                        <tr key={s.id} className="bg-white border-b print:border-gray-300">
                            <td className="px-3 py-2 border font-bold text-gray-900">{s.packageNumber}</td>
                            <td className="px-3 py-2 border">{s.dateStarted ? new Date(s.dateStarted).toLocaleDateString() : 'N/A'}</td>
                            <td className="px-3 py-2 border">{s.shipperName}</td>
                            <td className="px-3 py-2 border">{s.destinationCountry}</td>
                            <td className="px-3 py-2 border">{s.transportMode}</td>
                            <td className="px-3 py-2 border">{s.packageStatus}</td>
                            <td className="px-3 py-2 border text-center">{s.paid ? "Yes" : "No"}</td>
                        </tr>
                    )) : <NoDataRow colSpan={7} />}
                </TableContainer>
            </div>

            {/* C. SHIPMENT REQUESTS TAB */}
            <div className={activeTab === 'requests' ? 'block' : 'hidden'}>
                <TableContainer headers={["Name", "Email", "Status", "Date Processed"]}>
                    {processedRequests.length > 0 ? processedRequests.map((r) => (
                        <tr key={r.id} className="bg-white border-b print:border-gray-300">
                            <td className="px-3 py-2 border font-bold text-gray-900">{r.name}</td>
                            <td className="px-3 py-2 border">{r.email}</td>
                            <td className="px-3 py-2 border"><StatusBadge status={r.status} /></td>
                            <td className="px-3 py-2 border">{(r.acceptedAt || r.rejectedAt || r.requestTime) ? getDate(r).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    )) : <NoDataRow colSpan={4} />}
                </TableContainer>
            </div>

            {/* D. MESSAGES TAB */}
            <div className={activeTab === 'messages' ? 'block' : 'hidden'}>
                <TableContainer headers={["User Name", "Email", "Status", "Processed By", "Date"]}>
                    {processedConversations.length > 0 ? processedConversations.map((c) => (
                        <tr key={c.id} className="bg-white border-b print:border-gray-300">
                            <td className="px-3 py-2 border font-bold text-gray-900">{c.userFullName || c.firstName}</td>
                            <td className="px-3 py-2 border">{c.userEmail}</td>
                            <td className="px-3 py-2 border"><StatusBadge status={c.status} /></td>
                            <td className="px-3 py-2 border">{c.processedBy || 'System'}</td>
                            <td className="px-3 py-2 border">{getDate(c).toLocaleDateString()}</td>
                        </tr>
                    )) : <NoDataRow colSpan={5} />}
                </TableContainer>
            </div>
          </div>

          {/* 4. Footer */}
          <div className="hidden print:flex mt-12 pt-8 border-t-2 border-gray-800 justify-between items-end print-break-inside">
            <div>
                <p className="text-sm font-bold uppercase text-gray-800">Produced By:</p>
                <p className="text-lg text-gray-600 mt-2 font-serif italic">{adminName}</p>
                <div className="h-px w-64 bg-gray-400 mt-1"></div>
                <p className="text-xs text-gray-400 mt-1">Authorized Administrator</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400">Page 1 of 1</p>
                <p className="text-xs text-gray-400">System Generated Report</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const SummaryCard = ({ title, value, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg border-l-4 border-${color}-500 print:border`}>
        <p className="text-gray-500 text-xs font-bold uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold uppercase text-center mb-4 text-gray-500">{title}</h3>
        <div className="h-64 flex justify-center">{children}</div>
    </div>
);

const TableContainer = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b-2 border-gray-300">
                <tr>{headers.map(h => <th key={h} className="px-3 py-3 border">{h}</th>)}</tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

const NoDataRow = ({ colSpan }) => (
    <tr><td colSpan={colSpan} className="text-center py-4 text-gray-400 italic">No records found matching current filters.</td></tr>
);

const StatusBadge = ({ status }) => {
    let color = "gray";
    const s = (status || "").toLowerCase();
    if(s === 'accepted' || s === 'approved') color = "green";
    if(s === 'rejected') color = "red";
    if(s === 'pending') color = "blue";
    
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-800 print:border print:border-gray-300 print:bg-white print:text-black`}>
            {status}
        </span>
    );
};

export default Reports;