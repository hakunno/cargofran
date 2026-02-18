import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../jsfile/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import Sidebar from '../../component/adminstaff/Sidebar';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { logActivity } from "../../modals/StaffActivity.jsx"; 
import { useReactToPrint } from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const storage = getStorage();

const ShipmentInquiryRequests = () => {
  const [inquiries, setInquiries] = useState([]); // Pending Inquiries
  const [historyInquiries, setHistoryInquiries] = useState([]); // Accepted & Rejected Inquiries
  
  const [previewUrls, setPreviewUrls] = useState({});
  const [businessPreviewUrls, setBusinessPreviewUrls] = useState({});
  
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); 
  
  const [packageNumberInput, setPackageNumberInput] = useState('');
  const [inquiryToAccept, setInquiryToAccept] = useState(null); 
  const [zoomedImage, setZoomedImage] = useState(null);
  
  const [adminName, setAdminName] = useState('');
  
  // Refs for Printing
  const tableRef = useRef(); // For Main Pending Table
  const historyTableRef = useRef(); // For History Table

  // Fetch PENDING Inquiries (Main List)
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shipRequests'));
        const inquiryList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        
        // Filter for Pending only
        const activeInquiries = inquiryList.filter(item => 
            item.status !== 'Accepted' && item.status !== 'Rejected'
        );

        const sortedInquiries = activeInquiries.sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime));
        setInquiries(sortedInquiries);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };
    fetchInquiries();
  }, [isHistoryModalOpen, isAcceptModalOpen]); 

  // Fetch HISTORY Inquiries (Accepted OR Rejected)
  useEffect(() => {
    const q = query(collection(db, 'shipRequests'), where("status", "in", ["Accepted", "Rejected"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      list.sort((a, b) => {
        const dateA = a.acceptedAt || a.rejectedAt || a.requestTime;
        const dateB = b.acceptedAt || b.rejectedAt || b.requestTime;
        return new Date(dateB) - new Date(dateA);
      });
      
      setHistoryInquiries(list);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Admin Name for Report
  useEffect(() => {
    const fetchAdminName = async () => {
        const { adminFirstName, adminLastName } = await fetchAdminDetails();
        setAdminName(`${adminFirstName} ${adminLastName}`.trim());
    };
    fetchAdminName();
  }, []);

  // Image Fetching Logic
  useEffect(() => {
    const itemsToLoad = selectedInquiry ? [selectedInquiry] : inquiries;

    const fetchPreviewUrls = async () => {
      const newPackagePreviews = { ...previewUrls };
      const newBusinessPreviews = { ...businessPreviewUrls };
      
      await Promise.all(
        itemsToLoad.map(async (inquiry) => {
            if(!newPackagePreviews[inquiry.id]) {
                const packageUrls = [];
                if (inquiry.packages && Array.isArray(inquiry.packages)) {
                    await Promise.all(
                    inquiry.packages.map(async (pkg) => {
                        let url = null;
                        if (pkg.image) {
                        if (pkg.image.startsWith('https://')) {
                            url = pkg.image; 
                        } else {
                            try {
                            const fileRef = ref(storage, `shipRequests/${inquiry.id}/${pkg.image}`);
                            url = await getDownloadURL(fileRef);
                            } catch (error) {
                            console.error('Error fetching package image:', error);
                            }
                        }
                        }
                        packageUrls.push(url);
                    })
                    );
                }
                newPackagePreviews[inquiry.id] = packageUrls;

                let businessUrl = null;
                if (inquiry.businessPermitImage) {
                    if (inquiry.businessPermitImage.startsWith('https://')) {
                    businessUrl = inquiry.businessPermitImage; 
                    } else {
                    try {
                        const fileRef = ref(storage, `shipRequests/${inquiry.id}/businessPermitImage/${inquiry.businessPermitImage}`);
                        businessUrl = await getDownloadURL(fileRef);
                    } catch (error) {
                        console.error('Error fetching business permit image:', error);
                    }
                    }
                }
                newBusinessPreviews[inquiry.id] = businessUrl;
            }
        })
      );
      setPreviewUrls(newPackagePreviews);
      setBusinessPreviewUrls(newBusinessPreviews);
    };

    if (itemsToLoad.length > 0) {
      fetchPreviewUrls();
    }
  }, [inquiries, selectedInquiry]);

  const fetchAdminDetails = async () => {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      return { adminFirstName: "Unknown", adminLastName: "" };
    }

    let adminFirstName = "";
    let adminLastName = "";

    if (currentAdmin.displayName) {
      const nameParts = currentAdmin.displayName.split(" ");
      adminFirstName = nameParts[0];
      adminLastName = nameParts.slice(1).join(" ");
    } else {
      const adminRef = doc(db, "Users", currentAdmin.uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        adminFirstName = adminData.firstName || "Unknown";
        adminLastName = adminData.lastName || "";
      }
    }
    return { adminFirstName, adminLastName };
  };

  const openAcceptModal = (inquiry) => {
    setInquiryToAccept(inquiry);
    setIsAcceptModalOpen(true);
    setPackageNumberInput('');
  };

  const confirmAcceptWithPackageNumber = async () => {
    if (!packageNumberInput.trim()) {
      toast.warning('Please enter a package number.');
      return;
    }

    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

      const querySnapshot = await getDocs(collection(db, "Packages"));
      const allShipments = querySnapshot.docs.map(doc => doc.data());
      const maxId = allShipments.reduce((max, shipment) => {
        return shipment.customId && shipment.customId > max ? shipment.customId : max;
      }, 0);
      const newCustomId = maxId + 1;

      const newShipment = {
        ...inquiryToAccept, 
        shipperName: inquiryToAccept.name,
        packageNumber: packageNumberInput.trim(),
        customId: newCustomId, 
        dateStarted: new Date().toISOString(),
        createdTime: serverTimestamp(),
        packageStatus: 'Processing',
      };

      delete newShipment.id;
      delete newShipment.status;

      const docRef = await addDoc(collection(db, 'Packages'), newShipment);

      await addDoc(collection(db, 'Packages', docRef.id, 'statusHistory'), {
        status: newShipment.packageStatus,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, 'shipRequests', inquiryToAccept.id), {
        status: 'Accepted',
        acceptedAt: serverTimestamp(),
        packageNumber: packageNumberInput.trim(),
      });
      
      await logActivity(adminFullName, `Accepted shipment inquiry ${inquiryToAccept.id} and created package ${packageNumberInput.trim()}`);

      setInquiries((prev) => prev.filter((i) => i.id !== inquiryToAccept.id));
      
      closeModal();
      setIsAcceptModalOpen(false);
      setInquiryToAccept(null);
      toast.success('Shipment created successfully!');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request. Please try again.');
    }
  };

  const rejectInquiry = async (inquiry) => {
    const confirmReject = window.confirm('Reject this request? This will move it to the Requests History.');
    if (!confirmReject) return;
    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

      await updateDoc(doc(db, 'shipRequests', inquiry.id), {
        status: 'Rejected',
        rejectedAt: serverTimestamp(),
      });

      await logActivity(adminFullName, `Rejected shipment inquiry ${inquiry.id}`);

      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
      closeModal();
      toast.success('Request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request. Please try again.');
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

  // --- CSV EXPORT FUNCTIONS ---
  const escapeCsv = (str) => {
    if (str === null || str === undefined) return "";
    const stringValue = String(str);
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      toast.info("No data to export.");
      return;
    }
    const headers = ["Name", "Email", "Mobile", "Sender Country", "Destination Country", "Transport Mode", "Direction", "Load Type", "Pickup Option", "Request Date"];
    const rows = inquiries.map((item) => [
      item.name, item.email, item.mobile, item.senderCountry, item.destinationCountry, item.transportMode, item.shipmentDirection, item.loadType || "N/A", item.pickupOption, item.requestTime ? new Date(item.requestTime).toLocaleString() : "N/A"
    ]);
    downloadCSV(headers, rows, "shipment_requests_pending");
  };

  const handleHistoryExportCSV = () => {
    if (historyInquiries.length === 0) {
        toast.info("No history data to export.");
        return;
    }
    const headers = ["Name", "Email", "Status", "Date Processed"];
    const rows = historyInquiries.map((item) => {
        const dateProcessed = item.acceptedAt 
            ? new Date(item.acceptedAt.toDate()).toLocaleString() 
            : (item.rejectedAt ? new Date(item.rejectedAt.toDate()).toLocaleString() : 'N/A');
        return [item.name, item.email, item.status, dateProcessed];
    });
    downloadCSV(headers, rows, "shipment_requests_history");
  };

  const downloadCSV = (headers, rows, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + [
        headers.join(","),
        ...rows.map((row) => row.map(escapeCsv).join(","))
    ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PRINT CONFIGURATION ---
  const printStyle = `
    @page { size: landscape; margin: 10mm; }
    @media print {
      body { font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; }
      .print-header { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
      .print-header h2 { text-align: center; font-size: 20px; margin-bottom: 5px; color: #333; }
      .print-header .header-details { display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-top: 5px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
      th, td { border: 1px solid #ddd; padding: 6px; text-align: left; word-wrap: break-word; }
      th { background-color: #f2f2f2; }
      tr { break-inside: auto; page-break-inside: auto; }
      .overflow-x-auto { overflow: visible !important; height: auto !important; }
      .no-print { display: none !important; }
      .prepared-by { margin-top: 30px; text-align: right; font-size: 12px; color: #333; page-break-inside: avoid; }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "Shipment Inquiry Reports - Pending",
    pageStyle: printStyle,
  });

  const handleHistoryPrint = useReactToPrint({
    contentRef: historyTableRef,
    documentTitle: "Shipment Inquiry Reports - History",
    pageStyle: printStyle,
  });

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-center flex-1">Shipment Inquiry Requests</h2>
            <button 
                onClick={() => setIsHistoryModalOpen(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition font-semibold"
            >
                Requests History
            </button>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-center text-gray-700">No pending requests available.</p>
        ) : (
          <div ref={tableRef} className="bg-white shadow rounded-lg p-4 print-section">
            
            {/* PRINT HEADER */}
            <div className="print-header hidden print:block">
                <h2 className="text-2xl font-bold text-gray-900 text-center">SHIPMENT INQUIRY REPORTS</h2>
                <div className="header-details">
                    <span>Date: {currentDate}</span>
                    <span>Status: Pending</span>
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border border-gray-300">Name</th>
                    <th className="p-2 border border-gray-300">Sender Country</th>
                    <th className="p-2 border border-gray-300">Destination Country</th>
                    <th className="p-2 border border-gray-300">Transport Mode</th>
                    <th className="p-2 border border-gray-300">Shipment Direction</th>
                    <th className="p-2 border border-gray-300">Request Date</th>
                    <th className="p-2 border border-gray-300 no-print">Actions</th>
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
                        {inquiry.requestTime ? new Date(inquiry.requestTime).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-2 border border-gray-300 no-print">
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

            {/* PRINT FOOTER */}
            <div className="prepared-by hidden print:block">
                <p>Prepared by: {adminName.toUpperCase()}</p>
            </div>
          </div>
        )}

        {/* BOTTOM RIGHT EXPORT/PRINT ACTIONS (PENDING) */}
        <div className="mt-4 flex justify-end gap-3 no-print">
            <button 
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold"
            >
                Export CSV
            </button>
            <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
            >
                Print Table
            </button>
        </div>
      </div>

      {/* DETAIL MODAL (Is z-50) */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
                Request Details {selectedInquiry.status === 'Rejected' && <span className="text-red-500">(Rejected)</span>}
                {selectedInquiry.status === 'Accepted' && <span className="text-green-500">(Accepted)</span>}
            </h3>
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
                            className="w-64 h-auto object-contain border border-gray-300 rounded cursor-pointer"
                            onClick={() => setZoomedImage(previewUrls[selectedInquiry.id][idx])}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No packages available.</p>
              )}

              <hr className="my-4" />

              <h4 className="text-lg font-semibold">Business Permit Image:</h4>
              {businessPreviewUrls[selectedInquiry.id] ? (
                <div className="mt-2">
                  <img
                    src={businessPreviewUrls[selectedInquiry.id]}
                    alt="Business Permit Image"
                    className="w-64 h-auto object-contain border border-gray-300 rounded cursor-pointer"
                    onClick={() => setZoomedImage(businessPreviewUrls[selectedInquiry.id])}
                  />
                </div>
              ) : (
                <p>None</p>
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
                {selectedInquiry.status !== 'Rejected' && selectedInquiry.status !== 'Accepted' && (
                    <>
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
                    </>
                )}
              
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

      {/* REQUESTS HISTORY MODAL (Changed to z-40 so it is behind Details Modal) */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-5xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Requests History</h3>
                    <button 
                        onClick={() => setIsHistoryModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                    >
                        ✕
                    </button>
                </div>
                
                <div ref={historyTableRef} className="print-section">
                    
                    {/* HISTORY PRINT HEADER */}
                    <div className="print-header hidden print:block">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">SHIPMENT INQUIRY REPORTS</h2>
                        <div className="header-details">
                            <span>Date: {currentDate}</span>
                            <span>Status: History (Accepted/Rejected)</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                <th className="p-2 border border-gray-300">Name</th>
                                <th className="p-2 border border-gray-300">Email</th>
                                <th className="p-2 border border-gray-300">Status</th>
                                <th className="p-2 border border-gray-300">Date Processed</th>
                                <th className="p-2 border border-gray-300 no-print">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyInquiries.length > 0 ? (
                                    historyInquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className="text-center hover:bg-gray-50">
                                            <td className="p-2 border border-gray-300">{inquiry.name}</td>
                                            <td className="p-2 border border-gray-300">{inquiry.email}</td>
                                            <td className="p-2 border border-gray-300">
                                                {inquiry.status === 'Accepted' ? (
                                                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-semibold">Accepted</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs font-semibold">Rejected</span>
                                                )}
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                                {inquiry.acceptedAt 
                                                    ? new Date(inquiry.acceptedAt.toDate()).toLocaleString() 
                                                    : (inquiry.rejectedAt ? new Date(inquiry.rejectedAt.toDate()).toLocaleString() : 'N/A')
                                                }
                                            </td>
                                            <td className="p-2 border border-gray-300 no-print">
                                                <button
                                                    onClick={() => openModal(inquiry)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    View Info
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center">No history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* HISTORY PRINT FOOTER */}
                    <div className="prepared-by hidden print:block">
                        <p>Prepared by: {adminName.toUpperCase()}</p>
                    </div>
                </div>

                {/* BOTTOM RIGHT EXPORT/PRINT ACTIONS (HISTORY) */}
                <div className="mt-4 flex justify-end gap-3 no-print">
                    <button 
                        onClick={handleHistoryExportCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold"
                    >
                        Export CSV
                    </button>
                    <button 
                        onClick={handleHistoryPrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                    >
                        Print Table
                    </button>
                    <button
                        onClick={() => setIsHistoryModalOpen(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 cursor-pointer no-print"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed Image"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}

      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
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