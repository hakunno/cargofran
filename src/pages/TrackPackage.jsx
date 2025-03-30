import React, { useState } from "react";
import { db } from "../jsfile/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const TrackPackage = () => {
  const [packageNumber, setPackageNumber] = useState("");
  const [shipment, setShipment] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setShipment(null);
    setStatusHistory([]);
    try {
      // Query the Packages collection by packageNumber.
      const q = query(
        collection(db, "Packages"),
        where("packageNumber", "==", packageNumber)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("Package not found.");
        setLoading(false);
        return;
      }
      // Assume package numbers are unique and take the first document.
      const docSnap = querySnapshot.docs[0];
      const packageData = { id: docSnap.id, ...docSnap.data() };
      setShipment(packageData);

      // Query the statusHistory subcollection and order by timestamp (oldest first).
      const historyQuery = query(
        collection(db, "Packages", docSnap.id, "statusHistory"),
        orderBy("timestamp", "asc")
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyData = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStatusHistory(historyData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error retrieving package data.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Track Package</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Package Number"
          value={packageNumber}
          onChange={(e) => setPackageNumber(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button
          onClick={handleSearch}
          style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
        >
          Track
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {shipment && (
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Package Details</h3>
          <p>
            <strong>Package Number:</strong> {shipment.packageNumber}
          </p>
          <p>
            <strong>From:</strong> {shipment.from}
          </p>
          <p>
            <strong>Current Status:</strong> {shipment.packageStatus}
          </p>
          <p>
            <strong>Location:</strong> {shipment.destination}
          </p>
          <p>
            <strong>Airway Bill:</strong>{" "}
            {shipment.airwayBill ? shipment.airwayBill : "N/A"}
          </p>

          <h4>Status History</h4>
          {statusHistory.length > 0 ? (
            <ul>
              {statusHistory.map((entry) => (
                <li key={entry.id}>
                  <strong>Status:</strong> {entry.status} -{" "}
                  <strong>Time:</strong>{" "}
                  {entry.timestamp?.toDate
                    ? entry.timestamp.toDate().toLocaleString()
                    : "Pending"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No status history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackPackage;
