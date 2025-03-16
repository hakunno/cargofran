import { useState } from "react";

const AirCargoTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;

    // Redirect user to Track & Trace with AWB number pre-filled
    const trackTraceURL = `https://www.track-trace.com/aircargo?awb=${trackingNumber}`;
    window.location.href = trackTraceURL;
  };

  return (
    <div className="p-5 border rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-3">Track Your Air Cargo Shipment</h2>

      <form onSubmit={handleTrack} className="flex flex-col space-y-3">
        <label htmlFor="awb" className="text-sm font-medium">Enter Air Waybill (AWB):</label>
        <input
          type="text"
          id="awb"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Example: 123-45678901"
          required
          className="border p-2 rounded w-full"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Track
        </button>
      </form>
    </div>
  );
};

export default AirCargoTracking;
