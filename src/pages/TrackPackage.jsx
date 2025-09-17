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

      const docSnap = querySnapshot.docs[0];
      const packageData = { id: docSnap.id, ...docSnap.data() };
      setShipment(packageData);

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
    <div className="max-w-4xl mx-auto mt-5 p-10 bg-gray-50 rounded-lg mb-10 drop-shadow-[0px_2px_5px_rgba(0,0,0,1)] shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Status</h2>

      <div className="flex flex-col sm:flex-row items-center mb-10 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Package Number"
          value={packageNumber}
          onChange={(e) => setPackageNumber(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {shipment && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Package Details</h3>

          <div className="space-y-2 mb-6">
            <p><span className="font-semibold">Package Number:</span> {shipment.packageNumber}</p>
            <p><span className="font-semibold">From:</span> {shipment.senderCountry || 'N/A'}</p>
            <p><span className="font-semibold">To:</span> {shipment.destinationCountry || 'N/A'}</p>
            <p><span className="font-semibold">Current Status:</span> {shipment.packageStatus}</p>
            <p><span className="font-semibold">Airway Bill:</span> {shipment.airwayBill || 'N/A'}</p>
          </div>

          <h4 className="text-lg font-medium text-gray-600 mb-3">Status History</h4>

          {statusHistory.length > 0 ? (
            <ul className="pl-0! space-y-2">
              {statusHistory.map((entry) => (
                <li key={entry.id} className="flex justify-between bg-gray-200 p-3 rounded">
                  <span>{entry.status}</span>
                  <span className="text-sm text-gray-500">
                    {entry.timestamp?.toDate
                      ? entry.timestamp.toDate().toLocaleString()
                      : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No status history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackPackage;