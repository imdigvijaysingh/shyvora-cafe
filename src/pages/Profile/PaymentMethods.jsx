import React, { useState } from 'react';
import { CreditCard, Plus, MoreVertical } from 'lucide-react';

const PaymentCard = ({ brand, last4, expiry, isDefault }) => (
  <div className="border border-[#EBE3D5] rounded-xl p-5 mb-4 relative group flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500 border border-gray-200">
        <CreditCard size={18} />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-semibold text-cafe-dark text-sm">{brand}</h4>
          {isDefault && <span className="bg-[#F8F5F0] text-[#A26D51] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-[#EBE3D5]">Default</span>}
        </div>
        <p className="text-xs text-text-secondary">
          **** **** **** {last4} • Expires {expiry}
        </p>
      </div>
    </div>
    <div className="text-gray-400 hover:text-cafe-dark cursor-pointer p-2">
      <MoreVertical size={16} />
    </div>
  </div>
);

const PaymentMethods = () => {
  const [cards, setCards] = useState([
    { id: 1, brand: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
    { id: 2, brand: "Mastercard", last4: "8821", expiry: "08/27", isDefault: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ brand: 'Visa', last4: '', expiry: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCard.last4 || !newCard.expiry) return;
    setCards([...cards, { id: Date.now(), brand: newCard.brand, last4: newCard.last4.slice(-4), expiry: newCard.expiry, isDefault: false }]);
    setNewCard({ brand: 'Visa', last4: '', expiry: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-cafe-dark">Payment Methods</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-[10px] font-semibold text-white bg-cafe-darker px-4 py-2 rounded-sm uppercase tracking-widest hover:bg-black transition-colors"
        >
          {showAddForm ? 'Cancel' : <><Plus size={14} /> Add Card</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-6 p-4 border border-[#EBE3D5] rounded-xl bg-[#F8F5F0] animate-fade-in">
          <h4 className="font-semibold text-sm mb-3">Add New Card</h4>
          <div className="mb-3">
            <select 
              className="w-full p-2 border border-[#EBE3D5] rounded bg-white text-sm focus:outline-none"
              value={newCard.brand}
              onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">Amex</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input 
              type="text"
              maxLength="16"
              className="w-full p-2 border border-[#EBE3D5] rounded bg-white text-sm focus:outline-none"
              placeholder="Card Number"
              value={newCard.last4}
              onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
            />
            <input 
              type="text"
              maxLength="5"
              className="w-full p-2 border border-[#EBE3D5] rounded bg-white text-sm focus:outline-none"
              placeholder="MM/YY"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
            />
          </div>
          <button type="submit" className="text-xs bg-cafe-dark text-white px-4 py-2 rounded uppercase tracking-wider font-semibold">Save Card</button>
        </form>
      )}

      <div>
        {cards.map((card) => (
          <PaymentCard 
            key={card.id}
            brand={card.brand} 
            last4={card.last4} 
            expiry={card.expiry} 
            isDefault={card.isDefault} 
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
