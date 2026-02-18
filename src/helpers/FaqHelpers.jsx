import React, { useState } from "react";
import { db } from "../jsfile/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export const faqStep1Options = [
  { id: "delivery", text: "Delivery time" },
  { id: "tracking", text: "Package Tracking" },
  { id: "shipping", text: "Shipping cost" },
  { id: "contact", text: "Contact admin" },
];

export const faqFollowUp = {
  delivery: {
    message: "For Delivery time, please select an option:",
    options: [
      { id: "when", text: "When will it arrive?" },
      { id: "delay", text: "Why is it delayed?" },
      { id: "done", text: "Done" },
      { id: "contact", text: "Contact admin" },
    ],
  },
  tracking: {
    message: "For Package Tracking, please select an option:",
    options: [
      { id: "how", text: "How to track my package?" },
      { id: "update", text: "Why no update?" },
      { id: "done", text: "Done" },
      { id: "contact", text: "Contact admin" },
    ],
  },
  shipping: {
    message: "For Shipping cost, please select an option:",
    options: [
      { id: "cost", text: "What is the shipping cost?" },
      { id: "free", text: "How to get free shipping?" },
      { id: "done", text: "Done" },
      { id: "contact", text: "Contact admin" },
    ],
  },
};

const TrackPackage = ({ packageNumber, onSearch, loading }) => {
  return (
    <div className="max-w-4xl mx-auto mt-5 p-10 bg-gray-50 rounded-lg mb-10 drop-shadow-[0px_2px_5px_rgba(0,0,0,1)] shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Status</h2>

      <div className="flex flex-col sm:flex-row items-center mb-10 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Package Number"
          value={packageNumber}
          onChange={(e) => onSearch(e.target.value)}
          disabled={loading}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={() => onSearch(packageNumber, true)}
          disabled={loading || !packageNumber.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>
    </div>
  );
};

export default function FAQHelper() {
  const [currentStep, setCurrentStep] = useState('initial');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [showMorePrompt, setShowMorePrompt] = useState(false);
  const [message, setMessage] = useState('');
  const [packageNumber, setPackageNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingAction, setTrackingAction] = useState(null);

  const handleCategorySelect = (id) => {
    if (id === 'contact') {
      setMessage('Please contact admin for further assistance.');
      setCurrentStep('end');
      return;
    }

    setSelectedCategory(id);
    setCurrentStep('sub');
    setMessage(faqFollowUp[id].message);
    setShowTracker(false);
    setSelectedSub(null);
    setPackageNumber('');
    setShipment(null);
    setStatusHistory([]);
    setError('');
    setTrackingAction(null);
    setShowMorePrompt(false);
  };

  const handleSubSelect = (id) => {
    setSelectedSub(id);
    if (id === 'done') {
      setCurrentStep('initial');
      setMessage('');
      setShowTracker(false);
    } else if (id === 'contact') {
      setMessage('Please contact admin for further assistance.');
      setCurrentStep('end');
      setShowTracker(false);
    } else {
      let shouldPromptMore = false;
      switch (selectedCategory) {
        case 'delivery':
          if (id === 'when') {
            setShowTracker(true);
            setTrackingAction('delivery_when');
            setMessage('Please enter your package or shipment number to check details.');
          } else if (id === 'delay') {
            setMessage('Possible reasons for delay that can\'t be controlled such as weather, disasters, and other unforeseen events.');
            setCurrentStep('end');
            shouldPromptMore = true;
          }
          break;
        case 'tracking':
          if (id === 'how') {
            setShowTracker(true);
            setTrackingAction('tracking_how');
            setMessage('Enter your package number to track your package.');
          } else if (id === 'update') {
            setShowTracker(true);
            setTrackingAction('tracking_update');
            setMessage('Please enter your package number to check for updates.');
          }
          break;
        case 'shipping':
          if (id === 'cost') {
            setMessage('Shipping cost depends on weight, dimensions, destination, and transport mode. Please provide more details for an accurate quote.');
            setCurrentStep('end');
            shouldPromptMore = true;
          } else if (id === 'free') {
            setMessage('Free shipping may be available for certain promotions or orders above a specific amount. Check our current offers.');
            setCurrentStep('end');
            shouldPromptMore = true;
          }
          break;
        default:
          break;
      }
      if (shouldPromptMore) {
        setShowMorePrompt(true);
      }
    }
  };

  const handleMorePrompt = (wantsMore) => {
    setShowMorePrompt(false);
    if (wantsMore) {
      setCurrentStep('initial');
      setMessage('What else can I help you with?');
    } else {
      setMessage('Thank you for using our FAQ assistant! If you need more help, feel free to start over.');
      setCurrentStep('end');
    }
  };

  const handleSearch = async (pkgNum, triggerSearch = false) => {
    setPackageNumber(pkgNum);
    if (!triggerSearch) return;
    setLoading(true);
    setError("");
    setShipment(null);
    setStatusHistory([]);
    try {
      const q = query(
        collection(db, "Packages"),
        where("packageNumber", "==", pkgNum)
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
      // Action-specific messages
      let actionMessage = '';
      if (trackingAction === 'delivery_when') {
        let lastStatus = packageData.packageStatus || 'Unknown';
        if (historyData.length > 0) {
          const lastEntry = historyData[historyData.length - 1];
          lastStatus = lastEntry.status || lastStatus;
        }
        actionMessage = `We don't have an approximate delivery time due to variable factors like customs processing, transit conditions, and other unforeseen circumstances. The current status and location are shown above: ${lastStatus}. For further questions, contact admin.`;
      } else if (trackingAction === 'tracking_update') {
        actionMessage = "If there are no recent updates, it may be due to delays in scanning during transit or system processing. The current status is shown above.";
      }
      setMessage(actionMessage || 'Package details loaded successfully.');
      setShowMorePrompt(true);
    } catch (err) {
      console.error(err);
      setError("Error retrieving package data.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10 mb-20 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">FAQ Helper</h2>
      {currentStep === 'initial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqStep1Options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleCategorySelect(opt.id)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
      {currentStep === 'sub' && !showMorePrompt && (
        <div>
          <p className="text-lg font-medium mb-4">{message}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqFollowUp[selectedCategory].options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSubSelect(opt.id)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {currentStep === 'end' && !showMorePrompt && (
        <div>
          <p className="text-lg mb-4">{message}</p>
          <button
            onClick={() => setCurrentStep('initial')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to FAQ
          </button>
        </div>
      )}
      {showTracker && (
        <>
          <p className="text-lg mb-4">{message}</p>
          <TrackPackage
            packageNumber={packageNumber}
            onSearch={handleSearch}
            loading={loading}
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {shipment && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-4">Package Details</h3>
              <div className="space-y-2 mb-6">
                <p><span className="font-semibold">Package Number:</span> {shipment.packageNumber}</p>
                <p><span className="font-semibold">From:</span> {shipment.senderCountry || 'N/A'}</p>
                <p><span className="font-semibold">To:</span> {shipment.destinationCountry || 'N/A'}</p>
                <p><span className="font-semibold">Current Status:</span> {shipment.packageStatus}</p>
                <p><span className="font-semibold">Airway Bill:</span> {shipment.airwayBill || 'N/A'}</p>
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-3">Status History</h4>
              {statusHistory.length > 0 ? (
                <ul className="pl-0 space-y-2">
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
        </>
      )}
      {showMorePrompt && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium mb-4">Do you have another question?</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleMorePrompt(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Yes
            </button>
            <button
              onClick={() => handleMorePrompt(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}