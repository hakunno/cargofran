import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../jsfile/firebase";

export const logActivity = async (userName, action) => {
  try {
    await addDoc(collection(db, "activities"), {
      userName,
      action,
      timestamp: serverTimestamp(),
    });
    console.log("Activity logged successfully");
  } catch (error) {
    console.error("Error logging activity: ", error);
  }
};

const ActivityModal = ({ show, onHide }) => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filters, setFilters] = useState({
    edited: false,
    delivered: false,
    canceled: false,
    acceptedMessage: false,
    acceptedShipment: false,
  });

  useEffect(() => {
    if (!show) return;

    const q = query(collection(db, "activities"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
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
      setActivities(activityList);
    });

    return () => unsubscribe();
  }, [show]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Hide malformed entries (Firestore doc ID accidentally logged as action)
      if (
        activity.action &&
        typeof activity.action === "string" &&
        activity.action.length === 20 &&
        /^[A-Za-z0-9]{20}$/.test(activity.action)
      ) {
        return false;
      }

      // Hide if no valid timestamp
      if (!activity.dateString) return false;

      // Search in userName OR action (use original action for search)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          activity.userName.toLowerCase().includes(q) ||
          activity.action.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (startDate && activity.dateString < startDate) return false;
      if (endDate && activity.dateString > endDate) return false;

      // Checkbox filters (use original action for filters)
      const anyFilterActive = Object.values(filters).some((f) => f);
      if (anyFilterActive) {
        let matches = false;
        if (filters.edited && activity.action.includes("Edited")) matches = true;
        if (filters.delivered && (activity.action.includes("Delivered") || activity.action.includes("Done"))) matches = true;
        if (filters.canceled && activity.action.includes("Canceled")) matches = true;
        if (filters.acceptedMessage && activity.action.includes("Approved conversation")) matches = true;
        if (filters.acceptedShipment && activity.action.includes("Accepted shipment")) matches = true;
        if (!matches) return false;
      }

      return true;
    });
  }, [activities, searchQuery, startDate, endDate, filters]);

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setFilters({
      edited: false,
      delivered: false,
      canceled: false,
      acceptedMessage: false,
      acceptedShipment: false,
    });
  };

  const anyFilterApplied = searchQuery || startDate || endDate || Object.values(filters).some((f) => f);

  // ==================== EXPORT TO CSV ====================
  const exportToCSV = () => {
    if (filteredActivities.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["User Name", "Action", "Timestamp"];
    const rows = filteredActivities.map((activity) => [
      activity.userName,
      activity.displayedAction, // Use displayedAction for export
      activity.formattedTimestamp,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `activity_log_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==================== PRINT / SAVE AS PDF ====================
  const printTable = () => {
    if (filteredActivities.length === 0) {
      alert("No data to print");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    const tableRows = filteredActivities
      .map(
        (activity) => `
          <tr>
            <td style="border:1px solid #ccc; padding:8px;">${activity.userName}</td>
            <td style="border:1px solid #ccc; padding:8px;">${activity.displayedAction}</td> {/* Use displayedAction for print */}
            <td style="border:1px solid #ccc; padding:8px;">${activity.formattedTimestamp}</td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Log</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Activity Log</h1>
          <p><strong>Exported on:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total records:</strong> ${filteredActivities.length}</p>
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close(); // optional — let user keep it if they want
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Activity Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          {/* Search */}
          <Form.Control
            type="text"
            placeholder="Search by user name or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />

          {/* Date Range */}
          <Form.Label>Date Range</Form.Label>
          <div className="d-flex gap-2 mb-3">
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Checkboxes */}
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Form.Check
              type="checkbox"
              label="Edited"
              checked={filters.edited}
              onChange={() => handleFilterChange('edited')}
            />
            <Form.Check
              type="checkbox"
              label="Delivered/Done"
              checked={filters.delivered}
              onChange={() => handleFilterChange('delivered')}
            />
            <Form.Check
              type="checkbox"
              label="Canceled"
              checked={filters.canceled}
              onChange={() => handleFilterChange('canceled')}
            />
            <Form.Check
              type="checkbox"
              label="Approved Message"
              checked={filters.acceptedMessage}
              onChange={() => handleFilterChange('acceptedMessage')}
            />
            <Form.Check
              type="checkbox"
              label="Accepted Shipment"
              checked={filters.acceptedShipment}
              onChange={() => handleFilterChange('acceptedShipment')}
            />
          </div>

          {/* Clear Filters + Export Buttons */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {anyFilterApplied && (
                <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button variant="success" size="sm" onClick={exportToCSV}>
                Export CSV
              </Button>
              <Button variant="primary" size="sm" onClick={printTable}>
                Print / Save as PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 mb-0" responsive>
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">User Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">
                  No activities match the current filters.
                </td>
              </tr>
            ) : (
              filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{activity.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{activity.displayedAction}</td> {/* Use displayedAction for display */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{activity.formattedTimestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivityModal;
