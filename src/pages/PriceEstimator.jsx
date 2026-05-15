import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../jsfile/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaPlane, FaShip, FaBoxOpen, FaInfoCircle, FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaGlobeAsia } from 'react-icons/fa';

const CURRENCIES = {
  PHP: { label: 'PHP (₱)', rate: 58, symbol: '₱' },
  USD: { label: 'USD ($)', rate: 1, symbol: '$' },
  EUR: { label: 'EUR (€)', rate: 0.92, symbol: '€' },
  GBP: { label: 'GBP (£)', rate: 0.79, symbol: '£' },
  JPY: { label: 'JPY (¥)', rate: 155, symbol: '¥' }
};

// Common baseline rates (USD) for Philippine Freight Forwarding
const BASE_RATES_USD = {
  air: { min: 3, max: 8 },        // per kg
  seaLCL: { min: 50, max: 120 },  // per CBM
  seaFCL20: { min: 800, max: 1500 }, // flat 20ft
  seaFCL40: { min: 1200, max: 2500 }  // flat 40ft
};

const MODES = [
  { id: 'air',    label: 'Air Freight',      short: 'Air', icon: <FaPlane className="text-lg" /> },
  { id: 'seaLCL', label: 'Sea Freight (LCL)', short: 'LCL', icon: <FaShip className="text-lg" /> },
  { id: 'seaFCL', label: 'Sea Freight (FCL)', short: 'FCL', icon: <FaBoxOpen className="text-lg" /> },
];

const InputField = ({ label, value, onChange, placeholder, type = "number" }) => (
  <div className="flex flex-col flex-1">
    <label className="text-xs font-semibold text-slate-600 mb-1">{label}</label>
    <input
      type={type} min={type === "number" ? "0" : undefined} value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
    />
  </div>
);

const Row = ({ label, value, bold, icon }) => (
  <div className={`flex justify-between items-center text-sm ${bold ? 'font-bold text-slate-900 border-t border-slate-100 pt-2 mt-2' : 'text-slate-600'}`}>
    <span className="flex items-center gap-1.5">{icon && <span className="text-teal-600">{icon}</span>} {label}</span>
    <span>{value}</span>
  </div>
);

