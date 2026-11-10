import React from 'react';
import { CheckCircle2, Download, Printer, X, MessageSquare, Coffee } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCafeData } from '../context/CafeDataContext';

const InvoiceModal = ({ isOpen, onClose, orderData }) => {
  const { formatPrice } = useCurrency();
  const { settings } = useCafeData();

  if (!isOpen || !orderData) return null;

  const {
    invoiceId,
    customerName,
    customerPhone,
    orderType,
    tableOrAddress,
    specialNotes,
    items = [],
    subtotal,
    deliveryFee = 0,
    discount = 0,
    total,
    paymentMethod,
    paymentStatus = 'Pending',
    paymentId,
    date = new Date().toLocaleString()
  } = orderData;

  const whatsappPhone = settings?.whatsappNumber || '9458082654';
  const countryCode = settings?.whatsappCountryCode || '91';

  // Format message for owner on WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `☕ *BREW & BLOOM CAFE - NEW ORDER*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📄 *Invoice:* ${invoiceId}\n`;
    msg += `📅 *Date:* ${date}\n`;
    msg += `👤 *Customer:* ${customerName}\n`;
    msg += `📞 *Phone:* ${customerPhone}\n`;
    if (orderType === 'Dine-in') {
      msg += `📍 *Order Mode:* Dine-In (Table Preference: ${tableOrAddress || 'Any Available'})\n`;
    } else if (orderType === 'Takeaway') {
      msg += `📍 *Order Mode:* Takeaway / Counter Pickup${tableOrAddress ? ` (${tableOrAddress})` : ''}\n`;
    } else {
      msg += `📍 *Order Mode:* Delivery (Address: ${tableOrAddress})\n`;
    }
    msg += `💳 *Payment:* ${paymentStatus.toUpperCase()} (${paymentMethod})\n`;
    if (paymentId) {
      msg += `🆔 *Payment ID:* ${paymentId}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛒 *ORDERED ITEMS:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.quantity}x ${item.name || item.title} - ${formatPrice(item.price * item.quantity)}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (discount > 0) {
      msg += `🏷️ *Discount:* -${formatPrice(discount)}\n`;
    }
    if (deliveryFee > 0) {
      msg += `🚚 *Delivery:* ${formatPrice(deliveryFee)}\n`;
    }
    msg += `💰 *TOTAL AMOUNT:* ${formatPrice(total)}\n`;
    if (specialNotes) {
      msg += `📝 *Notes:* ${specialNotes}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please prepare my order. Thank you! 🙏`;

    return encodeURIComponent(msg);
  };

  const handleSendToWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${countryCode}${whatsappPhone}?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#EBE3D5] print:border-none print:shadow-none print:max-w-none print:m-0 animate-fade-in-up">
        
        {/* Header - Not printed */}
        <div className="flex justify-between items-center px-6 py-4 bg-cafe-dark text-white print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <h3 className="font-serif text-lg font-semibold tracking-wide">Order Confirmed</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div id="cafe-invoice" className="p-6 sm:p-8 text-cafe-dark bg-[#FDFBF7]">
          {/* Cafe Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#EBE3D5] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Coffee size={24} className="text-cafe-accent" />
                <h2 className="font-serif text-2xl font-bold tracking-wide text-cafe-dark">Brew & Bloom</h2>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">Artisanal Coffee & Comfort Dining</p>
              <p className="text-xs text-text-secondary">12 Brew Boulevard, New Delhi • Ph: +91 9458082654</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold text-cafe-accent tracking-widest block">INVOICE BILL</span>
              <span className="font-mono text-sm font-bold text-cafe-dark">{invoiceId}</span>
              <p className="text-xs text-text-secondary mt-0.5">{date}</p>
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-[#EBE3D5]">
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">Billed To</span>
              <p className="font-semibold text-cafe-dark text-sm mt-0.5">{customerName}</p>
              <p className="text-text-secondary">{customerPhone}</p>
              {orderType === 'Dine-in' && (
                <p className="text-cafe-dark font-medium mt-1">
                  <span className="text-text-secondary font-normal">Table Preference:</span> {tableOrAddress || 'Any Available Table'}
                </p>
              )}
              {orderType === 'Takeaway' && (
                <p className="text-cafe-dark font-medium mt-1">
                  <span className="text-text-secondary font-normal">Pickup:</span> Counter Pickup{tableOrAddress ? ` (${tableOrAddress})` : ''}
                </p>
              )}
              {orderType === 'Delivery' && tableOrAddress && (
                <p className="text-cafe-dark font-medium mt-1">
                  <span className="text-text-secondary font-normal">Delivery:</span> {tableOrAddress}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">Order Details</span>
              <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-semibold bg-cafe-accent/15 text-cafe-dark">
                {orderType}
              </span>
              <div className="mt-2">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">Payment</span>
                <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold ${
                  paymentStatus.toLowerCase().includes('paid') 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {paymentStatus.toUpperCase()} ({paymentMethod})
                </span>
                {paymentId && (
                  <p className="font-mono text-[9px] text-gray-400 mt-0.5 truncate max-w-[180px] ml-auto">
                    ID: {paymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#EBE3D5] text-text-secondary text-[10px] uppercase tracking-wider">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]/60">
                {items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2.5 font-medium text-cafe-dark">{item.name || item.title}</td>
                    <td className="py-2.5 text-center text-text-secondary font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right text-text-secondary">{formatPrice(item.price)}</td>
                    <td className="py-2.5 text-right font-semibold text-cafe-dark">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation */}
          <div className="pt-3 border-t border-[#EBE3D5] space-y-1.5 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Festival Discount:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold text-cafe-dark pt-2 border-t border-[#EBE3D5]">
              <span>Grand Total:</span>
              <span className="text-cafe-accent font-serif">{formatPrice(total)}</span>
            </div>
          </div>

          {specialNotes && (
            <div className="mt-4 p-2.5 bg-white rounded-lg border border-[#EBE3D5] text-[11px] text-text-secondary">
              <span className="font-semibold text-cafe-dark block mb-0.5">Special Instructions:</span>
              <p className="italic">{specialNotes}</p>
            </div>
          )}

          {/* Bottom Note */}
          <div className="mt-6 pt-4 text-center border-t border-[#EBE3D5] text-[10px] text-text-secondary">
            <p>Thank you for choosing Brew & Bloom Cafe! Have a blissful coffee experience. ☕</p>
          </div>
        </div>

        {/* Action Buttons - Highlighted WhatsApp Button as requested */}
        <div className="p-4 sm:p-6 bg-[#F8F5F0] border-t border-[#EBE3D5] flex flex-col gap-3 print:hidden">
          
          {/* PRIMARY LARGE WHATSAPP BUTTON */}
          <button
            onClick={handleSendToWhatsApp}
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageSquare size={18} fill="currentColor" stroke="none" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="leading-tight">Send Order & Receipt to WhatsApp</span>
              <span className="text-[11px] font-normal text-white/90">Directly notifies owner at +91 {whatsappPhone}</span>
            </div>
          </button>

          {/* Secondary Actions: Print/Download Bill and Close */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-50 text-cafe-dark border border-[#EBE3D5] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Printer size={16} />
              <span>Print / Download Bill</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;

