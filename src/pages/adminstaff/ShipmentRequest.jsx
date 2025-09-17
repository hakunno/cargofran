import React, { useState, useEffect } from 'react';
import { db } from '../../jsfile/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Sidebar from '../../component/adminstaff/Sidebar';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

const ShipmentInquiryRequests = () => {
  const [inquiries, setInquiries] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [packageNumberInput, setPackageNumberInput] = useState('');
  const [inquiryToAccept, setInquiryToAccept] = useState(null); 

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shipRequests'));
        const inquiryList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setInquiries(inquiryList);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };
    fetchInquiries();
  }, []);

  useEffect(() => {
    const fetchPreviewUrls = async () => {
      const newPreviews = {};
      await Promise.all(
        inquiries.map(async (inquiry) => {
          const urls = [];
          if (inquiry.packages && Array.isArray(inquiry.packages)) {
            await Promise.all(
              inquiry.packages.map(async (pkg) => {
                if (pkg.image) {
                  try {
                    const fileRef = ref(storage, `shipRequests/${inquiry.id}/${pkg.image}`);
                    const url = await getDownloadURL(fileRef);
                    urls.push(url);
                  } catch (error) {
                    console.error('Error fetching image for package', error);
                    urls.push(null);
                  }
                } else {
                  urls.push(null);
                }
              })
            );
          }
          newPreviews[inquiry.id] = urls;
        })
      );
      setPreviewUrls(newPreviews);
    };
    if (inquiries.length > 0) {
      fetchPreviewUrls();
    }
  }, [inquiries]);

  const openAcceptModal = (inquiry) => {
    setInquiryToAccept(inquiry);
    setIsAcceptModalOpen(true);
    setPackageNumberInput('');
  };

  const confirmAcceptWithPackageNumber = async () => {
    if (!packageNumberInput.trim()) {
      alert('Please enter a package number.');
      return;
    }

    try {
      // Step 1: Get all current shipments to calculate the next customId
      const querySnapshot = await getDocs(collection(db, "Packages"));
      const allShipments = querySnapshot.docs.map(doc => doc.data());
      const maxId = allShipments.reduce((max, shipment) => {
        return shipment.customId && shipment.customId > max ? shipment.customId : max;
      }, 0);
      const newCustomId = maxId + 1;

      // Step 2: Prepare the new shipment
      const newShipment = {
        ...inquiryToAccept, // ✅ spread first, so we can safely overwrite anything after
        shipperName: inquiryToAccept.name,
        packageNumber: packageNumberInput.trim(),
        customId: newCustomId, // ✅ this now overwrites the one from the inquiry
        dateStarted: new Date().toISOString(),
        createdTime: serverTimestamp(),
        packageStatus: 'Processing',
      };

      delete newShipment.id;
      delete newShipment.status;

      // Step 3: Add to Packages collection
      const docRef = await addDoc(collection(db, 'Packages'), newShipment);

      // Step 4: Add to statusHistory
      await addDoc(collection(db, 'Packages', docRef.id, 'statusHistory'), {
        status: newShipment.packageStatus,
        timestamp: serverTimestamp(),
      });

      // Step 5: Mark the inquiry as accepted
      await updateDoc(doc(db, 'shipRequests', inquiryToAccept.id), {
        status: 'Accepted',
        acceptedAt: serverTimestamp(),
      });

      alert(`Shipment created!`);
      setInquiries((prev) => prev.filter((i) => i.id !== inquiryToAccept.id));
      setPreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[inquiryToAccept.id];
        return updated;
      });

      await deleteDoc(doc(db, 'shipRequests', inquiryToAccept.id));

      closeModal();
      setIsAcceptModalOpen(false);
      setInquiryToAccept(null);
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const rejectInquiry = async (inquiry) => {
    const confirmReject = window.confirm('Reject this request? This will delete it permanently.');
    if (!confirmReject) return;
    try {
      await deleteDoc(doc(db, 'shipRequests', inquiry.id));
      alert('Request rejected and deleted.');
      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
      setPreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[inquiry.id];
        return updated;
      });
      closeModal();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInquiry(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Shipment Requests</h2>
        {inquiries.length === 0 ? (
          <p className="text-center text-gray-700">No requests available.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border border-gray-300">Name</th>
                  <th className="p-2 border border-gray-300">Sender Country</th>
                  <th className="p-2 border border-gray-300">Destination Country</th>
                  <th className="p-2 border border-gray-300">Transport Mode</th>
                  <th className="p-2 border border-gray-300">Shipment Direction</th>
                  <th className="p-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="text-center hover:bg-gray-50">
                    <td className="p-2 border border-gray-300">{inquiry.name}</td>
                    <td className="p-2 border border-gray-300">{inquiry.senderCountry}</td>
                    <td className="p-2 border border-gray-300">{inquiry.destinationCountry}</td>
                    <td className="p-2 border border-gray-300">{inquiry.transportMode}</td>
                    <td className="p-2 border border-gray-300">{inquiry.shipmentDirection}</td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex flex-col md:flex-row gap-2 justify-center">
                        <button
                          onClick={() => openModal(inquiry)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Request Details</h3>
            <div className="space-y-3 text-gray-800">
              <p><strong>Name:</strong> {selectedInquiry.name}</p>
              <p><strong>Email:</strong> {selectedInquiry.email}</p>
              <p><strong>Mobile:</strong> {selectedInquiry.mobile}</p>
              <p><strong>Sender Country:</strong> {selectedInquiry.senderCountry}</p>
              <p><strong>Destination Country:</strong> {selectedInquiry.destinationCountry}</p>
              <p><strong>Destination Address:</strong> {selectedInquiry.destinationAddress}</p>
              <p><strong>Transport Mode:</strong> {selectedInquiry.transportMode}</p>
              <p><strong>Shipment Direction:</strong> {selectedInquiry.shipmentDirection}</p>
              {selectedInquiry.loadType && <p><strong>Load Type:</strong> {selectedInquiry.loadType}</p>}
              <p><strong>Pickup Option:</strong> {selectedInquiry.pickupOption === 'needPickup' ? 'Need Pickup' : 'Deliver to Warehouse'}</p>

              {selectedInquiry.pickupOption === 'needPickup' && selectedInquiry.pickupAddress && (
                <>
                  <p><strong>Region:</strong> {selectedInquiry.pickupAddress.region}</p>
                  <p><strong>Province:</strong> {selectedInquiry.pickupAddress.province}</p>
                  <p><strong>City:</strong> {selectedInquiry.pickupAddress.city}</p>
                  <p><strong>Barangay:</strong> {selectedInquiry.pickupAddress.barangay}</p>
                  <p><strong>Detailed Address:</strong> {selectedInquiry.pickupAddress.detailedAddress}</p>
                </>
              )}

              <hr className="my-4" />

              <h4 className="text-lg font-semibold">Packages:</h4>
              {selectedInquiry.packages && Array.isArray(selectedInquiry.packages) ? (
                selectedInquiry.packages.map((pkg, idx) => {
                  const isFullLoad = selectedInquiry.loadType === 'FCL' || selectedInquiry.loadType === 'FTL';
                  return (
                    <div key={idx} className="mb-4 border-b pb-2">
                      <p><strong>Package {idx + 1}:</strong></p>
                      {!isFullLoad ? (
                        <p>
                          Dimensions: {pkg.length} x {pkg.width} x {pkg.height} cm, Weight: {pkg.weight} kg
                        </p>
                      ) : (
                        <p>Total Weight: {pkg.weight} kg</p>
                      )}
                      <p>Contents: {pkg.contents || 'N/A'}</p>
                      {previewUrls[selectedInquiry.id]?.[idx] && (
                        <div className="mt-2">
                          <img
                            src={previewUrls[selectedInquiry.id][idx]}
                            alt={`Package ${idx + 1} Image`}
                            className="w-64 h-auto object-contain border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No packages available.</p>
              )}

              <p>
                <strong>Additional Services:</strong>{' '}
                {Object.keys(selectedInquiry.additionalServices || {})
                  .filter((key) => selectedInquiry.additionalServices[key])
                  .join(', ') || 'None'}
              </p>

              <p><strong>Request Time:</strong> {selectedInquiry.requestTime ? new Date(selectedInquiry.requestTime).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-2 justify-center">
              <button
                onClick={() => openAcceptModal(selectedInquiry)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => rejectInquiry(selectedInquiry)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Enter Package Number</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Package Number"
              value={packageNumberInput}
              onChange={(e) => setPackageNumberInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAcceptModalOpen(false);
                  setInquiryToAccept(null);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptWithPackageNumber}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentInquiryRequests;