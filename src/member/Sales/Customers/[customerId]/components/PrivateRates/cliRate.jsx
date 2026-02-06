import React, { useState, useEffect } from 'react';

const DATA_MODEL = {
  countryCode: '',
  country: '',
  qualityDescription: '',
  rate: '',
  status: 'Inactive',
  billingCycle: '',
  rtp: '',
  asr: '',
  acd: '',
  testStatus: 'no',
  prefix: ''
};

const CliRateModal = ({ isOpen, onClose, onSubmit }) => {

  const [newLead, setNewLead] = useState(DATA_MODEL);

  useEffect(() => {
    setNewLead(DATA_MODEL);
  }, []);

  const handleAddLead = (e) => {
    e.preventDefault();
    onSubmit(newLead);
    setNewLead(DATA_MODEL);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add New Rate</h3>
        <form onSubmit={handleAddLead}>
          <input type="text" placeholder="Country Code" value={newLead.countryCode} onChange={(e) => setNewLead({ ...newLead, countryCode: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <input type="text" placeholder="Country" value={newLead.country} onChange={(e) => setNewLead({ ...newLead, country: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <input type="text" placeholder="Quality Description" value={newLead.qualityDescription} onChange={(e) => setNewLead({ ...newLead, qualityDescription: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <input type="number" placeholder="Rate" value={newLead.rate} onChange={(e) => setNewLead({ ...newLead, rate: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <input type="text" placeholder="Billing Cycle" value={newLead.billingCycle} onChange={(e) => setNewLead({ ...newLead, billingCycle: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="RTP" value={newLead.rtp} onChange={(e) => setNewLead({ ...newLead, rtp: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="ASR" value={newLead.asr} onChange={(e) => setNewLead({ ...newLead, asr: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="ACD" value={newLead.acd} onChange={(e) => setNewLead({ ...newLead, acd: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="prefix" value={newLead.prefix} onChange={(e) => setNewLead({ ...newLead, prefix: e.target.value })} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <label className="flex items-center mb-4">
            <span className="mr-2">Status:</span>
            <select
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Add Rate</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CliRateModal;