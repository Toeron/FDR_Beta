
import React, { useState } from 'react';
import { Record } from '../types';

interface FeaturedRecordCardProps {
    record: Record;
    onAddToCart: (record: Record) => void;
    onViewDetails: (record: Record) => void;
}

const FeaturedRecordCard: React.FC<FeaturedRecordCardProps> = ({ record, onAddToCart, onViewDetails }) => {
    const [isAdding, setIsAdding] = useState(false);
    const isSoldOut = record.price === 'Sold Out';
    const isUponRequest = record.price === 'Upon Request';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSoldOut) return;
        setIsAdding(true);
        onAddToCart(record);
        setTimeout(() => setIsAdding(false), 800);
    };

    return (
        <div
            onClick={() => onViewDetails(record)}
            className="group relative bg-[#0a0a0a] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-500 rounded-sm overflow-hidden flex flex-col md:flex-row h-full shadow-[0_0_40px_rgba(0,0,0,0.8)] cursor-pointer"
        >
            {/* Featured Badge */}
            <div className="absolute top-0 left-0 z-20">
                <div className="bg-[#d4af37] text-black text-[9px] font-black px-4 py-1.5 uppercase tracking-widest shadow-2xl skew-x-[-12deg] -ml-2">
                    Featured Release
                </div>
            </div>

            {/* Left: Smaller Image Section (approx 40% width on md+) */}
            <div className="relative w-full md:w-[40%] aspect-square md:aspect-auto overflow-hidden bg-zinc-900 border-r border-zinc-900">
                <img
                    src={record.imageUrls[0]}
                    alt={`${record.artist} - ${record.title}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Right: Detailed Content */}
            <div className="flex-grow p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">
                            {record.catalogNumber || 'FDR-SPECIAL'}
                        </span>
                        {record.year && (
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                Released {record.year}
                            </span>
                        )}
                    </div>

                    <h3 className="text-3xl md:text-5xl font-black text-white mb-2 font-metal tracking-tight group-hover:text-[#d4af37] transition-colors duration-500">
                        {record.artist}
                    </h3>
                    <p className="text-xl md:text-2xl text-zinc-400 italic mb-8 font-medium border-l-2 border-[#d4af37]/30 pl-4">
                        {record.title}
                    </p>

                    <div className="space-y-8 mb-10">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            <div>
                                <span className="block text-[#d4af37]/40 text-[9px] uppercase tracking-[0.3em] font-black mb-1.5">Catalog ID</span>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{record.catalogNumber || 'FDR-SPECIAL'}</span>
                            </div>
                            <div>
                                <span className="block text-[#d4af37]/40 text-[9px] uppercase tracking-[0.3em] font-black mb-1.5">Pressing Year</span>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{record.year || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[#d4af37]/40 text-[9px] uppercase tracking-[0.3em] font-black mb-1.5">Media Format</span>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{record.format || 'Vinyl LP'}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-zinc-900 via-zinc-800 to-transparent"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-zinc-900/50">
                    <div className="flex flex-col">
                        <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.5em] font-black mb-2 opacity-60">Listing Price</span>
                        <p className={`font-black text-white tracking-tighter ${isUponRequest || isSoldOut ? 'text-2xl uppercase' : 'text-5xl'}`}>
                            {typeof record.price === 'number' ? `€${record.price.toFixed(2)}` : record.price}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        className={`px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all border ${isSoldOut
                            ? 'opacity-20 grayscale cursor-not-allowed border-zinc-800 text-zinc-500'
                            : isAdding
                                ? 'bg-white text-black border-white'
                                : 'bg-[#b22222] border-[#b22222] text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black shadow-[0_15px_40px_rgba(178,34,34,0.3)]'
                            } relative overflow-hidden active:scale-[0.98]`}
                    >
                        <span className={`inline-block transition-transform duration-300 ${isAdding ? '-translate-y-12' : 'translate-y-0'}`}>
                            {isSoldOut ? 'Sold Out' : 'Obtain Album'}
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
                            Secured!
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedRecordCard;
