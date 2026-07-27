import React from 'react';

const AccountSettings = () => {
  return (
    <div>
      <h2 className="font-serif text-2xl text-cafe-dark mb-6">Account Settings</h2>
      
      <form className="max-w-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-cafe-dark tracking-wide">First Name</label>
            <input type="text" defaultValue="Digvijay" className="border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-cafe-dark tracking-wide">Last Name</label>
            <input type="text" defaultValue="Pundir" className="border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-cafe-dark tracking-wide">Email Address</label>
          <input type="email" defaultValue="digvijay@example.com" className="border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-cafe-dark tracking-wide">Phone Number</label>
          <input type="tel" defaultValue="+91 98765 43210" className="border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
        </div>

        <div className="pt-4 mt-6 border-t border-[#EBE3D5]">
          <h3 className="font-semibold text-cafe-dark mb-4">Change Password</h3>
          <div className="space-y-4">
            <input type="password" placeholder="Current Password" className="w-full border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
            <input type="password" placeholder="New Password" className="w-full border border-[#EBE3D5] rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cafe-accent" />
          </div>
        </div>

        <button type="button" className="bg-[#132014] text-white py-3 px-6 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-black transition-colors mt-4">
          SAVE CHANGES
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
