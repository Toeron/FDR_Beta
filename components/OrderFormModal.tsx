
import React, { useState } from 'react';
import { CartItem } from '../types';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, items, total }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', message: '' });
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateSummaryText = () => {
    const itemStrings = items.map(item => {
      const priceText = typeof item.price === 'number'
        ? `€${(item.price * item.quantity).toFixed(2)}`
        : item.price === 'Upon Request' ? 'Price Upon Request' : 'Sold Out';
      const catText = item.catalogNumber ? ` [REF: ${item.catalogNumber}]` : '';
      return `- ${item.artist} - ${item.title}${catText} (x${item.quantity}) - [${priceText}]`;
    }).join('\n');

    const hasRequest = items.some(i => i.price === 'Upon Request');
    const totalText = hasRequest ? `€${total.toFixed(2)} + items with price upon request` : `€${total.toFixed(2)}`;

    return `FLYING DRAGON RECORDS - ORDER INQUIRY\n--------------------------------------\nCUSTOMER DETAILS:\nName: ${formData.name}\nEmail: ${formData.email}\nShipping Address: \n${formData.address}\n\nORDER ITEMS:\n${itemStrings}\n\nTOTAL ESTIMATE: ${totalText}\n\nMESSAGE:\n${formData.message || 'No additional message.'}\n--------------------------------------\nPlease copy this entire block and paste it into your email to Kips1963@gmail.com`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setShowSummary(true); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative bg-[#0a0a0a] border-2 border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in duration-300 p-10 md:p-14 rounded-sm">
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-400 hover:text-[#d4af37] transition-colors bg-zinc-900 p-2 rounded-full">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!showSummary ? (
          <>
            <div className="mb-10">
              <h2 className="font-metal text-[#d4af37] text-4xl uppercase tracking-widest mb-4">Order Form</h2>
              <p className="text-zinc-300 text-xs uppercase tracking-[0.3em] font-bold border-l-4 border-[#b22222] pl-4 py-2">Provide your details to generate your order inquiry</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-3">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black border-2 border-zinc-800 focus:border-[#d4af37] text-white px-6 py-4 outline-none transition-all font-bold" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-3">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black border-2 border-zinc-800 focus:border-[#d4af37] text-white px-6 py-4 outline-none transition-all font-bold" placeholder="your@email.com" />
              </div>

              <div>
                <label className="block text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-3">Shipping Address</label>
                <textarea required rows={4} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-black border-2 border-zinc-800 focus:border-[#d4af37] text-white px-6 py-4 outline-none transition-all resize-none font-bold" placeholder="Enter full shipping destination" />
              </div>

              <div>
                <label className="block text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-3">Message (Optional)</label>
                <textarea rows={2} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-black border-2 border-zinc-800 focus:border-[#d4af37] text-white px-6 py-4 outline-none transition-all resize-none font-bold" placeholder="Special requests or questions" />
              </div>

              <button type="submit" className="w-full bg-[#b22222] hover:bg-white hover:text-black text-white text-[12px] font-black uppercase tracking-[0.4em] py-6 text-center transition-all shadow-[0_20px_50px_rgba(178,34,34,0.4)]">
                Generate Order Summary
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className="mb-10 text-center">
              <div className="w-24 h-24 bg-green-900/10 border-2 border-green-500/50 flex items-center justify-center rounded-full mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-metal text-[#d4af37] text-3xl uppercase tracking-widest mb-4">Summary Ready</h2>
              <div className="space-y-4">
                <p className="text-zinc-300 text-xs uppercase tracking-[0.3em] font-bold">Copy the text below and send to: Kips1963@gmail.com</p>
                <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold italic">You will then receive an invoice incl. shipping costs and payment options.</p>
              </div>
            </div>

            <div className="relative group">
              <textarea readOnly rows={12} value={generateSummaryText()} className="w-full bg-black border-2 border-zinc-800 text-zinc-300 font-mono text-sm p-8 outline-none transition-all resize-none custom-scrollbar leading-relaxed" />
              <button onClick={handleCopy} className={`absolute top-6 right-6 px-6 py-3 text-[10px] uppercase font-black tracking-[0.3em] transition-all shadow-2xl ${copied ? 'bg-green-600 text-white' : 'bg-[#d4af37] text-black hover:bg-white'}`}>
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-800 space-y-6">
              <button onClick={() => setShowSummary(false)} className="w-full border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#d4af37] text-[11px] font-black uppercase tracking-[0.4em] py-5 text-center transition-all">
                Return to Order Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFormModal;
