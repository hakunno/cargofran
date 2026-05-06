import React, { useState, useEffect, useRef } from 'react';
import { useConfirm } from '../../component/ConfirmModal';
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
import { useAdminNotifications } from "../../hooks/useAdminNotifications";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const storage = getStorage();

const ShipmentInquiryRequests = () => {
  const [confirm, ConfirmUI] = useConfirm();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isHistoryPrinting, setIsHistoryPrinting] = useState(false);

  const [adminName, setAdminName] = useState('');

  // Refs for Printing
  const tableRef = useRef(); // For Main Pending Table
  const historyTableRef = useRef(); // For History Table

  // Fetch PENDING Inquiries (Main List)
  const { markAsSeen } = useAdminNotifications();
  useEffect(() => {
    markAsSeen('shipmentRequests');
    return () => markAsSeen(null);
  }, [markAsSeen]);

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
          if (!newPackagePreviews[inquiry.id]) {
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
    if (isSubmitting) return;

    if (!packageNumberInput.trim()) {
      toast.warning('Please enter a package number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // --- NEW: Uniqueness Check ---
      const checkQuery = query(
        collection(db, "Packages"),
        where("packageNumber", "==", packageNumberInput.trim())
      );
      const checkSnapshot = await getDocs(checkQuery);

      if (!checkSnapshot.empty) {
        toast.error(`A shipment with tracking number "${packageNumberInput.trim()}" already exists!`);
        setIsSubmitting(false);
        return; // Stop execution
      }

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

      // --- NEW: Generate User Notification ---
      if (inquiryToAccept.userUid) {
        try {
          // 1. Notification
          await addDoc(collection(db, 'userNotifications'), {
            userId: inquiryToAccept.userUid,
            title: 'Shipment Request Accepted',
            message: `Your shipment request has been accepted. Tracking #: ${packageNumberInput.trim()}`,
            read: false,
            createdAt: serverTimestamp(),
            relatedId: docRef.id,
            type: 'shipment_update'
          });

          // Note: Shipment Conversation Thread is no longer automatically created here
          // as per admin request to handle it manually later.
        } catch (automationErr) {
          console.error("Failed to generate user notification:", automationErr);
        }
      }

      await logActivity(adminFullName, `Accepted shipment inquiry ${inquiryToAccept.id} and created package ${packageNumberInput.trim()}`);

      setInquiries((prev) => prev.filter((i) => i.id !== inquiryToAccept.id));

      closeModal();
      setIsAcceptModalOpen(false);
      setInquiryToAccept(null);
      toast.success('Shipment created successfully!');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectInquiry = async (inquiry) => {
    const ok = await confirm({
      title: "Reject Request?",
      message: "This request will be moved to the Requests History and the customer will be notified.",
      variant: "danger",
      confirmLabel: "Reject",
    });
    if (!ok) return;
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
  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "Shipment Inquiry Reports - Pending",
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `
      @page { size: landscape; margin: 12mm 14mm; }
      @media print {
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-section { width: 100% !important; box-shadow: none !important; border-radius: 0 !important; background: #fff !important; padding: 0 !important; border: none !important; }
        .print-header { display: block !important; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #000; text-align: center; }
        .print-header h2 { font-size: 14pt; font-weight: bold; margin: 0 0 2px 0; text-align: center; }
        .print-header .subtitle { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px 0; color: #555; }
        .print-header .narrative { font-size: 8pt; margin: 4px 0; line-height: 1.4; }
        .print-header .meta { display: flex; justify-content: space-between; font-size: 7pt; color: #555; margin-top: 3px; }
        table { width: 100% !important; border-collapse: collapse !important; font-size: 7.5pt; table-layout: auto; page-break-inside: auto; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th { background-color: #e8e8e8 !important; font-weight: 700; color: #000 !important; text-transform: uppercase; font-size: 6.5pt; letter-spacing: 0.04em; padding: 5px 6px; border: 1px solid #000 !important; text-align: left; }
        td { border: 1px solid #000 !important; padding: 4px 6px; vertical-align: middle; color: #000 !important; background-color: #fff !important; font-size: 7.5pt; }
        tr:nth-child(even) td { background-color: #f5f5f5 !important; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; width: 100% !important; }
        .no-print { display: none !important; }
        .print-footer { position: fixed; bottom: 10mm; left: 12mm; right: 12mm; padding-top: 6px; border-top: 1px solid #ccc; display: flex !important; justify-content: space-between; font-size: 7pt; color: #666; }
      }
    `,
  });

  const handleHistoryPrint = useReactToPrint({
    contentRef: historyTableRef,
    documentTitle: "Shipment Inquiry Reports - History",
    onBeforeGetContent: () => {
      setIsHistoryPrinting(true);
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onAfterPrint: () => setIsHistoryPrinting(false),
    pageStyle: `
      @page { size: landscape; margin: 12mm 14mm; }
      @page { size: landscape; margin: 12mm 14mm; }
      @media print {
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-section { width: 100% !important; box-shadow: none !important; border-radius: 0 !important; background: #fff !important; padding: 0 !important; border: none !important; }
        .print-header { display: block !important; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #000; text-align: center; }
        .print-header h2 { font-size: 14pt; font-weight: bold; margin: 0 0 2px 0; text-align: center; }
        .print-header .subtitle { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px 0; color: #555; }
        .print-header .narrative { font-size: 8pt; margin: 4px 0; line-height: 1.4; }
        .print-header .meta { display: flex; justify-content: space-between; font-size: 7pt; color: #555; margin-top: 3px; }
        table { width: 100% !important; border-collapse: collapse !important; font-size: 7.5pt; table-layout: auto; page-break-inside: auto; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th { background-color: #e8e8e8 !important; font-weight: 700; color: #000 !important; text-transform: uppercase; font-size: 6.5pt; letter-spacing: 0.04em; padding: 5px 6px; border: 1px solid #000 !important; text-align: left; }
        td { border: 1px solid #000 !important; padding: 4px 6px; vertical-align: middle; color: #000 !important; background-color: #fff !important; font-size: 7.5pt; }
        tr:nth-child(even) td { background-color: #f5f5f5 !important; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; width: 100% !important; }
        .no-print { display: none !important; }
        .print-footer { display: none !important; }
      }
    `,
  });

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {ConfirmUI}
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64">

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
          <div ref={tableRef} className="border-3 border-black bg-white shadow-lg rounded-xl overflow-hidden print-section">

            {/* PRINT HEADER */}
            <div className="print-header hidden print:block">
              <h2>Shipment Inquiry Report</h2>
              <p className="subtitle">Logistics Management System</p>
              <p className="narrative">This report lists all pending shipment inquiry requests awaiting review and action. Printed on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
              <div className="meta">
                <span>Status: <strong>Pending</strong></span>
                <span>Printed: {currentDate}</span>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              {/* 1. SCREEN TABLE (Paginated/Limited, Hidden in Print) */}
              <table className="min-w-full border-collapse no-print">
                <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-black">
                  <tr>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">ID</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Name</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Sender Country</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Destination Country</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Transport Mode</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Shipment Direction</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Request Date</th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200 no-print text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {inquiries.map((inquiry, index) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{inquiry.name}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{inquiry.senderCountry}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{inquiry.destinationCountry}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">{inquiry.transportMode}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{inquiry.shipmentDirection}</td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.requestTime ? new Date(inquiry.requestTime).toLocaleString() : 'N/A'}
                      </td>
                      <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900 no-print text-center">
                        <button
                          onClick={() => openModal(inquiry)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 2. PRINT TABLE (Full Data, Hidden on Screen) */}
              <table className="hidden print:table min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">ID</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Name</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Origin</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Destination</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Mode</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Direction</th>
                    <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Request Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry, index) => (
                    <tr key={`print-${inquiry.id}`}>
                      <td className="border border-black px-2 py-1 text-[7.5pt]">{index + 1}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt] font-bold">{inquiry.name}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt]">{inquiry.senderCountry}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt]">{inquiry.destinationCountry}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt] capitalize">{inquiry.transportMode}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt]">{inquiry.shipmentDirection}</td>
                      <td className="border border-black px-2 py-1 text-[7.5pt]">
                        {inquiry.requestTime ? new Date(inquiry.requestTime).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRINT FOOTER */}
            <div className="print-footer hidden print:flex">
              <span>Produced by: <strong>{adminName.toUpperCase()}</strong></span>
              <span>Date: {currentDate}</span>
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

            <div ref={historyTableRef} className="border-3 border-black bg-white shadow-lg rounded-xl overflow-hidden print-section">

              {/* HISTORY PRINT HEADER */}
              <div className="print-header hidden print:block">
                <h2>Shipment Inquiry Report — History</h2>
                <p className="subtitle">Logistics Management System</p>
                <p className="narrative">This report contains a history of all processed shipment inquiry requests (Accepted / Rejected). Printed on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                <div className="meta">
                  <span>Status: <strong>History (Accepted / Rejected)</strong></span>
                  <span>Printed: {currentDate}</span>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
                {/* 1. SCREEN TABLE (History) */}
                <table className="min-w-full border-collapse no-print">
                  <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-black">
                    <tr>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">ID</th>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Name</th>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Email</th>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Status</th>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200">Date Processed</th>
                      <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-200 no-print text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {historyInquiries.length > 0 ? (
                      historyInquiries.map((inquiry, index) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{inquiry.name}</td>
                          <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">{inquiry.email}</td>
                          <td className="border border-black px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inquiry.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {inquiry.status}
                            </span>
                          </td>
                          <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {inquiry.acceptedAt
                              ? new Date(inquiry.acceptedAt.toDate()).toLocaleString()
                              : (inquiry.rejectedAt ? new Date(inquiry.rejectedAt.toDate()).toLocaleString() : 'N/A')
                            }
                          </td>
                          <td className="border border-black px-4 py-3 whitespace-nowrap text-sm text-gray-900 no-print text-center">
                            <button
                              onClick={() => openModal(inquiry)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition font-semibold"
                            >
                              View Info
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-4 text-center">No history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* 2. PRINT TABLE (History Full) */}
                <table className="hidden print:table min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">ID</th>
                      <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Name</th>
                      <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Email</th>
                      <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Status</th>
                      <th className="border border-black px-2 py-2 text-left text-[7pt] uppercase bg-gray-100">Date Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyInquiries.map((inquiry, index) => (
                      <tr key={`print-hist-${inquiry.id}`}>
                        <td className="border border-black px-2 py-1 text-[7.5pt]">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-[7.5pt] font-bold">{inquiry.name}</td>
                        <td className="border border-black px-2 py-1 text-[7.5pt]">{inquiry.email}</td>
                        <td className="border border-black px-2 py-1 text-[7.5pt] uppercase">{inquiry.status}</td>
                        <td className="border border-black px-2 py-1 text-[7.5pt]">
                          {inquiry.acceptedAt
                            ? new Date(inquiry.acceptedAt.toDate()).toLocaleDateString()
                            : (inquiry.rejectedAt ? new Date(inquiry.rejectedAt.toDate()).toLocaleDateString() : 'N/A')
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* HISTORY PRINT FOOTER */}
              <div className="print-footer hidden print:flex">
                <span>Produced by: <strong>{adminName.toUpperCase()}</strong></span>
                <span>Date: {currentDate}</span>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 no-print">
          <div className="bg-white rounded-lg p-6 shadow-xl w-11/12 max-w-sm text-center">
            <h4 className="text-xl font-bold mb-4">Accept Request</h4>
            <p className="mb-4 text-gray-700">Enter a package number for this shipment.</p>
            <input
              type="text"
              placeholder="Package Number"
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={packageNumberInput}
              onChange={(e) => setPackageNumberInput(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptWithPackageNumber}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Accepting..." : "Confirm & Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentInquiryRequests;
