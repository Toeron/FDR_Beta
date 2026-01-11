import React, { useState, useEffect } from 'react';
import { Record } from '../types';

interface RecordDetailsModalProps {
  record: Record | null;
  onClose: () => void;
  onAddToCart: (record: Record) => void;
}

const RecordDetailsModal: React.FC<RecordDetailsModalProps> = ({ record, onClose, onAddToCart }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Reset index when record changes
  useEffect(() => {
    setImgIndex(0);
  }, [record?.id]);

  // Auto-cycle images
  useEffect(() => {
    if (!record || record.imageUrls.length <= 1 || isHovering) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % record.imageUrls.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [record, isHovering]);

  if (!record) return null;

  const formattedTracks = record.tracklist?.split('\n').filter(t => t.trim() !== '') || [];
  const hasMultipleImages = record.imageUrls.length > 1;

  const nextImg = () => {
    setImgIndex((prev) => (prev + 1) % record.imageUrls.length);
  };
  const prevImg = () => {
    setImgIndex((prev) => (prev - 1 + record.imageUrls.length) % record.imageUrls.length);
  };

  const isUponRequest = record.price === 'Upon Request';
<<<<<<< HEAD
  const isSoldOut = record.price === 'Sold Out';
=======
>>>>>>> origin/main

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
<<<<<<< HEAD

      <div className="relative bg-[#050505] border border-zinc-800 w-full max-w-5xl max-h-[90vh] md:max-h-[95vh] overflow-hidden flex flex-col md:flex-row items-center md:items-stretch shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in duration-300 rounded-sm">

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-[#d4af37] transition-colors z-[110] bg-black/50 p-2 rounded-full md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-black border-b md:border-b-0 md:border-r border-zinc-900 flex-shrink-0">
          <div
=======
      
      <div className="relative bg-[#050505] border border-zinc-800 w-full max-w-5xl max-h-[90vh] md:max-h-[95vh] overflow-hidden flex flex-col md:flex-row items-center md:items-stretch shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in duration-300 rounded-sm">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-[#d4af37] transition-colors z-[110] bg-black/50 p-2 rounded-full md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-black border-b md:border-b-0 md:border-r border-zinc-900 flex-shrink-0">
          <div 
>>>>>>> origin/main
            className="w-full aspect-square relative group/img overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
<<<<<<< HEAD
            {record.imageUrls.map((url, i) => (
              <img
                key={`${record.id}-img-${i}`}
                src={url}
                alt={`${record.artist} - ${record.title} - Image ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out hover:scale-110 ${i === imgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                loading={i === imgIndex ? "eager" : "lazy"}
                decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600&auto=format&fit=crop'; }}
              />
            ))}

            {isSoldOut && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
                <div className="bg-[#b22222] text-white px-12 py-3 -rotate-12 border-2 border-white/20 shadow-[0_0_40px_rgba(178,34,34,0.6)]">
                  <span className="font-metal text-4xl uppercase tracking-[0.2em] drop-shadow-md">Sold Out</span>
                </div>
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); setIsHovering(true); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#d4af37] text-white hover:text-black p-3 rounded-full transition-all backdrop-blur-md opacity-0 group-hover/img:opacity-100 border border-white/10 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); setIsHovering(true); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#d4af37] text-white hover:text-black p-3 rounded-full transition-all backdrop-blur-md opacity-0 group-hover/img:opacity-100 border border-white/10 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {record.imageUrls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setImgIndex(i); setIsHovering(true); }}
                      className={`h-1 rounded-full transition-all duration-500 ${i === imgIndex ? 'bg-[#d4af37] w-6 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-white/30 w-1 hover:bg-white/60'}`}
=======
          {record.imageUrls.map((url, i) => (
            <img
              key={`${record.id}-img-${i}`}
              src={url}
              alt={`${record.artist} - ${record.title} - Image ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out hover:scale-110 ${i === imgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
              loading={i === imgIndex ? "eager" : "lazy"}
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600&auto=format&fit=crop'; }}
            />
          ))}
          
            {hasMultipleImages && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImg(); setIsHovering(true); }} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#d4af37] text-white hover:text-black p-3 rounded-full transition-all backdrop-blur-md opacity-0 group-hover/img:opacity-100 border border-white/10 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImg(); setIsHovering(true); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#d4af37] text-white hover:text-black p-3 rounded-full transition-all backdrop-blur-md opacity-0 group-hover/img:opacity-100 border border-white/10 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {record.imageUrls.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setImgIndex(i); setIsHovering(true); }} 
                      className={`h-1 rounded-full transition-all duration-500 ${i === imgIndex ? 'bg-[#d4af37] w-6 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-white/30 w-1 hover:bg-white/60'}`} 
>>>>>>> origin/main
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar relative bg-[#0a0a0a]">
          <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-[#d4af37] transition-colors hidden md:block">
<<<<<<< HEAD
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
=======
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
>>>>>>> origin/main
          </button>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
<<<<<<< HEAD
              <p className="text-[#d4af37] font-metal text-[10px] uppercase tracking-[0.5em] flex items-center gap-3 font-black">
=======
               <p className="text-[#d4af37] font-metal text-[10px] uppercase tracking-[0.5em] flex items-center gap-3 font-black">
>>>>>>> origin/main
                <span className="h-px w-6 bg-[#d4af37]/40"></span>
                {record.genre}
                <span className="h-px w-6 bg-[#d4af37]/40"></span>
              </p>
              {record.catalogNumber && (
                <span className="bg-white/10 text-white/60 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm border border-white/5">
                  REF: {record.catalogNumber}
                </span>
              )}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white font-metal mb-3 leading-tight tracking-tight">{record.artist}</h2>
            <h3 className="text-xl text-zinc-300 italic font-medium tracking-wide bg-white/5 inline-block px-3 py-1 border-l-2 border-[#d4af37]">{record.title}</h3>
          </div>

          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8 bg-white/5 p-6 border border-zinc-800 rounded-sm">
            <div className="flex flex-col">
              <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black mb-1">Price</span>
              <div className="flex flex-col">
<<<<<<< HEAD
                <span className={`font-black text-white tracking-tighter ${isUponRequest || isSoldOut ? 'text-2xl uppercase tracking-widest' : 'text-4xl'}`}>
                  {typeof record.price === 'number'
                    ? `€${record.price.toFixed(2)}`
                    : record.price
                  }
                </span>
                {!isUponRequest && !isSoldOut && <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">(excl. shipping)</span>}
=======
                <span className={`font-black text-white tracking-tighter ${isUponRequest ? 'text-2xl uppercase tracking-widest' : 'text-4xl'}`}>
                  {typeof record.price === 'number' ? `€${record.price.toFixed(2)}` : 'Upon Request'}
                </span>
                {!isUponRequest && <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">(excl. shipping)</span>}
>>>>>>> origin/main
              </div>
            </div>
          </div>

          {record.notes && (
            <div className="mb-8 bg-red-900/5 border border-red-900/20 p-5 rounded-sm">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-metal text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black">Archive Notes</h4>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed italic font-medium">
                {record.notes}
              </p>
            </div>
          )}

          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h4 className="font-metal text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black">Archived Tracklist</h4>
              <div className="h-px flex-grow bg-zinc-900"></div>
            </div>
            <ul className="space-y-3">
              {formattedTracks.length > 0 ? (
                formattedTracks.map((track, i) => (
                  <li key={i} className="group/track transition-all">
                    <span className="text-zinc-400 group-hover:text-white transition-colors uppercase font-medium text-xs leading-relaxed block">{track}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-600 italic text-[10px] uppercase tracking-widest text-center py-6 border border-dashed border-zinc-900">No tracklist data preserved</li>
              )}
            </ul>
          </div>

          <div className="pt-6 border-t border-zinc-900 mt-auto flex justify-start">
            <button
              onClick={() => { onAddToCart(record); onClose(); }}
<<<<<<< HEAD
              disabled={isSoldOut}
              className={`w-full sm:w-fit px-12 text-[11px] font-black uppercase tracking-[0.4em] py-5 text-center transition-all ${isSoldOut ? 'opacity-20 grayscale cursor-not-allowed bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-[#b22222] hover:bg-white hover:text-black text-white shadow-[0_10px_30px_rgba(178,34,34,0.3)] hover:shadow-white/10 active:scale-[0.98]'}`}
            >
              {isSoldOut ? 'Sold Out' : 'Buy'}
=======
              className="w-full sm:w-fit px-12 bg-[#b22222] hover:bg-white hover:text-black text-white text-[11px] font-black uppercase tracking-[0.4em] py-5 text-center transition-all shadow-[0_10px_30px_rgba(178,34,34,0.3)] hover:shadow-white/10 active:scale-[0.98]"
            >
              Buy
>>>>>>> origin/main
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailsModal;
