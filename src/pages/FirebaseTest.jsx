import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../jsfile/firebase';

export default function DeliverTrack() {
  const [deliveries, setDeliveries] = useState([]);
  const [newDelivery, setNewDelivery] = useState({ driver: '', status: '', trackingNumber: '' });
  const [packageId, setPackageId] = useState(1);

  useEffect(() => {
    // Real-time listener to fetch data from Firestore
    const unsubscribe = onSnapshot(collection(db, 'DeliverTrack'), (snapshot) => {
      const deliveriesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Set deliveries and auto-increment package ID
      setDeliveries(deliveriesList);
      if (deliveriesList.length > 0) {
        const highestPackageId = Math.max(...deliveriesList.map(d => d.autoIncrementId || 0));
        setPackageId(highestPackageId + 1);
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const handleAddDelivery = async () => {
    if (newDelivery.driver && newDelivery.status && newDelivery.trackingNumber) {
      await addDoc(collection(db, 'DeliverTrack'), {
        driver: newDelivery.driver,
        status: newDelivery.status,
        trackingNumber: newDelivery.trackingNumber,
        autoIncrementId: packageId,
        timestamp: serverTimestamp()
      });

      // Reset form and increment package ID
      setNewDelivery({ driver: '', status: '', trackingNumber: '' });
      setPackageId(packageId + 1);
    }
  };

  const handleUpdateDelivery = async (id) => {
    const newStatus = prompt('Enter new status:');
    if (newStatus) {
      const deliveryRef = doc(db, 'DeliverTrack', id);
      await updateDoc(deliveryRef, { status: newStatus });
    }
  };

  const handleDeleteDelivery = async (id) => {
    const deliveryRef = doc(db, 'DeliverTrack', id);
    await deleteDoc(deliveryRef);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Delivery Tracking System</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Driver Name"
          value={newDelivery.driver}
          onChange={(e) => setNewDelivery({ ...newDelivery, driver: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Status"
          value={newDelivery.status}
          onChange={(e) => setNewDelivery({ ...newDelivery, status: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Tracking Number"
          value={newDelivery.trackingNumber}
          onChange={(e) => setNewDelivery({ ...newDelivery, trackingNumber: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddDelivery} className="bg-blue-500 text-white p-2">
          Add Delivery
        </button>
      </div>

      {/* Delivery List */}
      <ul>
        {deliveries.map(delivery => (
          <li key={delivery.id} className="border-b p-2 flex justify-between">
            <div>
              <p><strong>Driver:</strong> {delivery.driver}</p>
              <p><strong>Status:</strong> {delivery.status}</p>
              <p><strong>Tracking #:</strong> {delivery.trackingNumber}</p>
              <p><strong>Package ID:</strong> {delivery.autoIncrementId}</p>
              <p><strong>Timestamp:</strong> {delivery.timestamp?.toDate().toString()}</p>
            </div>
            <div>
              <button
                onClick={() => handleUpdateDelivery(delivery.id)}
                className="text-yellow-500 mr-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteDelivery(delivery.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
