import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaShip, FaBoxOpen, FaInfoCircle, FaChevronUp, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';

const CURRENCIES = {
  PHP: { label: 'PHP', rate: 58, symbol: '₱' },
  USD: { label: 'USD', rate: 1, symbol: '$' },
  EUR: { label: 'EUR', rate: 0.92, symbol: '€' },
  GBP: { label: 'GBP', rate: 0.79, symbol: '£' },
  JPY: { label: 'JPY', rate: 155, symbol: '¥' }
};

const BASE_RATES_USD = {
  air: { min: 3, max: 8 },        
  seaLCL: { min: 50, max: 120 },  
  seaFCL20: { min: 800, max: 1500 }, 
  seaFCL40: { min: 1200, max: 2500 }  
};

export default function FreightEstimateWidget({ transportMode, loadType, packages, shipmentDirection, senderCountry, destinationCountry }) {
  const [open, setOpen] = useState(true);
  const [currency, setCurrency] = useState('PHP');

  const mode = (() => {
    if (transportMode === 'Air') return 'air';
    if (transportMode === 'Sea' && loadType === 'LCL') return 'seaLCL';
    if (transportMode === 'Sea' && loadType === 'FCL') return null; 
    return null;
  })();

  const fmtCurrency = (val, cur) => {
    const c = CURRENCIES[cur];
    const converted = val * c.rate;
    return `${c.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const dirMultiplier = shipmentDirection === 'Export' ? 1.20 : 1.0;

  const RouteHeader = () => {
    if (!shipmentDirection || (!senderCountry && !destinationCountry)) return null;
    return (
      <div className="bg-white/50 rounded p-2 mb-3 flex items-center gap-2 border border-black/5">
        <FaMapMarkerAlt className="text-teal-600" />
        <span className="text-xs font-semibold text-slate-700">
          <span className="uppercase text-teal-700 mr-1">{shipmentDirection}:</span> 
          From {senderCountry || 'Origin'} to {destinationCountry || 'Destination'}
        </span>
      </div>
    );
  };

  // FCL Block
  if (transportMode === 'Sea' && loadType === 'FCL') {
    return (
      <div className="mt-4 bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-teal-800 flex items-center gap-2">
            <FaBoxOpen /> FCL Estimated Base Range
          </div>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white border border-teal-200 rounded px-2 py-1 text-xs font-bold text-teal-800 focus:outline-none"
          >
            {Object.keys(CURRENCIES).map(cur => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
        
        <RouteHeader />

        <div className="flex justify-between text-slate-700">
          <span>20ft Container</span>
          <span className="font-bold">{fmtCurrency(BASE_RATES_USD.seaFCL20.min * dirMultiplier, currency)} – {fmtCurrency(BASE_RATES_USD.seaFCL20.max * dirMultiplier, currency)}</span>
        </div>
        <div className="flex justify-between text-slate-700 mt-1">
          <span>40ft Container</span>
          <span className="font-bold">{fmtCurrency(BASE_RATES_USD.seaFCL40.min * dirMultiplier, currency)} – {fmtCurrency(BASE_RATES_USD.seaFCL40.max * dirMultiplier, currency)}</span>
        </div>
        <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
          <FaInfoCircle /> Flat rate range per container. <Link to="/PriceEstimator" className="underline font-semibold ml-1" target="_blank">Open full estimator</Link>
        </p>
      </div>
    );
  }

  // Air & LCL Block
  if (!transportMode || !packages?.length) return null;
  if (transportMode === 'Road') return null;
  
  const validPackages = packages.filter(p => p.length && p.width && p.height && (mode === 'seaLCL' ? true : p.weight));
  if (!validPackages.length) return null;
  if (!mode) return null;

  if (mode === 'air') {
    const divisor = 6000;
    const rows = validPackages.map((pkg, i) => {
      const volWt = (parseFloat(pkg.length) * parseFloat(pkg.width) * parseFloat(pkg.height)) / divisor;
      const actWt = parseFloat(pkg.weight);
      const chargeable = Math.max(volWt, actWt);
      return { i, volWt, actWt, chargeable };
    });

    const totalChargeable = rows.reduce((s, r) => s + r.chargeable, 0);
    const minEstimate = totalChargeable * (BASE_RATES_USD.air.min * dirMultiplier);
    const maxEstimate = totalChargeable * (BASE_RATES_USD.air.max * dirMultiplier);

    return (
      <div className="mt-4 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition"
        >
          <span className="flex items-center gap-2"><FaPlane /> Air Freight Estimate</span>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {open && (
          <div className="bg-white px-4 py-3 space-y-2 text-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-slate-500 font-mono">
                Chargeable = max(Actual, Vol)
              </div>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border border-blue-200 rounded px-2 py-1 text-xs font-bold text-blue-800 focus:outline-none"
              >
                {Object.keys(CURRENCIES).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>
            
            <RouteHeader />

            {rows.map(r => (
              <div key={r.i} className="flex justify-between text-slate-700 border-b border-slate-100 pb-1">
                <span>Pkg {r.i + 1} — Vol: {r.volWt.toFixed(2)}kg / Act: {r.actWt}kg</span>
                <span className="font-semibold">Chargeable: {r.chargeable.toFixed(2)}kg</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-slate-900 pt-1">
              <span>Total Chargeable Weight</span>
              <span>{totalChargeable.toFixed(2)} kg</span>
            </div>
            
            <div className="bg-blue-600 text-white rounded-lg px-4 py-3 mt-3 text-center">
              <div className="text-blue-100 text-xs mb-1 uppercase tracking-wider font-semibold">Estimated Price Range</div>
              <div className="text-xl font-bold flex justify-center gap-1">
                <span>{fmtCurrency(minEstimate, currency)}</span>
                <span className="text-blue-200 font-normal">to</span>
                <span>{fmtCurrency(maxEstimate, currency)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'seaLCL') {
    const rows = validPackages.map((pkg, i) => {
      const cbm = (parseFloat(pkg.length) / 100) * (parseFloat(pkg.width) / 100) * (parseFloat(pkg.height) / 100);
      return { i, cbm };
    });

    const totalCBM = rows.reduce((s, r) => s + r.cbm, 0);
    const minEstimate = totalCBM * (BASE_RATES_USD.seaLCL.min * dirMultiplier);
    const maxEstimate = totalCBM * (BASE_RATES_USD.seaLCL.max * dirMultiplier);

    return (
      <div className="mt-4 border border-cyan-200 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 hover:bg-cyan-100 transition"
        >
          <span className="flex items-center gap-2"><FaShip /> Sea LCL Freight Estimate</span>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {open && (
          <div className="bg-white px-4 py-3 space-y-2 text-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-slate-500 font-mono">
                CBM = (L ÷ 100) × (W ÷ 100) × (H ÷ 100)
              </div>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border border-cyan-200 rounded px-2 py-1 text-xs font-bold text-cyan-800 focus:outline-none"
              >
                {Object.keys(CURRENCIES).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>

            <RouteHeader />

            {rows.map(r => (
              <div key={r.i} className="flex justify-between text-slate-700 border-b border-slate-100 pb-1">
                <span>Package {r.i + 1}</span>
                <span className="font-semibold">{r.cbm.toFixed(4)} m³</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-slate-900 pt-1">
              <span>Total CBM</span>
              <span>{totalCBM.toFixed(4)} m³</span>
            </div>
            
            <div className="bg-cyan-600 text-white rounded-lg px-4 py-3 mt-3 text-center">
              <div className="text-cyan-100 text-xs mb-1 uppercase tracking-wider font-semibold">Estimated Price Range</div>
              <div className="text-xl font-bold flex justify-center gap-1">
                <span>{fmtCurrency(minEstimate, currency)}</span>
                <span className="text-cyan-200 font-normal">to</span>
                <span>{fmtCurrency(maxEstimate, currency)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
