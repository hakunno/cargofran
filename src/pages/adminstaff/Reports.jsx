import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { db } from "../../jsfile/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useReactToPrint } from 'react-to-print';
import Sidebar from "../../component/adminstaff/Sidebar";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Reports = () => {
  const [key, setKey] = useState("shipmentSummary");
  const [adminName] = useState("Admin User"); // Replace with actual logged-in admin name from auth context if available

  // Data states for each report
  const [shipments, setShipments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [statusData, setStatusData] = useState({ labels: [], datasets: [] });
  const [transportData, setTransportData] = useState({ labels: [], datasets: [] });
  const [deliveryPerformanceData, setDeliveryPerformanceData] = useState({ labels: [], datasets: [] });

  // Date selection states
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dateSet, setDateSet] = useState(new Set());
  const [monthSet, setMonthSet] = useState(new Set());

  // Refs for printing
  const shipmentSummaryRef = useRef();
  const deliveryPerformanceRef = useRef();
  const pendingRequestsRef = useRef();

  useEffect(() => {
    const fetchAll = async () => {
      const [shipSnap, reqSnap] = await Promise.all([
        getDocs(collection(db, "Packages")),
        getDocs(query(collection(db, "shipRequests"), where("status", "!=", "Accepted")))
      ]);

      const shipmentsList = shipSnap.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      const requestsList = reqSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setShipments(shipmentsList);
      setPendingRequests(requestsList);

      // Compute dateSet and monthSet
      const allDates = [];
      const currentTime = new Date();
      shipmentsList.forEach(s => {
        const ts = s.createdTime?.toDate() || (s.dateStarted ? new Date(s.dateStarted) : null);
        if (ts && ts <= currentTime) allDates.push(ts);
      });
      requestsList.forEach(r => {
        const ts = r.requestTime ? new Date(r.requestTime) : null;
        if (ts && ts <= currentTime) allDates.push(ts);
      });

      const dSet = new Set(allDates.map(d => d.toISOString().slice(0, 10)));
      const mSet = new Set(allDates.map(d => d.toISOString().slice(0, 7)));
      setDateSet(dSet);
      setMonthSet(mSet);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (shipments.length === 0 && pendingRequests.length === 0) return;

    const start = selectedDate;
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    const filterByDate = (item, getTs) => {
      const ts = getTs(item);
      return ts && ts >= start && ts <= end;
    };

    const filteredShipments = shipments.filter(s =>
      filterByDate(s, s => s.createdTime?.toDate() || (s.dateStarted ? new Date(s.dateStarted) : null))
    );
    const filteredRequests = pendingRequests.filter(r =>
      filterByDate(r, r => r.requestTime ? new Date(r.requestTime) : null)
    );

    // Shipment Status Pie Chart
    const statusCounts = filteredShipments.reduce((acc, s) => {
      const status = s.packageStatus || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    setStatusData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"],
          borderColor: ["#059669", "#1D4ED8", "#DC2626", "#D97706", "#6D28D9"],
          borderWidth: 1,
        },
      ],
    });

    // Transport Mode Bar Chart
    const transportCounts = filteredShipments.reduce((acc, s) => {
      const mode = s.transportMode || "Unknown";
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});
    setTransportData({
      labels: Object.keys(transportCounts),
      datasets: [
        {
          label: "Shipments",
          data: Object.values(transportCounts),
          backgroundColor: "#3B82F6",
          borderColor: "#1D4ED8",
          borderWidth: 1,
        },
      ],
    });

    // Delivery Performance (Line Chart)
    const deliveredShipments = filteredShipments.filter(s => s.packageStatus === "Delivered");
    const deliveryLabels = deliveredShipments.map(s => s.packageNumber);
    const deliveryDays = deliveredShipments.map(s => {
      const startTs = s.createdTime?.toDate() || new Date(s.dateStarted);
      const endTs = s.updatedTime?.toDate() || new Date();
      return Math.ceil((endTs - startTs) / (1000 * 60 * 60 * 24));
    });
    setDeliveryPerformanceData({
      labels: deliveryLabels,
      datasets: [
        {
          label: "Days to Delivery",
          data: deliveryDays,
          borderColor: "#10B981",
          backgroundColor: "#059669",
          tension: 0.4,
          fill: false,
        },
      ],
    });
  }, [shipments, pendingRequests, selectedDate]);

  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthStr = selectedDate.toISOString().slice(0, 7);
  const hasDataInMonth = monthSet.has(currentMonthStr);

  const handleCalendarChange = (date) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), 1));
    setShowCalendarModal(false);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayStr = date.toISOString().slice(0, 10);
      return dateSet.has(dayStr) ? 'has-data' : null;
    } else if (view === 'year') {
      const monthStr = date.toISOString().slice(0, 7);
      return monthSet.has(monthStr) ? 'has-data' : null;
    }
    return null;
  };

  // Print handlers (updated to include report period)
  const currentDate = new Date().toLocaleDateString();
  const reportPeriod = `Report Period: ${monthName}`;

  const handlePrintShipmentSummary = useReactToPrint({
    contentRef: shipmentSummaryRef,
    documentTitle: "Francess Logistic: Shipment Summary Report",
    pageStyle: `@media print { 
      body { font-family: Arial, sans-serif; margin: 20mm; width: 100%; max-width: 1000px; } 
      .print-header { margin-bottom: 30px; position: relative; padding-bottom: 10px; border-bottom: 1px solid #ddd; } 
      .print-header h2 { text-align: center; font-size: 24px; margin-bottom: 10px; color: #333; } 
      .print-header .header-details { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #666; margin-top: 5px; } 
      .print-header .icon { position: absolute; top: 0; right: 0; width: 50px; height: 50px; } 
      .print-header .icon img { width: 100%; height: 100%; object-fit: cover; } 
      h3 { text-align: center; margin: 20px 0; font-size: 18px; color: #333; } 
      table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } 
      th { background-color: #f2f2f2; } 
      canvas { max-width: 100%; max-height: 400px; page-break-inside: avoid; } 
      .no-print { display: none !important; } 
      .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; } 
      .chart-container { text-align: center; } 
      .table-container { overflow-x: auto; } 
    }`,
  });

  const handlePrintDeliveryPerformance = useReactToPrint({
    contentRef: deliveryPerformanceRef,
    documentTitle: "Francess Logistic: Delivery Performance Report",
    pageStyle: `@media print { 
      body { font-family: Arial, sans-serif; margin: 20mm; width: 100%; max-width: 1000px; } 
      .print-header { margin-bottom: 30px; position: relative; padding-bottom: 10px; border-bottom: 1px solid #ddd; } 
      .print-header h2 { text-align: center; font-size: 24px; margin-bottom: 10px; color: #333; } 
      .print-header .header-details { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #666; margin-top: 5px; } 
      .print-header .icon { font-size: 24px; position: absolute; top: 0; right: 0; } 
      h3 { text-align: center; margin: 20px 0; font-size: 18px; color: #333; } 
      table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } 
      th { background-color: #f2f2f2; } 
      canvas { max-width: 100%; max-height: 400px; page-break-inside: avoid; } 
      .no-print { display: none !important; } 
      .chart-container { text-align: center; } 
      .table-container { overflow-x: auto; } 
    }`,
  });

  const handlePrintPendingRequests = useReactToPrint({
    contentRef: pendingRequestsRef,
    documentTitle: "Francess Logistic Pending Requests Report",
    pageStyle: `@media print { 
      body { font-family: Arial, sans-serif; margin: 20mm; width: 100%; max-width: 1000px; } 
      .print-header { margin-bottom: 30px; position: relative; padding-bottom: 10px; border-bottom: 1px solid #ddd; } 
      .print-header h2 { text-align: center; font-size: 24px; margin-bottom: 10px; color: #333; } 
      .print-header .header-details { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #666; margin-top: 5px; } 
      .print-header .icon { font-size: 24px; position: absolute; top: 0; right: 0; } 
      h3 { text-align: center; margin: 20px 0; font-size: 18px; color: #333; } 
      table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } 
      th { background-color: #f2f2f2; } 
      canvas { max-width: 100%; max-height: 400px; page-break-inside: avoid; } 
      .no-print { display: none !important; } 
      .table-container { overflow-x: auto; } 
    }`,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64">
        {/* Month/Year Carousel */}
        <div className="flex justify-center items-center mb-4">
          <Button variant="outline-primary" onClick={prevMonth} className="mx-2">&lt;</Button>
          <span 
            onClick={() => setShowCalendarModal(true)} 
            className={`mx-4 cursor-pointer text-lg font-bold text-gray-900 text-gray-400`}
          >
            {monthName}
          </span>
          <Button variant="outline-primary" onClick={nextMonth} className="mx-2">&gt;</Button>
        </div>

        {/* Calendar Modal */}
        <Modal show={showCalendarModal} onHide={() => setShowCalendarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Month/Year</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex justify-center items-center">
            <Calendar
              onChange={handleCalendarChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />
          </Modal.Body>
        </Modal>

        {/* Add custom style for has-data */}
        <style>{`
          .react-calendar__tile.has-data {
            background-color: #d1e7dd !important;
          }
        `}</style>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap justify-around gap-2">
            <Button 
              variant={key === "shipmentSummary" ? "primary" : "outline-primary"} 
              onClick={() => setKey("shipmentSummary")}
              className="flex-1 min-w-[150px]"
            >
              Shipment Summary
            </Button>
            <Button 
              variant={key === "deliveryPerformance" ? "primary" : "outline-primary"} 
              onClick={() => setKey("deliveryPerformance")}
              className="flex-1 min-w-[150px]"
            >
              Delivery Performance
            </Button>
            <Button 
              variant={key === "pendingRequests" ? "primary" : "outline-primary"} 
              onClick={() => setKey("pendingRequests")}
              className="flex-1 min-w-[150px]"
            >
              Shipment Requests
            </Button>
          </div>
        </div>

        {/* Shipment Summary Tab Content */}
        {key === "shipmentSummary" && (
          <div ref={shipmentSummaryRef} className="bg-white shadow-lg rounded-xl p-6 print-section">
            <div className="print-header hidden print:block">
              <h2 className="text-2xl font-bold text-gray-900">Francess Logistic Shipment Summary Report</h2>
              <div className="header-details">
                <span>Prepared by: {adminName} | Prepared for: Francess Logistic</span>
                <span>{reportPeriod}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Shipment Summary Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md chart-container" style={{ width: '350px', height: '350px', margin: '0 auto' }}>
                <Pie
                  data={statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { position: "top" }, title: { display: true, text: "Shipment Status Distribution", font: { size: 16 } } },
                  }}
                />
              </div>
              <div className="bg-gray-50 p-2 rounded-lg shadow-md chart-container">
                <Bar
                  data={transportData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" }, title: { display: true, text: "Shipments by Transport Mode", font: { size: 16 } } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </div>
            </div>
            <div className="mt-6 table-container">
              <Table striped bordered hover className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {statusData.labels.map((label, idx) => (
                    <tr key={label}>
                      <td className="p-3">{label}</td>
                      <td className="p-3">{statusData.datasets[0]?.data[idx] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Button variant="primary" onClick={handlePrintShipmentSummary} className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 no-print">
              Print Report
            </Button>
          </div>
        )}

        {/* Delivery Performance Tab Content */}
        {key === "deliveryPerformance" && (
          <div ref={deliveryPerformanceRef} className="bg-white shadow-lg rounded-xl p-6 print-section">
            <div className="print-header hidden print:block">
              <h2 className="text-2xl font-bold text-gray-900">Francess Logistic Delivery Performance Report</h2>
              <span className="icon">📈</span>
              <div className="header-details">
                <span>Prepared by: {adminName} | Prepared for: Francess Logistic</span>
                <span>{reportPeriod}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Delivery Performance Report</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md chart-container" style={{ height: '400px' }}>
              <Line
                data={deliveryPerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" }, title: { display: true, text: "Days to Delivery per Shipment", font: { size: 16 } } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
            <div className="mt-6 table-container">
              <Table striped bordered hover className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Package Number</th>
                    <th className="p-3 text-left">Days to Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPerformanceData.labels.map((label, idx) => (
                    <tr key={label}>
                      <td className="p-3">{label}</td>
                      <td className="p-3">{deliveryPerformanceData.datasets[0]?.data[idx] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Button variant="primary" onClick={handlePrintDeliveryPerformance} className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 no-print">
              Print Report
            </Button>
          </div>
        )}

        {/* Pending Requests Tab Content */}
        {key === "pendingRequests" && (
          <div ref={pendingRequestsRef} className="bg-white shadow-lg rounded-xl p-6 print-section">
            <div className="print-header hidden print:block">
              <h2 className="text-2xl font-bold text-gray-900">Francess Logistic Pending Requests Report</h2>
              <span className="icon">📋</span>
              <div className="header-details">
                <span>Prepared by: {adminName} | Prepared for: Francess Logistic</span>
                <span>{reportPeriod}</span>
                <span>Date: {currentDate}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Pending Requests Report</h3>
            <div className="table-container">
              <Table striped bordered hover className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Sender Country</th>
                    <th className="p-3 text-left">Destination Country</th>
                    <th className="p-3 text-left">Request Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.filter(r => {
                    const ts = r.requestTime ? new Date(r.requestTime) : null;
                    return ts && ts >= selectedDate && ts <= new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
                  }).map((req) => (
                    <tr key={req.id}>
                      <td className="p-3">{req.name}</td>
                      <td className="p-3">{req.senderCountry}</td>
                      <td className="p-3">{req.destinationCountry}</td>
                      <td className="p-3">{req.requestTime ? new Date(req.requestTime).toLocaleString() : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Button variant="primary" onClick={handlePrintPendingRequests} className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 no-print">
              Print Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;