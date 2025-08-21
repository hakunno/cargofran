import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../jsfile/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AddressSelector from './AddressSelector';

const ShippingServiceRequestForm = () => {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  mobile: '',
  shipmentDestination: '',
  serviceType: '',
  pickupOption: 'deliverToWarehouse',
  pickupRegion: '',
  pickupProvince: '',
  pickupCity: '',
  pickupBarangay: '',
  pickupVehicleSize: '',
  packageImage: null,
  agreedToTerms: false,
});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setFormData((prev) => ({ ...prev, packageImage: file }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('You must agree to the terms and conditions to proceed.');
      return;
    }

    const requestData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      shipmentDestination: formData.shipmentDestination,
      serviceType: formData.serviceType,
      pickupOption: formData.pickupOption,
      pickupAddress:
        formData.pickupOption === 'needPickup'
          ? {
              region: formData.pickupRegion,
              province: formData.pickupProvince,
              city: formData.pickupCity,
              barangay: formData.pickupBarangay,
            }
          : null,
      pickupVehicleSize: formData.pickupOption === 'needPickup' ? formData.pickupVehicleSize : null,
      packageImage: formData.packageImage ? formData.packageImage.name : null,
      createdAt: serverTimestamp(),
      requestTime: new Date().toISOString(),
      status: 'Processing',
    };

    try {
      await addDoc(collection(db, 'shipRequests'), requestData);
      alert('Shipping Service Request Submitted!');

      setFormData({
        name: '',
        mobile: '',
        shipmentDestination: '',
        serviceType: '',
        pickupOption: 'deliverToWarehouse',
        pickupRegion: '',
        pickupProvince: '',
        pickupCity: '',
        pickupBarangay: '',
        pickupVehicleSize: '',
        packageImage: null,
        agreedToTerms: false,
      });
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 mb-20 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Shipping Service Request</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Mobile Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Mobile Number</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm">
              +63
            </span>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="9123456789"
              pattern="[0-9]{10}" // optional validation
              className="p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
        {/* Shipment Destination */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Shipment Destination (City, Country)</label>
          <input
            type="text"
            name="shipmentDestination"
            value={formData.shipmentDestination}
            onChange={handleChange}
            required
            placeholder="e.g., New York, USA"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Service Type */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select service type</option>
            <option value="Import & Export (Air/Sea Freight)">Import & Export (Air/Sea Freight)</option>
            <option value="Domestic (Air/Sea Freight)">Domestic (Air/Sea Freight)</option>
            <option value="Full Container Load (FCL)">Full Container Load (FCL)</option>
            <option value="Less than Container Load (LCL)">Less than Container Load (LCL)</option>
            <option value="Pick-up and Delivery">Pick-up and Delivery</option>
            <option value="Full Truckload (FTL)">Full Truckload (FTL)</option>
            <option value="Less than Truckload (LTL)">Less than Truckload (LTL)</option>
          </select>
        </div>

        {/* Pickup Option */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-2">How will the package reach us?</h3>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="pickupOption"
                value="deliverToWarehouse"
                checked={formData.pickupOption === 'deliverToWarehouse'}
                onChange={handleChange}
                className="mr-2"
              />
              &nbsp;I will deliver to the warehouse
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="pickupOption"
                value="needPickup"
                checked={formData.pickupOption === 'needPickup'}
                onChange={handleChange}
                className="mr-2"
              />
              &nbsp;I need pickup from my location
            </label>
          </div>
        </div>

        {/* Conditional Pickup Address and Vehicle Size */}
        {formData.pickupOption === 'needPickup' && (
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-semibold mb-4">Pickup Address</h3>
            <AddressSelector onSelect={handlePickupAddressSelect} />
            <div className="flex flex-col mt-4">
              <label className="mb-1 font-medium text-gray-700">Vehicle Size for Pickup</label>
              <select
                name="pickupVehicleSize"
                value={formData.pickupVehicleSize}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vehicle size</option>
                <option value="Small Van">Small Van (up to 500 kg)</option>
                <option value="Medium Truck">Medium Truck (500 kg to 2 tons)</option>
                <option value="Large Truck">Large Truck (2 tons to 10 tons)</option>
                <option value="Full Truckload (FTL)">Full Truckload (FTL)</option>
              </select>
            </div>
          </div>
        )}

        {/* Package Image Upload (Optional) */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Upload Item Image (Optional, max 5MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Terms of Service Agreement and Submit Button */}
        <div className="md:col-span-2 flex flex-col items-center mt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              required
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              &nbsp;I agree to the{' '}
              <Link to="/TermsAndConditions" className="text-blue-600 underline">
                Terms and Conditions
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingServiceRequestForm;