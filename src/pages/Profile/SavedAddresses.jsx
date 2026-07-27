import React, { useState } from 'react';
import { Home, Briefcase, Plus, MoreVertical } from 'lucide-react';

const AddressCard = ({ type, address, isDefault }) => (
  <div className="border border-[#EBE3D5] rounded-xl p-5 mb-4 relative group">
    <div className="absolute top-5 right-5 text-gray-400 hover:text-cafe-dark cursor-pointer">
      <MoreVertical size={16} />
    </div>
    
    <div className="flex items-center gap-3 mb-3">
      <div className="text-cafe-accent">
        {type === 'Home' ? <Home size={18} /> : <Briefcase size={18} />}
      </div>
      <h4 className="font-semibold text-cafe-dark text-sm">{type}</h4>
      {isDefault && <span className="bg-[#F8F5F0] text-[#A26D51] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-[#EBE3D5]">Default</span>}
    </div>
    
    <p className="text-sm text-text-secondary leading-relaxed w-5/6">
      {address}
    </p>
  </div>
);

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", address: "Flat 402, Sunshine Apartments, 12 Brew Boulevard, New Delhi, 110001", isDefault: true },
    { id: 2, type: "Work", address: "Tech Park, Tower B, 3rd Floor, Cyber City, Gurgaon, 122002", isDefault: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', address: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAddress.address) return;
    setAddresses([...addresses, { id: Date.now(), type: newAddress.type, address: newAddress.address, isDefault: false }]);
    setNewAddress({ type: 'Home', address: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-cafe-dark">Saved Addresses</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-[10px] font-semibold text-white bg-cafe-darker px-4 py-2 rounded-sm uppercase tracking-widest hover:bg-black transition-colors"
        >
          {showAddForm ? 'Cancel' : <><Plus size={14} /> Add New</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-6 p-4 border border-[#EBE3D5] rounded-xl bg-[#F8F5F0] animate-fade-in">
          <h4 className="font-semibold text-sm mb-3">Add New Address</h4>
          <div className="mb-3">
            <select 
              className="w-full p-2 border border-[#EBE3D5] rounded bg-white text-sm focus:outline-none"
              value={newAddress.type}
              onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <textarea 
              className="w-full p-2 border border-[#EBE3D5] rounded bg-white text-sm focus:outline-none resize-none"
              rows="3"
              placeholder="Enter full address..."
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            />
          </div>
          <button type="submit" className="text-xs bg-cafe-dark text-white px-4 py-2 rounded uppercase tracking-wider font-semibold">Save Address</button>
        </form>
      )}

      <div>
        {addresses.map((addr) => (
          <AddressCard 
            key={addr.id}
            type={addr.type} 
            address={addr.address}
            isDefault={addr.isDefault}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses;