export default function PriceEstimator() {
  const [mode, setMode] = useState('air');
  const [currency, setCurrency] = useState('PHP');
  const [direction, setDirection] = useState('Import');
  const [foreignCountry, setForeignCountry] = useState('');
  const [result, setResult] = useState(null);

  const defaultAirPkg = { length: '', width: '', height: '', weight: '', quantity: '1' };
  const defaultLCLPkg = { length: '', width: '', height: '', quantity: '1' };

  const [airPkgs, setAirPkgs] = useState([{ ...defaultAirPkg }]);
  const [lclPkgs, setLclPkgs] = useState([{ ...defaultLCLPkg }]);
  const [fclSize, setFclSize] = useState('20ft');
  const [countries, setCountries] = useState([]);

  // Fetch countries from Firestore
  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "countries"));
        const countriesList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCountries(countriesList);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const foreignCountries = countries.filter(c => c.value !== 'Philippines' && c.label !== 'Philippines');

  const updatePkg = (setter, pkgs, index, field, val) => {
    const newPkgs = [...pkgs];
    newPkgs[index][field] = val;
    setter(newPkgs);
  };

  const addPkg = (setter, pkgs, defaultPkg) => setter([...pkgs, { ...defaultPkg }]);
  const removePkg = (setter, pkgs, index) => setter(pkgs.filter((_, i) => i !== index));

  const reset = () => {
    setResult(null);
    setAirPkgs([{ ...defaultAirPkg }]);
    setLclPkgs([{ ...defaultLCLPkg }]);
    setFclSize('20ft');
  };

  const fmtCurrency = (val, cur) => {
    const c = CURRENCIES[cur];
    const converted = val * c.rate;
    return `${c.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculate = () => {
    if (!foreignCountry.trim()) {
      setResult({ error: 'Please specify the foreign country.' });
      return;
    }

    // Export from PH is typically slightly more expensive (+20%) due to lower outbound volume
    const dirMultiplier = direction === 'Export' ? 1.20 : 1.0;

    let totalChargeable = 0;
    let totalActualWt = 0;
    let totalVolWt = 0;
    let totalCBM = 0;
    let minEstimate = 0;
    let maxEstimate = 0;

    if (mode === 'air') {
      const divisor = 6000;
      for (const p of airPkgs) {
        const l = +p.length, w = +p.width, h = +p.height, wt = +p.weight, qty = parseInt(p.quantity) || 1;
        if (!l || !w || !h || !wt) { setResult({ error: 'Please fill in all dimensions and weight for every package.' }); return; }
        
        const volWt = (l * w * h) / divisor;
        const chargeableUnit = Math.max(wt, volWt);
        
        totalActualWt += wt * qty;
        totalVolWt += volWt * qty;
        totalChargeable += chargeableUnit * qty;
      }
      minEstimate = totalChargeable * (BASE_RATES_USD.air.min * dirMultiplier);
      maxEstimate = totalChargeable * (BASE_RATES_USD.air.max * dirMultiplier);
      setResult({ type: 'air', totalVolWt: totalVolWt.toFixed(2), totalActualWt: totalActualWt.toFixed(2), totalChargeable: totalChargeable.toFixed(2), minEstimate, maxEstimate, origin: direction === 'Export' ? 'Philippines' : foreignCountry, destination: direction === 'Export' ? foreignCountry : 'Philippines', direction });

    } else if (mode === 'seaLCL') {
      for (const p of lclPkgs) {
        const l = +p.length, w = +p.width, h = +p.height, qty = parseInt(p.quantity) || 1;
        if (!l || !w || !h) { setResult({ error: 'Please fill in all dimensions for every package.' }); return; }
        
        const cbmUnit = (l / 100) * (w / 100) * (h / 100);
        totalCBM += cbmUnit * qty;
      }
      minEstimate = totalCBM * (BASE_RATES_USD.seaLCL.min * dirMultiplier);
      maxEstimate = totalCBM * (BASE_RATES_USD.seaLCL.max * dirMultiplier);
      setResult({ type: 'seaLCL', totalCBM: totalCBM.toFixed(4), minEstimate, maxEstimate, origin: direction === 'Export' ? 'Philippines' : foreignCountry, destination: direction === 'Export' ? foreignCountry : 'Philippines', direction });

    } else {
      minEstimate = (fclSize === '20ft' ? BASE_RATES_USD.seaFCL20.min : BASE_RATES_USD.seaFCL40.min) * dirMultiplier;
      maxEstimate = (fclSize === '20ft' ? BASE_RATES_USD.seaFCL20.max : BASE_RATES_USD.seaFCL40.max) * dirMultiplier;
      setResult({ type: 'seaFCL', containerSize: fclSize, minEstimate, maxEstimate, origin: direction === 'Export' ? 'Philippines' : foreignCountry, destination: direction === 'Export' ? foreignCountry : 'Philippines', direction });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
           Francess Logistic Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Freight Cost Estimator</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Get an instant price range estimate for Air, Sea LCL, or Sea FCL shipments.
          </p>
          <p className="text-teal-200 text-sm mt-2 flex items-center justify-center gap-1">
            <FaExclamationTriangle /> Estimates are indicative only. Final rates may vary based on market conditions.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        
        {/* Top Controls: Route & Currency */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><FaGlobeAsia /> Route Details</h3>
          
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Direction */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Direction</label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setDirection('Import')}
                  className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${direction === 'Import' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-teal-700'}`}
                >
                  Import (To PH)
                </button>
                <button 
                  onClick={() => setDirection('Export')}
                  className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${direction === 'Export' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-teal-700'}`}
                >
                  Export (From PH)
                </button>
              </div>
            </div>

            {/* Foreign Country Dropdown */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                {direction === 'Import' ? 'Origin Country' : 'Destination Country'}
              </label>
              <select
                value={foreignCountry}
                onChange={(e) => setForeignCountry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="" disabled>Select Country...</option>
                {foreignCountries.map((c, i) => (
                  <option key={i} value={c.value || c.label}>{c.label || c.value}</option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div className="sm:w-32">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                {Object.keys(CURRENCIES).map(cur => (
                  <option key={cur} value={cur}>{CURRENCIES[cur].label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); reset(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-sm font-semibold transition-all ${mode === m.id ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
              <span className="sm:hidden">{m.short}</span>
            </button>
          ))}
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className={`px-6 py-4 text-white flex items-center gap-2 ${mode === 'air' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : mode === 'seaLCL' ? 'bg-gradient-to-r from-cyan-600 to-teal-500' : 'bg-gradient-to-r from-teal-600 to-emerald-500'}`}>
            <span className="text-xl">{MODES.find(m2 => m2.id === mode).icon}</span>
            <div>
              <h2 className="text-lg font-bold">{MODES.find(m2 => m2.id === mode).label}</h2>
              <p className="text-xs opacity-80 mt-0.5">
                {mode === 'air' && 'Charged by whichever is greater: actual or volume weight'}
                {mode === 'seaLCL' && 'Charged by total cubic meters (CBM)'}
                {mode === 'seaFCL' && 'Flat rate range per container size'}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Formula Reference */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6 text-xs text-slate-500 font-mono space-y-1">
              {mode === 'air' && (<>
                <div>Vol. Weight (kg) = (L × W × H) ÷ 6,000</div>
                <div>Chargeable Wt = max(Actual Wt, Vol Wt) × Qty</div>
              </>)}
              {mode === 'seaLCL' && (<>
                <div>CBM = (L ÷ 100) × (W ÷ 100) × (H ÷ 100) × Qty</div>
              </>)}
              {mode === 'seaFCL' && (<>
                <div><FaBoxOpen className="inline" /> 20ft — standard container (~25 tons)</div>
                <div><FaBoxOpen className="inline" /> 40ft — large container (~27 tons)</div>
              </>)}
            </div>

            {/* Inputs Air */}
            {mode === 'air' && (
              <div className="space-y-4">
                {airPkgs.map((pkg, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4 relative bg-white shadow-sm">
                    {airPkgs.length > 1 && (
                      <button onClick={() => removePkg(setAirPkgs, airPkgs, i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors">
                        <FaTrash size={12} />
                      </button>
                    )}
                    <div className="font-semibold text-slate-700 text-sm mb-3">Package {i + 1}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <InputField label="L (cm)" value={pkg.length} onChange={v => updatePkg(setAirPkgs, airPkgs, i, 'length', v)} placeholder="50" />
                      <InputField label="W (cm)" value={pkg.width} onChange={v => updatePkg(setAirPkgs, airPkgs, i, 'width', v)} placeholder="40" />
                      <InputField label="H (cm)" value={pkg.height} onChange={v => updatePkg(setAirPkgs, airPkgs, i, 'height', v)} placeholder="30" />
                      <InputField label="Wt (kg)" value={pkg.weight} onChange={v => updatePkg(setAirPkgs, airPkgs, i, 'weight', v)} placeholder="10" />
                      <InputField label="Qty" value={pkg.quantity} onChange={v => updatePkg(setAirPkgs, airPkgs, i, 'quantity', v)} placeholder="1" />
                    </div>
                  </div>
                ))}
                <button onClick={() => addPkg(setAirPkgs, airPkgs, defaultAirPkg)} className="flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors py-2 px-1">
                  <FaPlus size={12} /> Add Another Package
                </button>
              </div>
            )}

            {/* Inputs Sea LCL */}
            {mode === 'seaLCL' && (
              <div className="space-y-4">
                {lclPkgs.map((pkg, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4 relative bg-white shadow-sm">
                    {lclPkgs.length > 1 && (
                      <button onClick={() => removePkg(setLclPkgs, lclPkgs, i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors">
                        <FaTrash size={12} />
                      </button>
                    )}
                    <div className="font-semibold text-slate-700 text-sm mb-3">Package {i + 1}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <InputField label="L (cm)" value={pkg.length} onChange={v => updatePkg(setLclPkgs, lclPkgs, i, 'length', v)} placeholder="120" />
                      <InputField label="W (cm)"  value={pkg.width} onChange={v => updatePkg(setLclPkgs, lclPkgs, i, 'width', v)} placeholder="80" />
                      <InputField label="H (cm)" value={pkg.height} onChange={v => updatePkg(setLclPkgs, lclPkgs, i, 'height', v)} placeholder="100" />
                      <InputField label="Qty" value={pkg.quantity} onChange={v => updatePkg(setLclPkgs, lclPkgs, i, 'quantity', v)} placeholder="1" />
                    </div>
                  </div>
                ))}
                <button onClick={() => addPkg(setLclPkgs, lclPkgs, defaultLCLPkg)} className="flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors py-2 px-1">
                  <FaPlus size={12} /> Add Another Package
                </button>
              </div>
            )}

            {/* Inputs Sea FCL */}
            {mode === 'seaFCL' && (
              <div className="grid grid-cols-2 gap-4">
                {['20ft', '40ft'].map(size => (
                  <button
                    key={size}
                    onClick={() => setFclSize(size)}
                    className={`border-2 rounded-xl p-5 text-center transition-all ${fclSize === size ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <div className="text-3xl mb-2 flex justify-center text-teal-600">
                      <FaBoxOpen />
                    </div>
                    <div className="font-bold text-lg">{size} Container</div>
                    <div className="text-xs mt-1 opacity-60">{size === '20ft' ? '~25–26 tons capacity' : '~27–28 tons capacity'}</div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={calculate}
              className="mt-6 w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
            >
               Calculate Estimated Range
            </button>
          </div>

          {/* Error */}
          {result?.error && (
            <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-center gap-2">
              <FaExclamationTriangle /> {result.error}
            </div>
          )}

          {/* Result */}
          {result && !result.error && (
            <div className={`border-t mx-6 mb-6 rounded-xl overflow-hidden border border-teal-200`}>
              <div className={`px-5 py-2.5 text-sm font-semibold bg-teal-50 text-teal-800 flex items-center gap-2`}>
                <FaCheckCircle /> Breakdown & Estimated Range
              </div>
              <div className="px-5 py-4 space-y-1">
                
                {/* Route Header */}
                <div className="bg-teal-100 text-teal-900 rounded-lg p-3 mb-4 flex items-center gap-3">
                  <FaMapMarkerAlt className="text-teal-600 text-xl" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">{result.direction}</div>
                    <div className="text-sm font-semibold">From {result.origin} to {result.destination}</div>
                  </div>
                </div>

                {result.type === 'air' && (<>
                  <Row label="Total Volume Weight" value={`${result.totalVolWt} kg`} />
                  <Row label="Total Actual Weight" value={`${result.totalActualWt} kg`} />
                  <Row label="Total Chargeable Weight" value={`${result.totalChargeable} kg`} bold />
                </>)}
                {result.type === 'seaLCL' && (<>
                  <Row label="Total CBM" value={`${result.totalCBM} m³`} bold />
                </>)}
                {result.type === 'seaFCL' && (<>
                  <Row label="Container Size" value={result.containerSize} bold />
                </>)}

                <div className="mt-4 bg-teal-600 text-white rounded-lg px-5 py-4 flex flex-col justify-center items-center text-center">
                  <span className="font-semibold text-teal-100 text-sm mb-1 uppercase tracking-wider">Estimated Price Range</span>
                  <div className="text-3xl font-bold flex flex-wrap items-center justify-center gap-2">
                    <span>{fmtCurrency(result.minEstimate, currency)}</span>
                    <span className="text-teal-200 font-normal">to</span>
                    <span>{fmtCurrency(result.maxEstimate, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
          Estimates are for reference only and do not constitute a binding quote. Surcharges, fuel costs, and other fees may apply.{' '}
          <Link to="/ShippingInquiry" className="text-teal-600 underline">Submit a request</Link> for an official quotation.
        </p>
      </div>
    </div>
  );
}
