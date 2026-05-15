import React, { useState } from "react";
import { db } from "../jsfile/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
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
        where("packageNumber", "==", packageNumber),
        limit(1)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Francess Logistic Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Track Your Shipment</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Enter your shipment number to get the latest status and history of your cargo.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-[-2rem] relative z-10 p-6 md:p-10 bg-white rounded-2xl mb-10 drop-shadow-xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Shipment Status</h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Shipment Number"
            value={packageNumber}
            onChange={(e) => setPackageNumber(e.target.value)}
            className="w-full sm:flex-1 px-6 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-all font-semibold text-lg"
          >
            {loading ? 'Searching...' : '🔍 Track'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {shipment && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Package Details</h3>

            <div className="space-y-2 mb-6">
              <p><span className="font-semibold">Shipment Number:</span> {shipment.packageNumber}</p>
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
    </div>
  );
};

export default TrackPackage;