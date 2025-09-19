import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../jsfile/firebase";

// Utility function to log activities (for both staff and admin)
// Call this function wherever an action occurs in your app, e.g.:
// logActivity("Admin User", "Updated user profile");
// logActivity("Staff Member", "Approved request");
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
      const activityList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        formattedTimestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toLocaleString() : "N/A",
      }));
      setActivities(activityList);
    });

    return () => unsubscribe();
  }, [show]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.userName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // If no filters selected, show all
      if (Object.values(filters).every((f) => !f)) return true;

      let matchesFilter = false;
      if (filters.edited && activity.action.includes("Edited")) matchesFilter = true;
      if (filters.delivered && (activity.action.includes("Delivered") || activity.action.includes("Done"))) matchesFilter = true;
      if (filters.canceled && activity.action.includes("Canceled")) matchesFilter = true;
      if (filters.acceptedMessage && activity.action.includes("Approved conversation")) matchesFilter = true;
      if (filters.acceptedShipment && activity.action.includes("Accepted shipment")) matchesFilter = true;

      return matchesFilter;
    });
  }, [activities, searchQuery, filters]);

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      edited: false,
      delivered: false,
      canceled: false,
      acceptedMessage: false,
      acceptedShipment: false,
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Activity Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by user name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          <div className="d-flex flex-wrap gap-2">
            <Form.Check
              type="checkbox"
              label="Edited"
              checked={filters.edited}
              onChange={() => handleFilterChange('edited')}
              className="me-2"
            />
            <Form.Check
              type="checkbox"
              label="Delivered"
              checked={filters.delivered}
              onChange={() => handleFilterChange('delivered')}
              className="me-2"
            />
            <Form.Check
              type="checkbox"
              label="Canceled"
              checked={filters.canceled}
              onChange={() => handleFilterChange('canceled')}
              className="me-2"
            />
            <Form.Check
              type="checkbox"
              label="Accepted Message"
              checked={filters.acceptedMessage}
              onChange={() => handleFilterChange('acceptedMessage')}
              className="me-2"
            />
            <Form.Check
              type="checkbox"
              label="Accepted Shipment"
              checked={filters.acceptedShipment}
              onChange={() => handleFilterChange('acceptedShipment')}
              className="me-2"
            />
          </div>
          {(searchQuery || Object.values(filters).some((f) => f)) && (
            <Button variant="outline-secondary" size="sm" onClick={clearFilters} className="mt-2">
              Clear Filters
            </Button>
          )}
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.userName}</td>
                <td>{activity.action}</td>
                <td>{activity.formattedTimestamp}</td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">No activities match the filters.</td>
              </tr>
            )}
          </tbody>
        </Table>
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