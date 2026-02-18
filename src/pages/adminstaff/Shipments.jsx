import React, { useState, useEffect, useMemo, useRef } from "react";
import { db, auth } from "../../jsfile/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import Sidebar from "../../component/adminstaff/Sidebar";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import AddressSelector from '../AddressSelector';
import { logActivity } from "../../modals/StaffActivity.jsx";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useReactToPrint } from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const storage = getStorage();

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [businessPreviewUrls, setBusinessPreviewUrls] = useState({});
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false); // New Archive Modal
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);

  const [currentShipment, setCurrentShipment] = useState(null);
  
  // Form Data
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

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(""); // Main Date Filter
  const [endDate, setEndDate] = useState("");   // Main Date Filter
  const [sortField, setSortField] = useState("customId");
  const [sortOrder, setSortOrder] = useState("asc");
  const [view, setView] = useState("all");

  // Archive Specific Filtering
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveStartDate, setArchiveStartDate] = useState("");
  const [archiveEndDate, setArchiveEndDate] = useState("");

  const [adminName, setAdminName] = useState('');
  const location = useLocation();
  const [countries, setCountries] = useState([]);

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

  const tableRef = useRef();

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      const querySnapshot = await getDocs(collection(db, "countries"));
      const countriesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })).sort((a, b) => a.label.localeCompare(b.label));
      setCountries(countriesList);
    };
    fetchCountries();
  }, []);

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

  // Image Preview Logic
  useEffect(() => {
    const fetchPreviewUrls = async () => {
      const newPackagePreviews = {};
      const newBusinessPreviews = {};

      await Promise.all(
        shipments.map(async (shipment) => {
          const packageUrls = [];
          if (shipment.packages && Array.isArray(shipment.packages)) {
            await Promise.all(
              shipment.packages.map(async (pkg) => {
                let url = null;
                if (pkg.image) {
                  if (pkg.image.startsWith('https://')) {
                    url = pkg.image;
                  } else {
                    try {
                      const fileRef = ref(storage, `shipRequests/${shipment.docId}/${pkg.image}`);
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
          newPackagePreviews[shipment.docId] = packageUrls;

          let businessUrl = null;
          if (shipment.businessPermitImage) {
            if (shipment.businessPermitImage.startsWith('https://')) {
              businessUrl = shipment.businessPermitImage;
            } else {
              try {
                const fileRef = ref(storage, `shipRequests/${shipment.docId}/businessPermitImage/${shipment.businessPermitImage}`);
                businessUrl = await getDownloadURL(fileRef);
              } catch (error) {
                console.error('Error fetching business permit image:', error);
              }
            }
          }
          newBusinessPreviews[shipment.docId] = businessUrl;
        })
      );

      setPreviewUrls(newPackagePreviews);
      setBusinessPreviewUrls(newBusinessPreviews);
    };

    if (shipments.length > 0) {
      fetchPreviewUrls();
    }
  }, [shipments]);

  // Admin Details
  const fetchAdminDetails = async () => {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      toast.error("Admin not logged in.");
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

  useEffect(() => {
    const fetchAdmin = async () => {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      setAdminName(`${adminFirstName} ${adminLastName}`.trim());
    };
    fetchAdmin();
  }, []);

  // Form Logic Effects
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
      toast.warning('File size must be less than 5MB');
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

  // --- FILTER LOGIC (Main Table) ---
  const filteredShipments = shipments.filter((shipment) => {
    // Exclude archived from main view
    if (shipment.isArchived) return false;

    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      (shipment.packageNumber || "").toLowerCase().includes(queryLower) ||
      (shipment.shipperName || "").toLowerCase().includes(queryLower) ||
      (shipment.senderCountry || "").toLowerCase().includes(queryLower) ||
      (shipment.destinationCountry || "").toLowerCase().includes(queryLower) ||
      (shipment.transportMode || "").toLowerCase().includes(queryLower) ||
      (shipment.packageStatus || "").toLowerCase().includes(queryLower);

    // Date Filtering
    let matchesDate = true;
    if (startDate) {
      const start = new Date(startDate);
      const shipDate = new Date(shipment.dateStarted);
      matchesDate = matchesDate && shipDate >= start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      const shipDate = new Date(shipment.dateStarted);
      matchesDate = matchesDate && shipDate <= end;
    }

    if (view === "active") {
      return matchesSearch && matchesDate && shipment.packageStatus !== "Delivered" && !shipment.canceled;
    } else if (view === "canceled") {
      return matchesSearch && matchesDate && shipment.canceled;
    } else if (view === "delivered") {
      return matchesSearch && matchesDate && shipment.packageStatus === "Delivered";
    } else {
      // "all"
      return matchesSearch && matchesDate;
    }
  });

  const sortedShipments = filteredShipments.sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // --- FILTER LOGIC (Archive Modal) ---
  const archivedShipments = shipments.filter((s) => s.isArchived).filter((shipment) => {
    const queryLower = archiveSearch.toLowerCase();
    const matchesSearch =
      (shipment.packageNumber || "").toLowerCase().includes(queryLower) ||
      (shipment.shipperName || "").toLowerCase().includes(queryLower) ||
      (shipment.packageStatus || "").toLowerCase().includes(queryLower);

    // Archive Date Filtering
    let matchesDate = true;
    if (archiveStartDate) {
      const start = new Date(archiveStartDate);
      const shipDate = new Date(shipment.dateStarted);
      matchesDate = matchesDate && shipDate >= start;
    }
    if (archiveEndDate) {
      const end = new Date(archiveEndDate);
      end.setHours(23, 59, 59, 999);
      const shipDate = new Date(shipment.dateStarted);
      matchesDate = matchesDate && shipDate <= end;
    }
    return matchesSearch && matchesDate;
  }).sort((a, b) => {
     // Default sort by date desc for archives
     return new Date(b.dateStarted) - new Date(a.dateStarted);
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
      toast.warning("Please fill in all required fields.");
      return;
    }
    if (isLoadTypeVisible && !formData.loadType) {
      toast.warning('Please select a load type.');
      return;
    }
    if (formData.pickupOption === 'needPickup' && (!formData.pickupRegion || !formData.pickupProvince || !formData.pickupCity || !formData.pickupBarangay || !formData.pickupDetailedAddress)) {
      toast.warning('Please fill in all pickup address fields.');
      return;
    }
    if (isFullLoad) {
      if (formData.packages.length === 0 || !formData.packages[0].weight) {
        toast.warning('Please enter the total weight.');
        return;
      }
    } else {
      if (
        formData.packages.length === 0 ||
        formData.packages.some(
          (pkg) => !pkg.length || !pkg.width || !pkg.height || !pkg.weight
        )
      ) {
        toast.warning('Please add at least one package and fill in dimensions and weight.');
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
      isArchived: false,
    };

    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();
      const docRef = await addDoc(collection(db, "Packages"), newShipment);
      await logActivity(adminFullName, `Added new shipment ${newCustomId}`);
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
      toast.success("Shipment added successfully!");
    } catch (error) {
      console.error("Error adding shipment:", error);
      toast.error("Failed to add shipment. Please try again.");
    }
  };

  const handleEditShipment = async () => {
    if (currentShipment) {
      const confirmEdit = window.confirm(
        "Are you sure you want to save changes?"
      );
      if (confirmEdit) {
        try {
          const { adminFirstName, adminLastName } = await fetchAdminDetails();
          const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

          const changes = [];
          if (formData.packageStatus !== currentShipment.packageStatus) {
            changes.push(`Status changed from ${currentShipment.packageStatus} to ${formData.packageStatus}`);
          }
          const statusChanged = formData.packageStatus !== currentShipment.packageStatus;
          const updatedData = {
            ...formData,
            updatedTime: serverTimestamp(),
          };

          await updateDoc(doc(db, "Packages", currentShipment.docId), updatedData);

          if (statusChanged) {
            await addDoc(
              collection(db, "Packages", currentShipment.docId, "statusHistory"),
              {
                status: formData.packageStatus,
                timestamp: serverTimestamp(),
              }
            );
          }

          await logActivity(adminFullName, `Edited shipment ${currentShipment.packageNumber || currentShipment.customId}`);

          setShipments((prev) =>
            prev.map((s) =>
              s.docId === currentShipment.docId ? { ...s, ...updatedData } : s
            )
          );
          setEditModal(false);
          setCurrentShipment(null);
          toast.success("Shipment updated successfully.");
        } catch (error) {
          console.error("Error updating shipment:", error);
          toast.error("Failed to update shipment.");
        }
      }
    }
  };

  const handleDoneShipment = async (shipment) => {
    if (shipment.packageStatus === "Delivered") {
      toast.info("Shipment is already Delivered.");
      return;
    }
    const confirmDone = window.confirm(
      "Are you sure you want to mark this shipment as Delivered? This will automatically mark it as Paid."
    );
    if (confirmDone) {
      try {
        const { adminFirstName, adminLastName } = await fetchAdminDetails();
        const adminFullName = `${adminFirstName} ${adminLastName}`.trim();
        const statusChanged = shipment.packageStatus !== "Delivered";
       
        const updatedData = {
          packageStatus: "Delivered",
          paid: true,
          updatedTime: serverTimestamp(),
        };

        await updateDoc(doc(db, "Packages", shipment.docId), updatedData);

        if (statusChanged) {
          await addDoc(
            collection(db, "Packages", shipment.docId, "statusHistory"),
            {
              status: "Delivered",
              timestamp: serverTimestamp(),
            }
          );
        }

        await logActivity(adminFullName, `Marked shipment ${shipment.packageNumber || shipment.customId} as Delivered and Paid`);
        setShipments((prev) =>
          prev.map((s) =>
            s.docId === shipment.docId ? { ...s, ...updatedData } : s
          )
        );
        toast.success("Shipment marked as Delivered.");
      } catch (error) {
        console.error("Error marking shipment as done:", error);
        toast.error("Failed to mark shipment as done.");
      }
    }
  };

  const handleArchiveShipment = async (shipment) => {
    const confirmArchive = window.confirm(
      "Are you sure you want to ARCHIVE this shipment? It will be moved to the Archive Modal."
    );
    if (confirmArchive) {
      try {
        const { adminFirstName, adminLastName } = await fetchAdminDetails();
        const adminFullName = `${adminFirstName} ${adminLastName}`.trim();
       
        const updatedData = {
            isArchived: true,
            packageStatus: "Archived",
            archivedTime: serverTimestamp()
        };

        await updateDoc(doc(db, "Packages", shipment.docId), updatedData);
       
        await addDoc(
            collection(db, "Packages", shipment.docId, "statusHistory"),
            {
              status: "Archived",
              timestamp: serverTimestamp(),
            }
        );

        await logActivity(adminFullName, `Archived shipment ${shipment.packageNumber || shipment.customId}`);
       
        setShipments((prev) =>
          prev.map((s) =>
            s.docId === shipment.docId ? { ...s, ...updatedData } : s
          )
        );
        toast.success("Shipment archived successfully.");
      } catch (error) {
        console.error("Error archiving shipment:", error);
        toast.error("Failed to archive shipment.");
      }
    }
  };

  const handleDeletePermanent = async (shipment) => {
    const confirmDelete = window.confirm(
        `Are you sure you want to PERMANENTLY DELETE shipment ${shipment.packageNumber}? This cannot be undone.`
    );
    if(confirmDelete) {
        try {
            const { adminFirstName, adminLastName } = await fetchAdminDetails();
            const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

            await deleteDoc(doc(db, "Packages", shipment.docId));
            await logActivity(adminFullName, `Permanently Deleted shipment ${shipment.packageNumber}`);

            setShipments((prev) => prev.filter((s) => s.docId !== shipment.docId));
            toast.success("Shipment deleted permanently.");
        } catch (error) {
            console.error("Error deleting shipment:", error);
            toast.error("Failed to delete shipment.");
        }
    }
  };

  const handleSetPaid = async (shipment, paid) => {
    const confirmSet = window.confirm(`Are you sure you want to set paid to ${paid ? 'Yes' : 'No'}?`);
    if (!confirmSet) return;
    try {
      const { adminFirstName, adminLastName } = await fetchAdminDetails();
      const adminFullName = `${adminFirstName} ${adminLastName}`.trim();

      const updatedData = {
        paid,
        updatedTime: serverTimestamp(),
      };
      await updateDoc(doc(db, "Packages", shipment.docId), updatedData);
      await logActivity(adminFullName, `Set paid to ${paid ? 'Yes' : 'No'} for shipment ${shipment.packageNumber || shipment.customId}`);
      setShipments((prev) =>
        prev.map((s) =>
          s.docId === shipment.docId ? { ...s, ...updatedData } : s
        )
      );
      toast.success(`Paid status updated to ${paid ? 'Yes' : 'No'}.`);
    } catch (error) {
      console.error("Error setting paid status:", error);
      toast.error("Failed to set paid status.");
    }
  };

  const handleAction = (shipment, action) => {
    switch (action) {
      case 'info':
        openInfoModal(shipment);
        break;
      case 'update':
        setCurrentShipment(shipment);
        setFormData(shipment);
        setEditModal(true);
        break;
      case 'mark_delivered':
        handleDoneShipment(shipment);
        break;
      case 'archive':
        handleArchiveShipment(shipment);
        break;
      case 'set_paid_yes':
        handleSetPaid(shipment, true);
        break;
      case 'set_paid_no':
        handleSetPaid(shipment, false);
        break;
      default:
        break;
    }
  };

  const openInfoModal = async (shipment) => {
    setCurrentShipment(shipment);
    setInfoLoading(true);
    setInfoHistory([]);
    setInfoModal(true);
    try {
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

  const [newCountry, setNewCountry] = useState('');
  const handleAddCountry = async () => {
    const trimmed = newCountry.trim();
    if (!trimmed) {
      toast.warning("Please enter a country name.");
      return;
    }
    if (countries.some(c => c.label.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning("Country already exists.");
      return;
    }
    try {
      await addDoc(collection(db, "countries"), {
        label: trimmed,
        value: trimmed,
      });
      toast.success("Country added successfully.");
      setNewCountry('');
      const querySnapshot = await getDocs(collection(db, "countries"));
      const countriesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })).sort((a, b) => a.label.localeCompare(b.label));
      setCountries(countriesList);
    } catch (error) {
      console.error("Error adding country:", error);
      toast.error("Failed to add country.");
    }
  };

  const handleRemoveCountry = async (countryId, countryName) => {
    if (!window.confirm(`Are you sure you want to remove ${countryName}?`)) return;
    try {
      await deleteDoc(doc(db, "countries", countryId));
      toast.success("Country removed successfully.");
      const querySnapshot = await getDocs(collection(db, "countries"));
      const countriesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })).sort((a, b) => a.label.localeCompare(b.label));
      setCountries(countriesList);
    } catch (error) {
      console.error("Error removing country:", error);
      toast.error("Failed to remove country.");
    }
  };

  const handleExportCSV = () => {
    if (sortedShipments.length === 0) {
      toast.info("No data to export.");
      return;
    }
    const headers = [
      "ID",
      "Package Number",
      "Shipper Name",
      "Sender Country",
      "Destination Country",
      "Transport Mode",
      "Status",
      "Paid",
      "Date Started"
    ];

    const rows = sortedShipments.map((s, index) => [
      index + 1,
      s.packageNumber || "",
      s.shipperName || "",
      s.senderCountry || "N/A",
      s.destinationCountry || "N/A",
      s.transportMode || "N/A",
      s.packageStatus || "",
      s.paid ? "Yes" : "No",
      s.dateStarted ? new Date(s.dateStarted).toLocaleDateString() : "N/A"
    ]);

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return "";
      const stringValue = String(str);
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((row) => row.map(escapeCsv).join(","))
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shipments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logic for report header date range
  let minDate = null;
  let maxDate = null;
  sortedShipments.forEach((s) => {
    if (s.dateStarted) {
      const d = new Date(s.dateStarted);
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    }
  });
  const dateRange = minDate && maxDate
    ? `From ${minDate.toLocaleDateString()} to ${maxDate.toLocaleDateString()}`
    : 'N/A';
  
  const currentDate = new Date().toLocaleDateString();
  const filterText = searchQuery ? `Filter: ${searchQuery}` : '';
  
  const narrative = `\u200B \u200B \u200B \u200B \u200B \u200BThis report summarizes the shipments for the ${view} view${searchQuery ? `, filtered by "${searchQuery}"` : ''}.`;

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "\u200B",
    pageStyle: `
      @page { size: landscape; margin: 10mm; }
      @media print {
        body { font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; }
        .print-header { margin-bottom: 20px; position: relative; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
        .print-header h2 { text-align: center; font-size: 20px; margin-bottom: 5px; color: #333; }
        .print-header .header-details { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
        th, td { border: 1px solid #ddd; padding: 4px; text-align: left; word-wrap: break-word; }
        th { background-color: #f2f2f2; }
        tr { break-inside: auto; page-break-inside: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; height: auto !important; width: 100% !important; display: block; }
        .no-print { display: none !important; }
        .prepared-by { margin-top: 20px; text-align: right; font-size: 12px; color: #666; page-break-inside: avoid; }
      }
    `,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6">
            <div className="w-24"></div> 
            <h2 className="text-xl font-semibold text-center flex-1">
                Shipment Information
            </h2>
            {/* Archive Modal Button */}
            <button
                onClick={() => setArchiveModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                View Archives
            </button>
        </div>

        {/* --- FILTERS (Tabs) --- */}
        <div className="mb-4 flex flex-col md:flex-row justify-center gap-3 space-x-0 md:space-x-4">
          <button onClick={() => setView("all")} className={`px-4 py-2 rounded ${view === "all" ? "bg-blue-600 text-white" : "bg-gray-300"} mb-2 md:mb-0`}>All</button>
          <button onClick={() => setView("active")} className={`px-4 py-2 rounded ${view === "active" ? "bg-blue-600 text-white" : "bg-gray-300"} mb-2 md:mb-0`}>Active</button>
          <button onClick={() => setView("canceled")} className={`px-4 py-2 rounded ${view === "canceled" ? "bg-blue-600 text-white" : "bg-gray-300"} mb-2 md:mb-0`}>Canceled</button>
          <button onClick={() => setView("delivered")} className={`px-4 py-2 rounded ${view === "delivered" ? "bg-blue-600 text-white" : "bg-gray-300"} mb-2 md:mb-0`}>Delivered</button>
        </div>

        {/* --- SEARCH & DATE FILTER (Main) --- */}
        <div className="mb-4 flex flex-col md:flex-row justify-center gap-4 items-center">
          <input
            type="text"
            className="w-full md:w-1/3 p-2 border rounded border-gray-300"
            placeholder="Search shipments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input 
                type="date" 
                className="p-2 border rounded border-gray-300"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input 
                type="date" 
                className="p-2 border rounded border-gray-300"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div ref={tableRef} className="bg-white shadow-lg rounded-xl p-6 print-section">
          <div className="print-header hidden print:block">
            <h2 className="text-2xl font-bold text-gray-900 text-center">SHIPMENT SUMMARY REPORT</h2>
            <div className="header-details">
              <span>{dateRange}</span>
              <span>{filterText}</span>
            </div>
          </div>
          <p className="narrative hidden print:block mb-4">{narrative}</p>
        
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded-lg relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50" onClick={() => handleSort("customId")}>#</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Package Number</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Shipper</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Sender Country</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Destination Country</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Transport Mode</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Paid</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date Started</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print bg-gray-50 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedShipments.length > 0 ? (
                    sortedShipments.map((shipment, index) => {
                    const isDelivered = shipment.packageStatus === "Delivered";
                    const isCanceled = shipment.canceled;
                    return (
                        <tr key={shipment.docId} className={`hover:bg-gray-50 ${isCanceled ? "bg-gray-100" : (index % 2 === 0 ? "bg-white" : "bg-gray-50")}`}>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.packageNumber}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.shipperName}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.senderCountry || "N/A"}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.destinationCountry || "N/A"}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.transportMode || "N/A"}</td>
                        <td className={`px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isDelivered ? "bg-green-200" : ""}`}>{shipment.packageStatus}</td>
                        <td className={`px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${shipment.paid ? "bg-green-200" : "bg-red-200"}`}>{shipment.paid ? "Yes" : "No"}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.dateStarted ? new Date(shipment.dateStarted).toLocaleDateString() : "N/A"}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 no-print">
                            <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => handleAction(shipment, 'info')} className="text-blue-600 hover:text-blue-800 p-1 border border-blue-600 rounded bg-white" title="View Info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            {!isCanceled && !isDelivered && (
                                <button onClick={() => handleAction(shipment, 'update')} className="text-yellow-600 hover:text-yellow-800 p-1 border border-yellow-600 rounded bg-white" title="Edit Shipment">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                </button>
                            )}
                            {!isCanceled && (
                                <>
                                <button onClick={() => handleSetPaid(shipment, true)} className={`p-1 border rounded bg-white ${shipment.paid ? 'text-gray-400 border-gray-300' : 'text-green-600 border-green-600 hover:bg-green-50'}`} title="Set Paid: Yes">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <button onClick={() => handleSetPaid(shipment, false)} className={`p-1 border rounded bg-white ${!shipment.paid ? 'text-gray-400 border-gray-300' : 'text-red-600 border-red-600 hover:bg-red-50'}`} title="Set Paid: No">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                </>
                            )}
                            {!isCanceled && !isDelivered && (
                                <button onClick={() => handleDoneShipment(shipment)} className="text-green-600 hover:text-green-800 p-1 border border-green-600 rounded bg-white" title="Mark as Delivered">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                </button>
                            )}
                            {!isCanceled && (
                                <button onClick={() => handleArchiveShipment(shipment)} className="text-purple-600 hover:text-purple-800 p-1 border border-purple-600 rounded bg-white" title="Archive Shipment">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                </button>
                            )}
                            </div>
                        </td>
                        </tr>
                    );
                    })
                ) : (
                    <tr>
                        <td colSpan="10" className="px-6 py-4 text-center text-gray-500">No shipments found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="prepared-by hidden print:block">
            <p>Prepared by: {adminName.toUpperCase()}</p>
            <p>Date: {currentDate}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white pt-3 pb-2 rounded-lg shadow no-print">
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-5 h-5 bg-gray-100 border border-gray-300 mr-3"></div>
              <span className="text-sm text-gray-700">Canceled Shipment (Row Background)</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 bg-green-200 border border-gray-300 mr-3"></div>
              <span className="text-sm text-gray-700">Delivered (Status Cell) / Paid (Paid Cell)</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 bg-red-200 border border-gray-300 mr-3"></div>
              <span className="text-sm text-gray-700">Not Paid (Paid Cell)</span>
            </li>
          </ul>
        </div>

        {/* --- BOTTOM ACTIONS --- */}
        <div className="mt-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 no-print">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition" onClick={() => setShowAddCountryModal(true)}>Add Country</button>
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition" onClick={() => setShowModal(true)}>Add Shipment</button>
            {/* Removed History Button */}
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button onClick={handleExportCSV} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition">Export CSV</button>
            <button onClick={handlePrint} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">Print Table</button>
          </div>
        </div>

        {/* --- ARCHIVE MODAL --- */}
        {archiveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Archived Shipments</h3>
                    <button onClick={() => setArchiveModal(false)} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
                </div>
                
                {/* Archive Filters */}
                <div className="mb-4 flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-3 rounded">
                    <input
                        type="text"
                        className="w-full md:w-1/3 p-2 border rounded border-gray-300"
                        placeholder="Search archives..."
                        value={archiveSearch}
                        onChange={(e) => setArchiveSearch(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">From:</label>
                        <input type="date" className="p-2 border rounded border-gray-300" value={archiveStartDate} onChange={(e) => setArchiveStartDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">To:</label>
                        <input type="date" className="p-2 border rounded border-gray-300" value={archiveEndDate} onChange={(e) => setArchiveEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Package #</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shipper</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sender Country</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dest. Country</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Started</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Delete</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {archivedShipments.length > 0 ? (
                        archivedShipments.map((shipment, index) => (
                        <tr key={shipment.docId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.packageNumber}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.shipperName}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.senderCountry || "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.destinationCountry || "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.transportMode || "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.packageStatus}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{shipment.dateStarted ? new Date(shipment.dateStarted).toLocaleDateString() : "N/A"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                                <button
                                    onClick={() => handleDeletePermanent(shipment)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition"
                                    title="Permanently Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No archived shipments found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                <div className="flex justify-end mt-4">
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={() => setArchiveModal(false)}
                >
                    Close
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Add Shipment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto no-print">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add Shipment</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... (Same Form Fields) ... */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Package Number</label>
                  <input type="text" className="p-2 border border-gray-300 rounded-md" value={formData.packageNumber} name="packageNumber" onChange={handleChange} required />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Shipper Full Name</label>
                  <input type="text" className="p-2 border border-gray-300 rounded-md" value={formData.shipperName} name="shipperName" onChange={handleChange} required />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Mobile Number</label>
                  <PhoneInput international defaultCountry="PH" placeholder="Enter phone number" value={formData.mobile} onChange={(value) => setFormData((prev) => ({ ...prev, mobile: value }))} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Email</label>
                  <input type="email" className="p-2 border border-gray-300 rounded-md" value={formData.email} name="email" onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Sender Country</label>
                  <select name="senderCountry" value={formData.senderCountry} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select country</option>
                    {countries.map((country) => (<option key={country.value} value={country.label}>{country.label}</option>))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Destination Country</label>
                  <select name="destinationCountry" value={formData.destinationCountry} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select country</option>
                    {countries.map((country) => (<option key={country.value} value={country.label}>{country.label}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Destination Address</label>
                  <textarea name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} required placeholder="Enter full destination address" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Mode of Transport</label>
                  <select name="transportMode" value={formData.transportMode} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select mode</option>
                    {availableTransportModes.map((m) => (<option key={m} value={m}>{m} Freight</option>))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Shipment Direction</label>
                  {isDomestic || isRoad ? (
                    <input type="text" value="Domestic" disabled className="p-2 border border-gray-300 rounded-md bg-gray-100" />
                  ) : (
                    <select name="shipmentDirection" value={formData.shipmentDirection} onChange={handleChange} required disabled={!formData.transportMode} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select direction</option>
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                    </select>
                  )}
                </div>
                {isLoadTypeVisible && (
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">Load Type</label>
                    <select name="loadType" value={formData.loadType} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select load type</option>
                      {LOAD_OPTIONS[formData.transportMode].map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                  </div>
                )}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Way Bill# (Optional)</label>
                  <input type="text" className="p-2 border border-gray-300 rounded-md" value={formData.airwayBill} name="airwayBill" onChange={handleChange} />
                </div>
                {!isRoad && (
                  <div className="md:col-span-2 flex flex-col mt-2">
                    <label className="mb-1 font-medium text-gray-700">Additional Services</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="documentation" checked={formData.additionalServices.documentation} onChange={handleAdditionalServiceChange} />&nbsp;Documentation</label>
                      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="customsClearance" checked={formData.additionalServices.customsClearance} onChange={handleAdditionalServiceChange} />&nbsp;Customs Clearance</label>
                      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="brokerage" checked={formData.additionalServices.brokerage} onChange={handleAdditionalServiceChange} />&nbsp;Brokerage</label>
                      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="consolidation" checked={formData.additionalServices.consolidation} onChange={handleAdditionalServiceChange} />&nbsp;Consolidation</label>
                    </div>
                  </div>
                )}
                {formData.pickupOption === 'needPickup' && (
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-xl font-semibold mb-4">Pickup Address</h3>
                    <AddressSelector onSelect={handlePickupAddressSelect} />
                    <div className="flex flex-col mt-4">
                      <label className="mb-1 font-medium text-gray-700">Street Address</label>
                      <textarea name="pickupDetailedAddress" value={formData.pickupDetailedAddress} onChange={handleChange} placeholder="Enter street, house number, etc." className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
                    </div>
                  </div>
                )}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-xl font-semibold mb-4">Packages</h3>
                  {formData.packages.map((pkg, index) => (
                    <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md relative">
                      {!isFullLoad ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex flex-col"><label className="mb-1 font-medium text-gray-700">Length (cm)</label><input type="number" placeholder="Length" value={pkg.length} onChange={(e) => updatePackage(index, 'length', e.target.value)} required className="p-2 border border-gray-300 rounded-md" /></div>
                          <div className="flex flex-col"><label className="mb-1 font-medium text-gray-700">Width (cm)</label><input type="number" placeholder="Width" value={pkg.width} onChange={(e) => updatePackage(index, 'width', e.target.value)} required className="p-2 border border-gray-300 rounded-md" /></div>
                          <div className="flex flex-col"><label className="mb-1 font-medium text-gray-700">Height (cm)</label><input type="number" placeholder="Height" value={pkg.height} onChange={(e) => updatePackage(index, 'height', e.target.value)} required className="p-2 border border-gray-300 rounded-md" /></div>
                          <div className="flex flex-col"><label className="mb-1 font-medium text-gray-700">Weight (kg)</label><input type="number" placeholder="Weight" value={pkg.weight} onChange={(e) => updatePackage(index, 'weight', e.target.value)} required className="p-2 border border-gray-300 rounded-md" /></div>
                        </div>
                      ) : (
                        <div className="flex flex-col mb-4"><label className="mb-1 font-medium text-gray-700">Total Weight (kg)</label><input type="number" placeholder="Total Weight" value={pkg.weight} onChange={(e) => updatePackage(index, 'weight', e.target.value)} required className="p-2 border border-gray-300 rounded-md" /></div>
                      )}
                      <div className="flex flex-col mb-4"><label className="mb-1 font-medium text-gray-700">Contents (optional)</label><textarea placeholder="Describe contents" value={pkg.contents} onChange={(e) => updatePackage(index, 'contents', e.target.value)} className="p-2 border border-gray-300 rounded-md" /></div>
                      <div className="flex flex-col"><label className="mb-1 font-medium text-gray-700">Upload Item Image (Optional, max 5MB)</label><input type="file" accept="image/*" onChange={(e) => handlePackageFileChange(index, e.target.files[0])} className="p-2 border border-gray-300 rounded-md" /></div>
                      {!isFullLoad && formData.packages.length > 1 && (<button type="button" onClick={() => removePackage(index)} className="absolute top-2 right-2 bg-red-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-700 transition">Remove</button>)}
                    </div>
                  ))}
                  {!isFullLoad && (<button type="button" onClick={addPackage} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition">Add Another Package</button>)}
                </div>
                <div className="flex items-center mb-3">
                  <input type="checkbox" checked={formData.paid} name="paid" onChange={handleChange} className="mr-2" /><label className="font-medium text-gray-700">&nbsp;Paid</label>
                </div>
              </form>
              <div className="flex justify-end gap-2 mt-4">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Close</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleAddShipment}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Shipment Modal */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Update Shipment</h3>
              <form>
                <div className="flex flex-col mb-3"><label className="mb-1 font-medium text-gray-700">Package Number</label><p className="p-2 border border-gray-300 rounded-md bg-gray-100">{formData.packageNumber}</p></div>
                <div className="flex flex-col mb-3"><label className="mb-1 font-medium text-gray-700">Shipper Full Name</label><p className="p-2 border border-gray-300 rounded-md bg-gray-100">{formData.shipperName}</p></div>
                <div className="flex flex-col mb-3"><label className="mb-1 font-medium text-gray-700">Way Bill#</label><input type="text" className="p-2 border border-gray-300 rounded-md" value={formData.airwayBill} onChange={(e) => setFormData({ ...formData, airwayBill: e.target.value })} /></div>
                <div className="flex flex-col mb-3"><label className="mb-1 font-medium text-gray-700">Email</label><input type="email" className="p-2 border border-gray-300 rounded-md" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="flex flex-col mb-3">
                  <label className="mb-1 font-medium text-gray-700">Package Status</label>
                  <select className="p-2 border border-gray-300 rounded-md" value={formData.packageStatus} onChange={(e) => setFormData({ ...formData, packageStatus: e.target.value })}>
                    <option>Processing</option><option>To Pickup</option><option>To Warehouse</option><option>In warehouse</option><option>On transit</option><option>Landed</option><option>Delivering</option><option>Delivered</option>
                  </select>
                </div>
                <div className="flex items-center mb-3"><input type="checkbox" checked={formData.paid} onChange={(e) => setFormData({ ...formData, paid: e.target.checked })} className="mr-2" /><label className="font-medium text-gray-700">&nbsp;Paid</label></div>
              </form>
              <div className="flex justify-end gap-2">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setEditModal(false)}>Close</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleEditShipment}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Country Modal */}
        {showAddCountryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-6">
              <h3 className="text-xl font-bold mb-4">Add Country</h3>
              <div className="flex flex-col mb-3">
                <label className="mb-1 font-medium text-gray-700">Country Name</label>
                <input type="text" className="p-2 border border-gray-300 rounded-md" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} required />
              </div>
              <div className="mb-4">
                <div className="overflow-auto max-h-100">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                      <tr><th className="p-2 border border-gray-300">Current Countries</th><th className="p-2 border border-gray-300">Actions</th></tr>
                    </thead>
                    <tbody>
                      {countries.map((country) => (
                        <tr key={country.id}>
                          <td className="p-2 border border-gray-300">{country.label}</td>
                          <td className="p-2 border border-gray-300">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRemoveCountry(country.id, country.label)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setShowAddCountryModal(false)}>Close</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={handleAddCountry}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipments;