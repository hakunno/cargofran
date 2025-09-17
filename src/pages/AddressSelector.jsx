import addressData from '../data/philippines-addresses.json';
import { useState, useEffect } from 'react';

const AddressSelector = ({ onSelect }) => {
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');

  useEffect(() => {
    setRegionList(addressData);
  }, []);

  // Notify parent component of address changes
  useEffect(() => {
    if (onSelect) {
      onSelect({
        region: selectedRegion,
        province: selectedProvince,
        city: selectedCity,
        barangay: selectedBarangay,
      });
    }
  }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay, onSelect]);

  const handleRegionChange = (e) => {
    const regionName = e.target.value;
    setSelectedRegion(regionName);
    const region = addressData.find((r) => r.region === regionName);
    setProvinceList(region?.provinces || []);
    setCityList([]);
    setBarangayList([]);
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedBarangay('');
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const region = addressData.find((r) => r.region === selectedRegion);
    const province = region?.provinces.find((p) => p.province === provinceName);
    setCityList(province?.cities || []);
    setBarangayList([]);
    setSelectedCity('');
    setSelectedBarangay('');
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const region = addressData.find((r) => r.region === selectedRegion);
    const province = region?.provinces.find((p) => p.province === selectedProvince);
    const city = province?.cities.find((c) => c.city === cityName);
    setBarangayList(city?.barangays || []);
    setSelectedBarangay('');
  };

  const baseSelectClasses = `
    w-full p-2 rounded-md border border-gray-300 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 text-gray-700">Region</label>
        <select
          className={baseSelectClasses}
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">Select Region</option>
          {regionList.map((r, i) => (
            <option key={i} value={r.region}>{r.region}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Province</label>
        <select
          className={baseSelectClasses}
          value={selectedProvince}
          onChange={handleProvinceChange}
          disabled={!provinceList.length}
        >
          <option value="">Select Province</option>
          {provinceList.map((p, i) => (
            <option key={i} value={p.province}>{p.province}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">City/Mun.</label>
        <select
          className={baseSelectClasses}
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!cityList.length}
        >
          <option value="">Select City/Municipality</option>
          {cityList.map((c, i) => (
            <option key={i} value={c.city}>{c.city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Barangay</label>
        <select
          className={baseSelectClasses}
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
          disabled={!barangayList.length}
        >
          <option value="">Select Barangay</option>
          {barangayList.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;