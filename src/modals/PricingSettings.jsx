import React, { useState, useEffect } from 'react';
import { db } from '../jsfile/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../utils/AuthContext';

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
    <input
      type="number" min="0" value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
    />
  </div>
);

function PricingSettings({ show, onHide }) {
  const { role, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState({
    airRatePerKg: '',
    airDivisor: '6000',
    lclRatePerCBM: '',
    fcl20Rate: '',
    fcl40Rate: '',
  });

  useEffect(() => {
    if (!show) return;
    getDoc(doc(db, 'config', 'pricing')).then(snap => {
      if (!snap.exists()) return;
      const d = snap.data();
      setRates({
        airRatePerKg:   d.air?.ratePerKg   ?? '',
        airDivisor:     d.air?.divisor      ?? 6000,
        lclRatePerCBM:  d.seaLCL?.ratePerCBM ?? '',
        fcl20Rate:      d.seaFCL?.rate20ft   ?? '',
        fcl40Rate:      d.seaFCL?.rate40ft   ?? '',
      });
    }).catch(console.error);
  }, [show]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'pricing'), {
        air:    { divisor: parseFloat(rates.airDivisor) || 6000, ratePerKg: parseFloat(rates.airRatePerKg) || 0 },
        seaLCL: { ratePerCBM: parseFloat(rates.lclRatePerCBM) || 0 },
        seaFCL: { rate20ft: parseFloat(rates.fcl20Rate) || 0, rate40ft: parseFloat(rates.fcl40Rate) || 0 },
      });
      toast.success('Pricing rates updated successfully!');
      onHide();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save rates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // All hooks above this — early returns after
  if (loading || !(role === 'admin' || role === 'staff')) return null;

  const set = key => val => setRates(r => ({ ...r, [key]: val }));

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>💰 Pricing Rates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-5">
          <div>
            <h6 className="font-bold text-gray-800 border-b pb-1 mb-3">✈️ Air Freight</h6>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Rate per kg (₱)" value={rates.airRatePerKg} onChange={set('airRatePerKg')} placeholder="e.g. 250" />
              <Field label="Volume Divisor (cm³/kg) — standard is 6000" value={rates.airDivisor} onChange={set('airDivisor')} placeholder="6000" />
            </div>
          </div>
          <div>
            <h6 className="font-bold text-gray-800 border-b pb-1 mb-3">🚢 Sea Freight — LCL</h6>
            <Field label="Rate per CBM (₱)" value={rates.lclRatePerCBM} onChange={set('lclRatePerCBM')} placeholder="e.g. 3500" />
          </div>
          <div>
            <h6 className="font-bold text-gray-800 border-b pb-1 mb-3">🛢️ Sea Freight — FCL</h6>
            <div className="grid grid-cols-1 gap-3">
              <Field label="20ft Container Flat Rate (₱)" value={rates.fcl20Rate} onChange={set('fcl20Rate')} placeholder="e.g. 85000" />
              <Field label="40ft Container Flat Rate (₱)" value={rates.fcl40Rate} onChange={set('fcl40Rate')} placeholder="e.g. 145000" />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Leave a field at 0 or blank to show "Contact us for a quote" on the estimator.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>Cancel</Button>
        <Button variant="success" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Rates'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PricingSettings;
