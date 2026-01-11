
import React, { useState } from 'react';
import { CartItem } from '../types';
import OrderFormModal from './OrderFormModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  
  const numericTotal = items.reduce((sum, item) => {
    const priceValue = typeof item.price === 'number' ? item.price : 0;
    return sum + priceValue * item.quantity;
  }, 0);

  const hasUponRequestItems = items.some(item => item.price === 'Upon Request');

  return (
    <>
      <OrderFormModal isOpen={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} items={items} total={numericTotal} />
      <div className={`fixed inset-0 bg-black/85 backdrop-blur-md z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-[#d4af37]/30 z-[60] transform transition-transform duration-500 ease-out flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-[#050505]">
          <div className="flex items-center gap-4">
            <img src="/FDR_Logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h2 className="font-metal text-[#d4af37] text-xl uppercase tracking-widest">Your Haul</h2>
              <p className="text-[#d4af37]/80 text-[10px] uppercase tracking-[0.2em] font-black">{items.length} Artifacts</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full border border-zinc-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 border-2 border-zinc-800 flex items-center justify-center rounded-full mb-6">
                <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <p className="text-zinc-500 font-metal text-sm uppercase tracking-widest">The cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-5 group animate-in slide-in-from-right-4 duration-300 border-b border-zinc-900 pb-6 last:border-0">
                <div className="w-24 h-24 bg-zinc-900 overflow-hidden border border-zinc-800 shadow-xl flex-shrink-0">
                  <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-white text-lg font-black leading-tight mb-1 group-hover:text-[#d4af37] transition-colors font-metal">{item.artist}</h3>
                  <p className="text-zinc-300 text-sm italic mb-4 font-medium">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border-2 border-zinc-800 rounded-sm bg-black">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors font-black">-</button>
                      <span className="px-4 py-1.5 text-[11px] text-[#d4af37] font-bold font-mono">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors font-black">+</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-[#d4af37] font-black ${item.price === 'Upon Request' ? 'text-xs uppercase tracking-tighter' : 'text-lg'}`}>
                        {item.price === 'Upon Request' ? 'Price Upon Request' : `€${(item.price * item.quantity).toFixed(2)}`}
                      </p>
                      <button onClick={() => onRemove(item.id)} className="text-zinc-600 hover:text-[#b22222] transition-colors p-2 hover:bg-[#b22222]/10 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-[#050505] border-t border-[#d4af37]/30">
            <div className="flex justify-between items-center mb-8">
              <span className="text-zinc-300 uppercase text-xs tracking-[0.3em] font-black">Subtotal</span>
              <div className="text-right">
                <span className="text-[#d4af37] text-4xl font-black tracking-tighter drop-shadow-lg">€{numericTotal.toFixed(2)}</span>
                {hasUponRequestItems && (
                  <p className="text-[9px] text-[#d4af37] uppercase font-black tracking-widest mt-1">+ Additional Artifacts (Upon Request)</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOrderFormOpen(true)}
              className="w-full bg-[#b22222] hover:bg-white hover:text-black text-white text-[11px] font-black uppercase tracking-[0.4em] py-6 text-center block transition-all shadow-[0_10px_30px_rgba(178,34,34,0.4)] hover:shadow-white/20"
            >
              Finalize Order
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-6 uppercase tracking-[0.2em] leading-relaxed font-bold">
              Generate a summary to send via email for final processing.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
