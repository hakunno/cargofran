import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../jsfile/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Added getDownloadURL
import AddressSelector from './AddressSelector';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const storage = getStorage(); // Added

export default function ShippingServiceRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    senderCountry: '',
    destinationCountry: '',
    destinationAddress: '',
    transportMode: '',
    shipmentDirection: '',
    loadType: '',
    pickupOption: 'needPickup',
    pickupRegion: '',
    pickupProvince: '',
    pickupCity: '',
    pickupBarangay: '',
    pickupDetailedAddress: '',
    packages: [{
      length: '',
      width: '',
      height: '',
      weight: '',
      contents: '',
      image: null,
    }],
    agreedToTerms: false,
    additionalServices: {
      Documentation: false,
      'Customs Clearance': false,
      Brokerage: false,
      Consolidation: false,
    },
    businessName: '',
    businessPermitImage: null,
  });

  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // map transport modes to available load types
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

  const [countries, setCountries] = useState([]);

  // Fetch countries from Firebase
  useEffect(() => {
    const fetchCountries = async () => {
      const querySnapshot = await getDocs(collection(db, "countries"));
      const countriesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCountries(countriesList);
    };
    fetchCountries();
  }, []);

  const foreignCountries = countries.filter(c => c.value !== 'Philippines');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        setIsEmailLocked(true);
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          setFormData((prev) => ({ ...prev, email: normalizedEmail, name: fullName }));
          setIsNameLocked(true);
        } else {
          setFormData((prev) => ({ ...prev, email: normalizedEmail }));
          setIsNameLocked(false);
        }
      } else {
        setIsEmailLocked(false);
        setIsNameLocked(false);
      }
    });
    return () => unsub();
  }, []);

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
        additionalServices: {
          Documentation: false,
          'Customs Clearance': false,
          Brokerage: false,
          Consolidation: false,
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

  // Reset transport mode if Road and not Domestic
  useEffect(() => {
    if (formData.shipmentDirection !== 'Domestic' && formData.transportMode === 'Road') {
      setFormData(prev => ({ ...prev, transportMode: '' }));
    }
  }, [formData.shipmentDirection]);

  // Set countries based on direction
  useEffect(() => {
    if (formData.shipmentDirection === 'Domestic') {
      setFormData(prev => ({ ...prev, senderCountry: 'Philippines', destinationCountry: 'Philippines' }));
    } else if (formData.shipmentDirection === 'Import') {
      setFormData(prev => ({ ...prev, senderCountry: '', destinationCountry: 'Philippines' }));
    } else if (formData.shipmentDirection === 'Export') {
      setFormData(prev => ({ ...prev, senderCountry: 'Philippines', destinationCountry: '' }));
    }
  }, [formData.shipmentDirection]);

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

  const handleBusinessPermitFileChange = (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, businessPermitImage: file }));
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

  const getAddressString = (item) => {
    if (typeof item === 'string') return item.trim();
    if (item && typeof item === 'object') {
      return (item.label || item.value || '').trim();
    }
    return '';
  };

  const handlePickupAddressSelect = useCallback(({ region, province, city, barangay }) => {
    setFormData((prev) => ({
      ...prev,
      pickupRegion: getAddressString(region),
      pickupProvince: getAddressString(province),
      pickupCity: getAddressString(city),
      pickupBarangay: getAddressString(barangay),
    }));
  }, []);

  const validateStep1 = () => {
    if (!formData.shipmentDirection) {
      alert('Please select a shipment direction.');
      return false;
    }
    if (!formData.transportMode) {
      alert('Please select a mode of transport.');
      return false;
    }
    if (formData.transportMode === 'Road' && formData.shipmentDirection !== 'Domestic') {
      alert('Road freight is only available for Domestic shipments.');
      return false;
    }
    if (formData.shipmentDirection === 'Import' && !formData.senderCountry) {
      alert('Please select sender country.');
      return false;
    }
    if (formData.shipmentDirection === 'Export' && !formData.destinationCountry) {
      alert('Please select destination country.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName) {
      alert('Please enter business name.');
      return false;
    }
    if (!formData.name || !formData.email || !formData.mobile || !formData.destinationAddress) {
      alert('Please fill in all required fields in this step.');
      return false;
    }
    if ((formData.transportMode === 'Sea' || formData.transportMode === 'Road') && !formData.loadType) {
      alert('Please select a load type.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const confirmSubmit = async () => {
    setShowModal(false);
    // Perform the actual submit logic here
    const user = auth.currentUser;
    const normalizedEmail = (user?.email || formData.email || '').toLowerCase().trim();

    let pickupAddress;
    if (formData.shipmentDirection === 'Import') {
      pickupAddress = {
        country: formData.senderCountry,
        fullAddress: formData.pickupDetailedAddress,
      };
    } else if (formData.pickupOption === 'needPickup') {
      pickupAddress = {
        region: formData.pickupRegion,
        province: formData.pickupProvince,
        city: formData.pickupCity,
        barangay: formData.pickupBarangay,
        detailedAddress: formData.pickupDetailedAddress,
      };
    } else {
      pickupAddress = null;
    }

    const requestData = {
      name: formData.name,
      email: normalizedEmail,
      userUid: user?.uid || null,
      mobile: formData.mobile,
      senderCountry: formData.senderCountry,
      destinationCountry: formData.destinationCountry,
      destinationAddress: formData.destinationAddress,
      transportMode: formData.transportMode,
      shipmentDirection: formData.shipmentDirection,
      loadType: formData.loadType,
      pickupOption: formData.pickupOption,
      pickupAddress,
      additionalServices: formData.additionalServices,
      createdAt: serverTimestamp(),
      requestTime: new Date().toISOString(),
      status: 'Processing',
      businessName: formData.businessName,
      businessPermitImage: null,
    };

    try {
      // Create the document without packages and images first
      const docRef = await addDoc(collection(db, 'shipRequests'), {
        ...requestData,
        packages: [], // Temporary empty
      });

      // Upload images and prepare packages
      const uploadedPackages = [];
      for (let i = 0; i < formData.packages.length; i++) {
        const pkg = formData.packages[i];
        let imageUrl = null;
        if (pkg.image) {
          const imageName = `${Date.now()}_${pkg.image.name}`;
          const storageRef = ref(storage, `shipRequests/${docRef.id}/packages/${imageName}`);
          await uploadBytes(storageRef, pkg.image);
          imageUrl = await getDownloadURL(storageRef);
        }
        uploadedPackages.push({ ...pkg, image: imageUrl });
      }

      let updates = { packages: uploadedPackages };

      // Upload business permit image
      if (formData.businessPermitImage) {
        const businessPermitImageName = `${Date.now()}_${formData.businessPermitImage.name}`;
        const businessPermitStorageRef = ref(storage, `shipRequests/${docRef.id}/businessPermit/${businessPermitImageName}`);
        await uploadBytes(businessPermitStorageRef, formData.businessPermitImage);
        const businessPermitUrl = await getDownloadURL(businessPermitStorageRef);
        updates.businessPermitImage = businessPermitUrl;
      }

      // Update the document with uploaded packages and images
      await updateDoc(docRef, updates);

      alert('Shipping Service Request Submitted!');

      // keep email and name if locked, reset others
      setFormData((prev) => ({
        name: isNameLocked ? prev.name : '',
        email: isEmailLocked ? prev.email : '',
        mobile: '',
        senderCountry: '',
        destinationCountry: '',
        destinationAddress: '',
        transportMode: '',
        shipmentDirection: '',
        loadType: '',
        pickupOption: 'needPickup',
        pickupRegion: '',
        pickupProvince: '',
        pickupCity: '',
        pickupBarangay: '',
        pickupDetailedAddress: '',
        packages: [{
          length: '',
          width: '',
          height: '',
          weight: '',
          contents: '',
          image: null,
        }],
        agreedToTerms: false,
        additionalServices: {
          Documentation: false,
          'Customs Clearance': false,
          Brokerage: false,
          Consolidation: false,
        },
        businessName: '',
        businessPermitImage: null,
      }));
      setCurrentStep(1);
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      alert('You must agree to the terms and conditions to proceed.');
      return;
    }

    if (!formData.transportMode) {
      alert('Please select a mode of transport (Air / Sea / Road).');
      return;
    }

    if (!formData.shipmentDirection) {
      alert('Please select a shipment direction.');
      return;
    }

    let missingFields = [];
    if (formData.shipmentDirection !== 'Import') {
      if (!formData.pickupRegion.trim()) missingFields.push('Region');
      if (!formData.pickupProvince.trim()) missingFields.push('Province');
      if (!formData.pickupCity.trim()) missingFields.push('City');
      if (!formData.pickupBarangay.trim()) missingFields.push('Barangay');
    }
    if (!formData.pickupDetailedAddress?.trim()) missingFields.push(formData.shipmentDirection === 'Import' ? 'Pick Up Location (Full Address)' : 'Street Address');
    if (missingFields.length > 0) {
      alert('Please fill in the following pickup address fields: ' + missingFields.join(', '));
      return;
    }

    const isFullLoad = formData.loadType === 'FCL' || formData.loadType === 'FTL';

    // Validate packages
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

    // Show modal if validation passes
    setShowModal(true);
  };

  const isLoadTypeVisible = formData.transportMode === 'Sea' || formData.transportMode === 'Road';

  const isFullLoad = formData.loadType === 'FCL' || formData.loadType === 'FTL';

  const isRoad = formData.transportMode === 'Road';

  const availableModes = formData.shipmentDirection === 'Domestic' 
    ? ['Air', 'Sea', 'Road'] 
    : formData.shipmentDirection 
      ? ['Air', 'Sea'] 
      : ['Air', 'Sea', 'Road'];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white drop-shadow-[0px_2px_5px_rgba(0,0,0,1)] shadow-xl rounded-xl mt-10 mb-20 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 pb-2">Shipping Service Request</h2>

      {/* Tab Indicators */}
      <div className="flex justify-around mb-6 border-b pb-4">
        <div className={`cursor-default px-4 py-2 ${currentStep === 1 ? 'border-b-2 border-blue-500 font-bold text-blue-700' : 'text-gray-500'}`}>
          Step 1: Shipment Type
        </div>
        <div className={`cursor-default px-4 py-2 ${currentStep === 2 ? 'border-b-2 border-blue-500 font-bold text-blue-700' : 'text-gray-500'}`}>
          Step 2: Shipper Details
        </div>
        <div className={`cursor-default px-4 py-2 ${currentStep === 3 ? 'border-b-2 border-blue-500 font-bold text-blue-700' : 'text-gray-500'}`}>
          Step 3: Package & Pickup
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentStep === 1 && (
          <>
            {/* Shipment Direction */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Shipment Direction</label>
              <select
                name="shipmentDirection"
                value={formData.shipmentDirection}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select direction</option>
                <option value="Domestic">Domestic</option>
                <option value="Import">Import</option>
                <option value="Export">Export</option>
              </select>
            </div>

            {/* Transport Mode */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Mode of Transport</label>
              <select
                name="transportMode"
                value={formData.transportMode}
                onChange={handleChange}
                required
                disabled={!formData.shipmentDirection}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select mode</option>
                {availableModes.map((m) => (
                  <option key={m} value={m}>{m} Freight</option>
                ))}
              </select>
              {!formData.shipmentDirection && <p className="text-sm text-gray-500 mt-1">Please select shipment direction first.</p>}
            </div>

            {formData.shipmentDirection && (
              <>
                {/* Sender Country */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">From:</label>
                  {(formData.shipmentDirection === 'Domestic' || formData.shipmentDirection === 'Export') ? (
                    <input
                      type="text"
                      value="Philippines"
                      disabled
                      className="p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  ) : (
                    <select
                      name="senderCountry"
                      value={formData.senderCountry}
                      onChange={handleChange}
                      required
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select country</option>
                      {foreignCountries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Destination Country */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">To:</label>
                  {(formData.shipmentDirection === 'Domestic' || formData.shipmentDirection === 'Import') ? (
                    <input
                      type="text"
                      value="Philippines"
                      disabled
                      className="p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  ) : (
                    <select
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleChange}
                      required
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select country</option>
                      {foreignCountries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2 flex justify-end mt-20">
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                disabled={isNameLocked}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {isNameLocked && <p className="text-sm text-gray-500 mt-1">Logged in name cannot be changed.</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                disabled={isEmailLocked}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {isEmailLocked && <p className="text-sm text-gray-500 mt-1">Logged in email cannot be changed.</p>}
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                placeholder="Your Business Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Destination Address */}
            <div className="md:col-span-2 flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Destination Address (Warehouse, Business Location, or Street Address)</label>
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

            {/* Load Type - dynamic based on transportMode */}
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

            {/* Additional Services Checklist */}
            {!isRoad && (
              <div className="flex flex-col mt-2">
                <label className="mb-1 font-medium text-gray-700">Additional Services</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" className="pr-2" name="Documentation" checked={formData.additionalServices.Documentation} onChange={handleAdditionalServiceChange} />
                    &nbsp;Documentation
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" name="Customs Clearance" checked={formData.additionalServices['Customs Clearance']} onChange={handleAdditionalServiceChange} />
                    &nbsp;Customs Clearance
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" name="Brokerage" checked={formData.additionalServices.Brokerage} onChange={handleAdditionalServiceChange} />
                    &nbsp;Brokerage
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="checkbox" name="Consolidation" checked={formData.additionalServices.Consolidation} onChange={handleAdditionalServiceChange} />
                    &nbsp;Consolidation
                  </label>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-between mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <div className="md:col-span-2">
            {/* Conditional Pickup Address */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Pickup Address</h3>
              {formData.shipmentDirection !== 'Import' ? (
                <>
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
                </>
              ) : (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">Pick Up Location (Full Address)</label>
                  <textarea
                    name="pickupDetailedAddress"
                    value={formData.pickupDetailedAddress}
                    onChange={handleChange}
                    placeholder="Enter full pickup address of the shipment"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              )}
            </div>

            {/* Packages */}
            <div className="mt-4">
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

            {/* Business Permit Upload */}
            <div className="mt-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Upload Business Permit Image (Optional, max 5MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBusinessPermitFileChange(e.target.files[0])}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Terms of Service Agreement */}
            <div className="flex flex-col items-center mt-6">
              <div className="flex items-center mb-4">
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} required className="mr-2" />
                <label className="text-sm text-gray-700">&nbsp;I agree to the{' '}
                  <Link to="/TermsAndConditions" className="text-blue-600 underline">Terms and Conditions</Link>
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">Submit Request</button>
            </div>
          </div>
        )}
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Confirm Submission</h3>
            <div className="space-y-3 text-gray-800">
              <p><strong>Full Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Business Name:</strong> {formData.businessName}</p>
              <p><strong>Mobile:</strong> {formData.mobile}</p>
              <p><strong>Shipment Direction:</strong> {formData.shipmentDirection}</p>
              <p><strong>Transport Mode:</strong> {formData.transportMode}</p>
              {formData.loadType && <p><strong>Load Type:</strong> {formData.loadType}</p>}
              <p><strong>Sender Country:</strong> {formData.senderCountry}</p>
              <p><strong>Destination Country:</strong> {formData.destinationCountry}</p>
              <p><strong>Destination Address:</strong> {formData.destinationAddress}</p>
              <p><strong>Pickup Address:</strong> {formData.shipmentDirection === 'Import' ? `${formData.pickupDetailedAddress} (in ${formData.senderCountry})` : `${formData.pickupDetailedAddress}, ${formData.pickupBarangay}, ${formData.pickupCity}, ${formData.pickupProvince}, ${formData.pickupRegion}`}</p>
              <p><strong>Additional Services:</strong> {Object.keys(formData.additionalServices).filter(key => formData.additionalServices[key]).join(', ') || 'None'}</p>
              <h4 className="text-lg font-semibold mt-4">Packages:</h4>
              {formData.packages.map((pkg, index) => {
                const isFullLoad = formData.loadType === 'FCL' || formData.loadType === 'FTL';
                return (
                  <div key={index} className="mb-4 border-b pb-2">
                    <p><strong>Package {index + 1}:</strong></p>
                    {!isFullLoad ? (
                      <p>Dimensions: {pkg.length} x {pkg.width} x {pkg.height} cm</p>
                    ) : null}
                    <p>Weight: {pkg.weight} kg</p>
                    <p>Contents: {pkg.contents || 'N/A'}</p>
                    {pkg.image && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(pkg.image)}
                          alt={`Package ${index + 1} Preview`}
                          className="w-64 h-auto object-contain border border-gray-300 rounded cursor-pointer"
                          onClick={() => setZoomedImage(URL.createObjectURL(pkg.image))}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <h4 className="text-lg font-semibold mt-4">Business Permit Image:</h4>
              {formData.businessPermitImage ? (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.businessPermitImage)}
                    alt="Business Permit Preview"
                    className="w-64 h-auto object-contain border border-gray-300 rounded cursor-pointer"
                    onClick={() => setZoomedImage(URL.createObjectURL(formData.businessPermitImage))}
                  />
                </div>
              ) : (
                <p>None</p>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed Image"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}