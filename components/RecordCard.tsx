
import React, { useState } from 'react';
import { Record } from '../types';

interface RecordCardProps {
  record: Record;
  onAddToCart: (record: Record) => void;
  onViewDetails: (record: Record) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onAddToCart, onViewDetails }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(record);
    setTimeout(() => setIsAdding(false), 800);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % record.imageUrls.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + record.imageUrls.length) % record.imageUrls.length);
  };

  const hasMultipleImages = record.imageUrls.length > 1;
  const isUponRequest = record.price === 'Upon Request';
  const isSoldOut = record.price === 'Sold Out';

  return (
    <div

      onClick={() => onViewDetails(record)}
      className="group relative bg-[#151515] border border-zinc-800 hover:border-[#d4af37] transition-all duration-300 rounded-sm overflow-hidden flex flex-col h-full shadow-2xl cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <img
          src={record.imageUrls[currentImgIndex]}
          alt={`${record.artist} - ${record.title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600&auto=format&fit=crop';
          }}
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-[#b22222] text-white px-8 py-2 -rotate-12 border-2 border-white/20 shadow-[0_0_20px_rgba(178,34,34,0.6)]">
              <span className="font-metal text-2xl uppercase tracking-[0.2em] drop-shadow-md">Sold Out</span>
            </div>
          </div>
        )}

        {hasMultipleImages && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button

              onClick={prevImg}
              className="bg-black/70 hover:bg-[#d4af37] text-white hover:text-black p-1.5 rounded-full transition-colors backdrop-blur-sm border border-white/10"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button

              onClick={nextImg}
              className="bg-black/70 hover:bg-[#d4af37] text-white hover:text-black p-1.5 rounded-full transition-colors backdrop-blur-sm border border-white/10"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>

            </button>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-black/80 border border-[#d4af37] text-[#d4af37] px-4 py-1.5 text-[10px] uppercase font-black tracking-widest backdrop-blur-sm shadow-2xl">
            Details
          </span>

        </div>

        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {record.imageUrls.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === currentImgIndex ? 'bg-[#d4af37] w-4' : 'bg-white/40 w-1'}`}

              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-auto text-center">
          <h3 className="text-2xl font-black text-white group-hover:text-[#d4af37] transition-colors leading-tight mb-2 font-metal tracking-tight">
            {record.artist}
          </h3>
          <p className="text-zinc-300 text-sm italic line-clamp-2 font-medium bg-[#d4af37]/5 px-2 py-1 rounded-sm border border-[#d4af37]/10">{record.title}</p>
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-zinc-900 pt-5">
          <div className="flex flex-col">
            <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.2em] font-black mb-1">Price</span>
            <div className="flex flex-col">
              <p className={`font-black text-white tracking-tighter ${isUponRequest || isSoldOut ? 'text-sm uppercase tracking-widest' : 'text-2xl'}`}>
                {typeof record.price === 'number'
                  ? `€${record.price.toFixed(2)}`
                  : record.price
                }
              </p>
              {!isUponRequest && !isSoldOut && <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">(excl. shipping)</span>}

            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${isSoldOut ? 'opacity-20 grayscale cursor-not-allowed border-zinc-800 text-zinc-500' : isAdding ? 'bg-white text-black border-white' : 'bg-[#b22222] border-[#b22222] text-white shadow-[0_4px_15px_rgba(178,34,34,0.4)]'} ${!isSoldOut && 'hover:bg-white hover:border-white hover:text-black cursor-pointer hover:shadow-white/20'} relative overflow-hidden`}
          >
            <span className={`inline-block transition-transform duration-300 ${isAdding ? '-translate-y-12' : 'translate-y-0'}`}>
              {isSoldOut ? 'Sold Out' : 'Add To Cart'}

            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
              Added!
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
