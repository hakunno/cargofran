import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../jsfile/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import Sidebar from "../../component/adminstaff/Sidebar";
import countryList from 'react-select-country-list';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import AddressSelector from '../AddressSelector'; // Adjust path if necessary

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false); // new Info modal state
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({
    packageNumber: "",
    shipperName: "",
    senderCountry: "",
    destinationCountry: "",
    destinationAddress: "",
    transportMode: "",
    shipmentDirection: "",
    loadType: "",
    mobile: "",
    email: "",
    pickupOption: "deliverToWarehouse",
    pickupRegion: "",
    pickupProvince: "",
    pickupCity: "",
    pickupBarangay: "",
    pickupDetailedAddress: "",
    packages: [{
      length: "",
      width: "",
      height: "",
      weight: "",
      contents: "",
      image: null,
    }],
    additionalServices: {
      documentation: false,
      customsClearance: false,
      brokerage: false,
      consolidation: false,
    },
    packageStatus: "Processing",
    paid: false,
    airwayBill: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("customId");
  const [sortOrder, setSortOrder] = useState("asc");
  const [view, setView] = useState("all");
  const location = useLocation();

  const countries = useMemo(() => countryList().getData(), []);

  const LOAD_OPTIONS = {
    Sea: [
      { value: 'FCL', label: 'Full Container Load (FCL)' },
      { value: 'LCL', label: 'Less than Container Load (LCL)' },
    ],
    Road: [
      { value: 'FTL', label: 'Full Truckload (FTL)' },
      { value: 'LTL', label: 'Less than Truckload (LTL)' },
    ],
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setView(params.get('view') || 'all');
  }, [location]);

  // Info modal data
  const [infoHistory, setInfoHistory] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      const querySnapshot = await getDocs(collection(db, "Packages"));
      const shipmentsList = querySnapshot.docs.map((docSnap) => ({
        customId: docSnap.data().customId,
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      setShipments(shipmentsList);
    };
    fetchShipments();
  }, []);

  useEffect(() => {
    if (formData.senderCountry === formData.destinationCountry && formData.senderCountry !== '') {
      setFormData((prev) => ({ ...prev, shipmentDirection: 'Domestic' }));
    } else if (formData.shipmentDirection === 'Domestic') {
      setFormData((prev) => ({ ...prev, shipmentDirection: '' }));
    }
    if (formData.senderCountry !== formData.destinationCountry && formData.transportMode === 'Road') {
      setFormData((prev) => ({ ...prev, transportMode: '' }));
    }
  }, [formData.senderCountry, formData.destinationCountry]);

  // when transport mode changes, reset loadType if invalid
  useEffect(() => {
    if (!formData.transportMode) return;
    if (!LOAD_OPTIONS[formData.transportMode] && formData.loadType !== '') {
      setFormData((prev) => ({ ...prev, loadType: '' }));
    }
  }, [formData.transportMode]);

  useEffect(() => {
    if (formData.transportMode === 'Road') {
      setFormData((prev) => ({
        ...prev,
        shipmentDirection: 'Domestic',
        additionalServices: {
          documentation: false,
          customsClearance: false,
          brokerage: false,
          consolidation: false,
        },
      }));
    }
  }, [formData.transportMode]);

  // when loadType changes to full load, reset packages to one if more
  useEffect(() => {
    const isFullLoad = formData.loadType === 'FCL' || formData.loadType === 'FTL';
    if (isFullLoad && formData.packages.length > 1) {
      setFormData((prev) => ({
        ...prev,
        packages: [{
          length: '',
          width: '',
          height: '',
          weight: '',
          contents: '',
          image: null,
        }],
      }));
    }
  }, [formData.loadType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAdditionalServiceChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [name]: checked,
      },
    }));
  };

  const updatePackage = (index, field, value) => {
    setFormData((prev) => {
      const packages = [...prev.packages];
      packages[index][field] = value;
      return { ...prev, packages };
    });
  };

  const handlePackageFileChange = (index, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    updatePackage(index, 'image', file);
  };

  const addPackage = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        { length: '', width: '', height: '', weight: '', contents: '', image: null },
      ],
    }));
  };

  const removePackage = (index) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const handlePickupAddressSelect = ({ region, province, city, barangay }) => {
    setFormData((prev) => ({
      ...prev,
      pickupRegion: region,
      pickupProvince: province,
      pickupCity: city,
      pickupBarangay: barangay,
    }));
  };

  const isDomestic = formData.senderCountry === formData.destinationCountry && formData.senderCountry !== '';

  const availableTransportModes = isDomestic ? ['Air', 'Sea', 'Road'] : ['Air', 'Sea'];

  const isLoadTypeVisible = formData.transportMode === 'Sea' || formData.transportMode === 'Road';

  const isFullLoad = formData.loadType === 'FCL' || formData.loadType === 'FTL';

  const isRoad = formData.transportMode === 'Road';

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      (shipment.packageNumber || "").toLowerCase().includes(queryLower) ||
      (shipment.shipperName || "").toLowerCase().includes(queryLower);

    if (view === "active") {
      return matchesSearch && shipment.packageStatus !== "Delivered" && !shipment.canceled;
    } else if (view === "canceled") {
      return matchesSearch && shipment.canceled;
    } else if (view === "delivered") {
      return matchesSearch && shipment.packageStatus === "Delivered";
    } else {
      return matchesSearch;
    }
  });

  const sortedShipments = filteredShipments.sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleAddShipment = async () => {
    if (
      !formData.packageNumber ||
      !formData.shipperName ||
      !formData.senderCountry ||
      !formData.destinationCountry ||
      !formData.transportMode ||
      !formData.shipmentDirection
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isLoadTypeVisible && !formData.loadType) {
      alert('Please select a load type.');
      return;
    }

    if (formData.pickupOption === 'needPickup' && (!formData.pickupRegion || !formData.pickupProvince || !formData.pickupCity || !formData.pickupBarangay || !formData.pickupDetailedAddress)) {
      alert('Please fill in all pickup address fields.');
      return;
    }

    if (isFullLoad) {
      if (formData.packages.length === 0 || !formData.packages[0].weight) {
        alert('Please enter the total weight.');
        return;
      }
    } else {
      if (
        formData.packages.length === 0 ||
        formData.packages.some(
          (pkg) => !pkg.length || !pkg.width || !pkg.height || !pkg.weight
        )
      ) {
        alert('Please add at least one package and fill in dimensions and weight.');
        return;
      }
    }

    const confirmAdd = window.confirm(
      "Are you sure you want to add this shipment?"
    );
    if (!confirmAdd) return;

    const maxId = shipments.reduce(
      (acc, s) => Math.max(acc, s.customId || 0),
      0
    );
    const newCustomId = maxId + 1;

    const newShipment = {
      packageNumber: formData.packageNumber,
      shipperName: formData.shipperName,
      senderCountry: formData.senderCountry,
      destinationCountry: formData.destinationCountry,
      destinationAddress: formData.destinationAddress,
      transportMode: formData.transportMode,
      shipmentDirection: formData.shipmentDirection,
      loadType: formData.loadType,
      mobile: formData.mobile,
      email: formData.email,
      pickupOption: formData.pickupOption,
      pickupAddress:
        formData.pickupOption === 'needPickup'
          ? {
              region: formData.pickupRegion,
              province: formData.pickupProvince,
              city: formData.pickupCity,
              barangay: formData.pickupBarangay,
              detailedAddress: formData.pickupDetailedAddress,
            }
          : null,
      packages: formData.packages.map((pkg) => ({
        ...pkg,
        image: pkg.image ? pkg.image.name : null,
      })),
      additionalServices: formData.additionalServices,
      packageStatus: formData.packageStatus,
      paid: formData.paid,
      airwayBill: formData.airwayBill,
      customId: newCustomId,
      dateStarted: new Date().toISOString(),
      createdTime: serverTimestamp(),
    };

    try {
      // Add the shipment to the Packages collection
      const docRef = await addDoc(collection(db, "Packages"), newShipment);

      // Create the initial status entry in the statusHistory subcollection
      await addDoc(collection(db, "Packages", docRef.id, "statusHistory"), {
        status: formData.packageStatus,
        timestamp: serverTimestamp(),
      });

      setShipments((prev) => [
        ...prev,
        { customId: newCustomId, docId: docRef.id, ...newShipment },
      ]);
      setShowModal(false);
      setFormData({
        packageNumber: "",
        shipperName: "",
        senderCountry: "",
        destinationCountry: "",
        destinationAddress: "",
        transportMode: "",
        shipmentDirection: "",
        loadType: "",
        mobile: "",
        email: "",
        pickupOption: "deliverToWarehouse",
        pickupRegion: "",
        pickupProvince: "",
        pickupCity: "",
        pickupBarangay: "",
        pickupDetailedAddress: "",
        packages: [{
          length: "",
          width: "",
          height: "",
          weight: "",
          contents: "",
          image: null,
        }],
        additionalServices: {
          documentation: false,
          customsClearance: false,
          brokerage: false,
          consolidation: false,
        },
        packageStatus: "Processing",
        paid: false,
        airwayBill: "",
      });
    } catch (error) {
      console.error("Error adding shipment:", error);
      alert("Failed to add shipment. Please try again.");
    }
  };

  const handleEditShipment = async () => {
    if (currentShipment) {
      const confirmEdit = window.confirm(
        "Are you sure you want to save changes?"
      );
      if (confirmEdit) {
        try {
          // Check if the status has changed to record a status history entry
          const statusChanged =
            formData.packageStatus !== currentShipment.packageStatus;

          // Merge the formData with the updatedTime field.
          const updatedData = {
            ...formData,
            updatedTime: serverTimestamp(),
          };

          await updateDoc(doc(db, "Packages", currentShipment.docId), updatedData);

          // If status has changed, add a new document to the statusHistory subcollection
          if (statusChanged) {
            await addDoc(
              collection(db, "Packages", currentShipment.docId, "statusHistory"),
              {
                status: formData.packageStatus,
                timestamp: serverTimestamp(),
              }
            );
          }

          setShipments((prev) =>
            prev.map((s) =>
              s.docId === currentShipment.docId ? { ...s, ...updatedData } : s
            )
          );
          setEditModal(false);
          setCurrentShipment(null);
        } catch (error) {
          console.error("Error updating shipment:", error);
          alert("Failed to update shipment. Please try again.");
        }
      }
    }
  };

  const handleDoneShipment = async (shipment) => {
    if (shipment.packageStatus === "Delivered") {
      alert("Shipment is already Delivered.");
      return;
    }

    const confirmDone = window.confirm(
      "Are you sure you want to mark this shipment as Delivered?"
    );
    if (confirmDone) {
      try {
        const statusChanged = shipment.packageStatus !== "Delivered";
        const updatedData = {
          packageStatus: "Delivered",
          updatedTime: serverTimestamp(),
        };

        await updateDoc(doc(db, "Packages", shipment.docId), updatedData);

        // If status has changed, add a new document to the statusHistory subcollection
        if (statusChanged) {
          await addDoc(
            collection(db, "Packages", shipment.docId, "statusHistory"),
            {
              status: "Delivered",
              timestamp: serverTimestamp(),
            }
          );
        }

        setShipments((prev) =>
          prev.map((s) =>
            s.docId === shipment.docId ? { ...s, ...updatedData } : s
          )
        );
      } catch (error) {
        console.error("Error marking shipment as done:", error);
        alert("Failed to mark shipment as done. Please try again.");
      }
    }
  };

  const handleCancelShipment = async (shipment) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this shipment?"
    );
    if (confirmCancel) {
      try {
        await updateDoc(doc(db, "Packages", shipment.docId), {
          canceled: true,
          updatedTime: serverTimestamp(),
        });
        setShipments((prev) =>
          prev.map((s) =>
            s.docId === shipment.docId ? { ...s, canceled: true } : s
          )
        );
      } catch (error) {
        console.error("Error canceling shipment:", error);
        alert("Failed to cancel shipment. Please try again.");
      }
    }
  };

  // Fetch statusHistory for a provided shipment and open info modal
  const openInfoModal = async (shipment) => {
    setCurrentShipment(shipment);
    setInfoLoading(true);
    setInfoHistory([]);
    setInfoModal(true);

    try {
      // query ordered by timestamp descending (latest first)
      const q = query(
        collection(db, "Packages", shipment.docId, "statusHistory"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const history = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setInfoHistory(history);
    } catch (err) {
      console.error("Error fetching status history:", err);
      setInfoHistory([]);
    } finally {
      setInfoLoading(false);
    }
  };

  // Utility to format Firestore Timestamps or ISO strings
  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    // Firestore Timestamp has toDate() method
    if (typeof ts.toDate === "function") {
      return ts.toDate().toLocaleString();
    }
    // If it's an ISO string
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch (e) {}
    return String(ts);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Shipment Information
        </h2>
        <div className="mb-4 flex justify-center gap-3 space-x-4">
          <button
            onClick={() => setView("all")}
            className={`px-4 py-2 rounded ${view === "all" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            All
          </button>
          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 rounded ${view === "active" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Active
          </button>
          <button
            onClick={() => setView("canceled")}
            className={`px-4 py-2 rounded ${view === "canceled" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Canceled
          </button>
          <button
            onClick={() => setView("delivered")}
            className={`px-4 py-2 rounded ${view === "delivered" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Delivered
          </button>
        </div>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            className="w-full md:w-1/2 p-2 border rounded border-gray-300"
            placeholder="Search shipments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th
                  className="p-2 cursor-pointer border border-gray-300"
                  onClick={() => handleSort("customId")}
                >
                  ID {sortField === "customId" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-2 border border-gray-300">Package Number</th>
                <th className="p-2 border border-gray-300">Shipper</th>
                <th className="p-2 border border-gray-300">Sender Country</th>
                <th className="p-2 border border-gray-300">Destination Country</th>
                <th className="p-2 border border-gray-300">Transport Mode</th>
                <th className="p-2 border border-gray-300">Shipment Direction</th>
                <th className="p-2 border border-gray-300">Load Type</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Way Bill#</th>
                <th className="p-2 border border-gray-300">Paid</th>
                <th className="p-2 border border-gray-300">Date Started</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedShipments.map((shipment) => {
                const isDelivered = shipment.packageStatus === "Delivered";
                const isCanceled = shipment.canceled;
                return (
                  <tr
                    key={shipment.docId}
                    className={`text-center hover:bg-gray-50 ${
                      isCanceled ? "bg-gray-100" : ""
                    } ${
                      isDelivered ? "bg-green-100" : ""
                    }`}
                  >
                    <td className="p-2 border border-gray-300">{shipment.customId || shipment.docId}</td>
                    <td className="p-2 border border-gray-300">{shipment.packageNumber}</td>
                    <td className="p-2 border border-gray-300">{shipment.shipperName}</td>
                    <td className="p-2 border border-gray-300">{shipment.senderCountry || "N/A"}</td>
                    <td className="p-2 border border-gray-300">{shipment.destinationCountry || "N/A"}</td>
                    <td className="p-2 border border-gray-300">{shipment.transportMode || "N/A"}</td>
                    <td className="p-2 border border-gray-300">{shipment.shipmentDirection || "N/A"}</td>
                    <td className="p-2 border border-gray-300">{shipment.loadType || "N/A"}</td>
                    <td className="p-2 border border-gray-300">{shipment.packageStatus}</td>
                    <td className="p-2 border border-gray-300">{shipment.airwayBill || "N/A"}</td>
                    <td className={`p-2 border border-gray-300 ${shipment.paid ? "bg-green-200" : "bg-red-200"}`}>
                      {shipment.paid ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {shipment.dateStarted
                        ? new Date(shipment.dateStarted).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {(isCanceled || isDelivered) ? (
                        <span className={`${isCanceled ? "text-gray-500" : "text-green-500"} font-semibold`}>
                          {isDelivered ? "Delivered" : "Canceled"}
                        </span>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-2 justify-center">
                          {/* Info button (green) - fetches status history */}
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => openInfoModal(shipment)}
                          >
                            Info
                          </button>

                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => {
                              setCurrentShipment(shipment);
                              setFormData(shipment);
                              setEditModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleDoneShipment(shipment)}
                          >
                            Done
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleCancelShipment(shipment)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center md:justify-end">
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            Add Shipment
          </button>
        </div>

        {/* Add Shipment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add Shipment</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Number */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Package Number</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.packageNumber}
                    name="packageNumber"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Shipper Full Name */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Shipper Full Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.shipperName}
                    name="shipperName"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Mobile Number</label>
                  <PhoneInput
                    international
                    defaultCountry="PH"
                    placeholder="Enter phone number"
                    value={formData.mobile}
                    onChange={(value) => setFormData((prev) => ({ ...prev, mobile: value }))}
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email (Optional) */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                  />
                </div>

                {/* Sender Country */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Sender Country</label>
                  <select
                    name="senderCountry"
                    value={formData.senderCountry}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Country */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Destination Country</label>
                  <select
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Address */}
                <div className="md:col-span-2 flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Destination Address</label>
                  <textarea
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleChange}
                    required
                    placeholder="Enter full destination address"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                {/* Transport Mode */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Mode of Transport</label>
                  <select
                    name="transportMode"
                    value={formData.transportMode}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select mode</option>
                    {availableTransportModes.map((m) => (
                      <option key={m} value={m}>{m} Freight</option>
                    ))}
                  </select>
                </div>

                {/* Shipment Direction */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Shipment Direction</label>
                  {isDomestic || isRoad ? (
                    <input
                      type="text"
                      value="Domestic"
                      disabled
                      className="p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  ) : (
                    <select
                      name="shipmentDirection"
                      value={formData.shipmentDirection}
                      onChange={handleChange}
                      required
                      disabled={!formData.transportMode}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select direction</option>
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                    </select>
                  )}
                  {!formData.transportMode && !isDomestic && <p className="text-sm text-gray-500 mt-1">Please select transport mode first.</p>}
                </div>

                {/* Load Type */}
                {isLoadTypeVisible && (
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">Load Type</label>
                    <select
                      name="loadType"
                      value={formData.loadType}
                      onChange={handleChange}
                      required
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select load type</option>
                      {LOAD_OPTIONS[formData.transportMode].map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Airway Bill (Optional) */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Way Bill# (Optional)</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.airwayBill}
                    name="airwayBill"
                    onChange={handleChange}
                  />
                </div>

                {/* Additional Services */}
                {!isRoad && (
                  <div className="md:col-span-2 flex flex-col mt-2">
                    <label className="mb-1 font-medium text-gray-700">Additional Services</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-1 text-sm">
                        <input type="checkbox" name="documentation" checked={formData.additionalServices.documentation} onChange={handleAdditionalServiceChange} />
                        &nbsp;Documentation
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input type="checkbox" name="customsClearance" checked={formData.additionalServices.customsClearance} onChange={handleAdditionalServiceChange} />
                        &nbsp;Customs Clearance
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input type="checkbox" name="brokerage" checked={formData.additionalServices.brokerage} onChange={handleAdditionalServiceChange} />
                        &nbsp;Brokerage
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input type="checkbox" name="consolidation" checked={formData.additionalServices.consolidation} onChange={handleAdditionalServiceChange} />
                        &nbsp;Consolidation
                      </label>
                    </div>
                  </div>
                )}

                {/* Conditional Pickup Address */}
                {formData.pickupOption === 'needPickup' && (
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-xl font-semibold mb-4">Pickup Address</h3>
                    <AddressSelector onSelect={handlePickupAddressSelect} />
                    <div className="flex flex-col mt-4">
                      <label className="mb-1 font-medium text-gray-700">Street Address</label>
                      <textarea
                        name="pickupDetailedAddress"
                        value={formData.pickupDetailedAddress}
                        onChange={handleChange}
                        placeholder="Enter street, house number, etc."
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {/* Packages */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-xl font-semibold mb-4">Packages</h3>
                  {formData.packages.map((pkg, index) => (
                    <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md relative">
                      {!isFullLoad ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Length (cm)</label>
                            <input
                              type="number"
                              placeholder="Length"
                              value={pkg.length}
                              onChange={(e) => updatePackage(index, 'length', e.target.value)}
                              required
                              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Width (cm)</label>
                            <input
                              type="number"
                              placeholder="Width"
                              value={pkg.width}
                              onChange={(e) => updatePackage(index, 'width', e.target.value)}
                              required
                              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Height (cm)</label>
                            <input
                              type="number"
                              placeholder="Height"
                              value={pkg.height}
                              onChange={(e) => updatePackage(index, 'height', e.target.value)}
                              required
                              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Weight (kg)</label>
                            <input
                              type="number"
                              placeholder="Weight"
                              value={pkg.weight}
                              onChange={(e) => updatePackage(index, 'weight', e.target.value)}
                              required
                              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col mb-4">
                          <label className="mb-1 font-medium text-gray-700">Total Weight (kg)</label>
                          <input
                            type="number"
                            placeholder="Total Weight"
                            value={pkg.weight}
                            onChange={(e) => updatePackage(index, 'weight', e.target.value)}
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                      <div className="flex flex-col mb-4">
                        <label className="mb-1 font-medium text-gray-700">Contents (optional)</label>
                        <textarea
                          placeholder="Describe contents"
                          value={pkg.contents}
                          onChange={(e) => updatePackage(index, 'contents', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Upload Item Image (Optional, max 5MB)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePackageFileChange(index, e.target.files[0])}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {!isFullLoad && formData.packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {!isFullLoad && (
                    <button
                      type="button"
                      onClick={addPackage}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
                    >
                      Add Another Package
                    </button>
                  )}
                </div>

                {/* Paid */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    name="paid"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="font-medium text-gray-700">&nbsp;Paid</label>
                </div>
              </form>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleAddShipment}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Shipment Modal */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Edit Shipment</h3>
              <form>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Package Number</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-100">{formData.packageNumber}</p>
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Shipper Full Name</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-100">{formData.shipperName}</p>
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">From</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.from}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Way Bill#</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.airwayBill}
                    onChange={(e) =>
                      setFormData({ ...formData, airwayBill: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Package Status</label>
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={formData.packageStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, packageStatus: e.target.value })
                    }
                  >
                    <option>Processing</option>
                    <option>To Pickup</option>
                    <option>To Warehouse</option>
                    <option>In warehouse</option>
                    <option>On transit</option>
                    <option>Landed</option>
                    <option>Delivering</option>
                    <option>Delivered</option>
                  </select>
                </div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    onChange={(e) =>
                      setFormData({ ...formData, paid: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label className="font-medium text-gray-700">&nbsp;Paid</label>
                </div>
              </form>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setEditModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleEditShipment}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal - shows statusHistory + timestamps + important details */}
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">
                Shipment Info{" "}
                {currentShipment ? `- ${currentShipment.packageNumber || currentShipment.customId}` : ""}
              </h3>
              {infoLoading ? (
                <p>Loading history...</p>
              ) : (
                <>
                  <div className="mb-3">
                    <strong>Name:</strong> {currentShipment?.shipperName || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Mobile:</strong> {currentShipment?.mobile || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {currentShipment?.email || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Created:</strong>{" "}
                    {currentShipment && currentShipment.createdTime
                      ? formatTimestamp(currentShipment.createdTime)
                      : "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Sender Country:</strong> {currentShipment?.senderCountry || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Destination Country:</strong> {currentShipment?.destinationCountry || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Destination Address:</strong> {currentShipment?.destinationAddress || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Transport Mode:</strong> {currentShipment?.transportMode || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Shipment Direction:</strong> {currentShipment?.shipmentDirection || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Load Type:</strong> {currentShipment?.loadType || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Pickup Option:</strong> {currentShipment?.pickupOption === 'needPickup' ? 'Need Pickup' : 'Deliver to Warehouse'}
                  </div>
                  {currentShipment?.pickupOption === 'needPickup' && currentShipment?.pickupAddress && (
                    <>
                      <div className="mb-3">
                        <strong>Pickup Region:</strong> {currentShipment.pickupAddress.region || "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>Pickup Province:</strong> {currentShipment.pickupAddress.province || "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>Pickup City:</strong> {currentShipment.pickupAddress.city || "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>Pickup Barangay:</strong> {currentShipment.pickupAddress.barangay || "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>Pickup Detailed Address:</strong> {currentShipment.pickupAddress.detailedAddress || "N/A"}
                      </div>
                    </>
                  )}
                  <hr className="my-4" />
                  <h6 className="text-lg font-semibold">Packages:</h6>
                  {currentShipment?.packages && Array.isArray(currentShipment.packages) ? (
                    currentShipment.packages.map((pkg, idx) => {
                      const isFullLoad = currentShipment.loadType === 'FCL' || currentShipment.loadType === 'FTL';
                      return (
                        <div key={idx} className="mb-4 border-b pb-2">
                          <p><strong>Package {idx + 1}:</strong></p>
                          {!isFullLoad ? (
                            <p>
                              Dimensions: {pkg.length || 'N/A'} x {pkg.width || 'N/A'} x {pkg.height || 'N/A'} cm, Weight: {pkg.weight || 'N/A'} kg
                            </p>
                          ) : (
                            <p>Total Weight: {pkg.weight || 'N/A'} kg</p>
                          )}
                          <p>Contents: {pkg.contents || 'N/A'}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No packages available.</p>
                  )}
                  <hr className="my-4" />
                  <p>
                    <strong>Additional Services:</strong>{' '}
                    {Object.keys(currentShipment?.additionalServices || {})
                      .filter((key) => currentShipment.additionalServices[key])
                      .join(', ') || 'None'}
                  </p>
                  <hr className="my-4" />
                  <h6 className="text-lg font-semibold">Status History</h6>
                  {infoHistory.length === 0 ? (
                    <p>No history available.</p>
                  ) : (
                    <div className="overflow-auto" style={{ maxHeight: "40vh" }}>
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border border-gray-300">#</th>
                            <th className="p-2 border border-gray-300">Status</th>
                            <th className="p-2 border border-gray-300">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {infoHistory.map((h, idx) => (
                            <tr key={h.id || idx}>
                              <td className="p-2 border border-gray-300">{infoHistory.length - idx}</td>
                              <td className="p-2 border border-gray-300">{h.status || "N/A"}</td>
                              <td className="p-2 border border-gray-300">{formatTimestamp(h.timestamp)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setInfoModal(false);
                    setInfoHistory([]);
                    setCurrentShipment(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipments;