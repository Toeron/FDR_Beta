
import React, { useState, useEffect, useMemo } from 'react';
import { Record, FilterState, CartItem } from './types';
import { GOOGLE_SHEET_CSV_URL } from './constants';
import RecordCard from './components/RecordCard';
import FilterBar from './components/FilterBar';
import Cart from './components/Cart';
import RecordDetailsModal from './components/RecordDetailsModal';

/**
 * Normalizes any Google Sheet link into a reliable CSV export link.
 */
const normalizeSheetUrl = (url: string): string => {
  if (!url) return '';
  const match = url.match(/[-\w]{25,}/);

  if (match && match[0]) {
    return `https://docs.google.com/spreadsheets/d/${match[0]}/export?format=csv`;
  }
  return url;
};

const transformDriveUrl = (url: string): string => {
  if (!url || !url.includes('drive.google.com')) return url;
  const match = url.match(/(?:id=|d\/)([^/&?]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};

const parseCSV = (csvText: string): Record[] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentRow.length > 0 || currentField !== '') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else currentField += char;
  }
  if (currentRow.length > 0 || currentField !== '') {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  const getIndex = (possibleNames: string[]) => headers.findIndex(h => possibleNames.some(name => h.includes(name)));

  const indices = {
    artist: getIndex(['artist', 'band']),
    title: getIndex(['title', 'album', 'record']),
    catalogNumber: getIndex(['catalog', 'cat#', 'ref', 'code']),
    genre: getIndex(['genre', 'style']),
    price: getIndex(['price', 'cost', 'eur']),
    condition: getIndex(['condition', 'state', 'grade']),
    stockCount: getIndex(['stock', 'count', 'quantity']),
    notes: getIndex(['notes', 'archive', 'info', 'comment']),
    imageStart: getIndex(['image', 'pic', 'photo', 'url']),
    buyLink: getIndex(['buy', 'link', 'order', 'mailto']),
    tracklist: getIndex(['tracklist', 'tracks', 'songs', 'content'])
  };

  if (indices.artist === -1) indices.artist = 0;
  if (indices.title === -1) indices.title = 1;
  if (indices.catalogNumber === -1) indices.catalogNumber = 2;
  if (indices.genre === -1) indices.genre = 3;
  if (indices.price === -1) indices.price = 4;
  if (indices.condition === -1) indices.condition = 5;
  if (indices.stockCount === -1) indices.stockCount = 6;
  if (indices.notes === -1) indices.notes = 7;
  if (indices.imageStart === -1) indices.imageStart = 8;

  return rows.slice(1).map((rowValues, rowIndex) => {
    const clean = (idx: number) => (idx < 0 || idx >= rowValues.length) ? '' : rowValues[idx].trim().replace(/^"|"$/g, '');
    const priceRaw = clean(indices.price).toLowerCase();
    const isSoldOut = priceRaw.includes('sold out') || priceRaw.includes('uitverkocht');
    const isUponRequest = priceRaw.includes('request') || priceRaw.includes('aanvraag');

    const price: number | 'Upon Request' | 'Sold Out' = isSoldOut
      ? 'Sold Out'
      : isUponRequest
        ? 'Upon Request'
        : (parseFloat(priceRaw.replace(/[^\d.-]/g, '')) || 0);

    const stock = parseInt(clean(indices.stockCount)) || 0;

    const imageIndices = [indices.imageStart, indices.imageStart + 1, indices.imageStart + 2, indices.imageStart + 3];
    let collectedUrls: string[] = [];
    imageIndices.forEach(colIdx => {
      const cellContent = clean(colIdx);
      if (cellContent) {
        const urlsInCell = cellContent.split(/[\s,\n\r]+/).filter(url => url.trim().startsWith('http')).map(url => transformDriveUrl(url.trim()));
        collectedUrls = [...collectedUrls, ...urlsInCell];
      }
    });

    const finalImageUrls = collectedUrls.length > 0 ? collectedUrls : ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600&auto=format&fit=crop'];
    const artist = clean(indices.artist) || 'Unknown Artist';
    const title = clean(indices.title) || 'Untitled Album';

    return {
      id: `record-${rowIndex}`,
      artist,
      title,
      catalogNumber: clean(indices.catalogNumber) || undefined,
      genre: (clean(indices.genre) as any) || 'Metal',
      price,
      condition: clean(indices.condition) || 'N/A',
      imageUrls: finalImageUrls,
      stockCount: stock,
      buyLink: clean(indices.buyLink) || `mailto:Kips1963@gmail.com?subject=Inquiry: ${artist} - ${title}`,

      tracklist: indices.tracklist !== -1 ? clean(indices.tracklist) : undefined,
      notes: clean(indices.notes) || undefined
    };
  });
};

const App: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ searchQuery: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const fetchData = async () => {
    const rawUrl = GOOGLE_SHEET_CSV_URL;
    if (!rawUrl) {
      setError('Inventory source not configured.');
      setLoading(false);
      return;
    }

    const normalizedUrl = normalizeSheetUrl(rawUrl);

    try {
      setLoading(true);
      const separator = normalizedUrl.includes('?') ? '&' : '?';
      const fetchUrl = `${normalizedUrl}${separator}t=${Date.now()}`;

      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`Sync Error: ${response.status}. Ensure your Sheet is Public.`);
      }
      const text = await response.text();

      if (text.trim().toLowerCase().startsWith('<!doctype html')) {
        throw new Error('Access Denied: Sheet is private.');
      }

      const parsedData = parseCSV(text);
      if (parsedData.length === 0) {
        throw new Error('Sync Error: Could not parse inventory data.');
      }

      setRecords(parsedData);
      setError(null);
    } catch (err) {
      console.error('Inventory Fetch Error:', err);
      setError(err instanceof Error ? err.message : 'Unable to sync live inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const query = filters.searchQuery.toLowerCase();
      return (
        record.artist.toLowerCase().includes(query) ||
        record.title.toLowerCase().includes(query) ||

        record.genre.toLowerCase().includes(query) ||
        (record.catalogNumber && record.catalogNumber.toLowerCase().includes(query))
      );
    });
  }, [records, filters]);

  const addToCart = (record: Record) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === record.id);
      if (existing) return prev.map(item => item.id === record.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...record, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => { setCart(prev => prev.filter(item => item.id !== id)); };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#b22222] selection:text-white relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
        <img
          src="/FDR_Logo.png"
          alt=""
          className="w-[90%] max-w-6xl h-auto object-contain opacity-[0.08] grayscale contrast-[1.2]"
        />
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-[#b22222] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>

          {cartCount > 0 && <span className="absolute -top-3 -right-3 bg-white text-[#b22222] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">{cartCount}</span>}
        </div>
      </button>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
      {selectedRecord && (
        <RecordDetailsModal
          key={selectedRecord.id}
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onAddToCart={addToCart}

        />
      )}

      <header className="relative py-10 md:py-14 px-4 overflow-hidden dragon-gradient border-b-4 border-[#d4af37]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <img

            src="/FDR_Logo.png"
            alt="Flying Dragon Records Logo"
            className="h-[10.743rem] md:h-[19.531rem] lg:h-[24.414rem] w-auto mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
          />
          <p className="font-metal text-lg md:text-xl text-white tracking-[0.3em] uppercase opacity-90 mb-6 drop-shadow-lg">
            rare metal & hardrock records
          </p>
          <div className="flex justify-center items-center gap-4">
            <span className="h-px w-8 bg-[#d4af37]/30"></span>
            <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.5em] font-bold">Live Inventory Portal</p>
            <span className="h-px w-8 bg-[#d4af37]/30"></span>
          </div>
        </div>
      </header>

      <FilterBar filters={filters} setFilters={setFilters} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        {error && (
          <div className="mb-8 p-6 bg-[#b22222]/10 border border-[#b22222] text-[#b22222] text-sm font-bold uppercase tracking-widest text-center shadow-lg">
            <p className="mb-4">⚠️ {error}</p>
            <button onClick={fetchData} className="text-[10px] bg-[#b22222] text-white px-6 py-2.5 hover:bg-white hover:text-black transition-all font-black tracking-widest shadow-xl">RETRY SYNC</button>
          </div>
        )}

        {loading && records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin mb-6" />
            <p className="font-metal text-[#d4af37] uppercase tracking-widest text-sm animate-pulse">Summoning Inventory...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center border-b border-zinc-900 pb-4">
              <h2 className="text-[#d4af37] uppercase text-xs tracking-[0.3em] font-black">{filteredRecords.length} Artifacts Found</h2>
            </div>
            {filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRecords.map((record) => <RecordCard key={record.id} record={record} onAddToCart={addToCart} onViewDetails={setSelectedRecord} />)}
              </div>
            ) : (
              <div className="text-center py-40 border border-dashed border-zinc-800 rounded-sm">
                <p className="text-[#d4af37] font-metal text-2xl uppercase mb-2">The Vault is Empty</p>
                <p className="text-zinc-400 text-sm">Adjust your filters to discover more treasures.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-[#050505] border-t border-zinc-900 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src="/FDR_Logo.png" alt="Flying Dragon Records Logo" className="h-11 w-auto mb-4 opacity-80" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">Direct access to the heaviest vinyl releases. Inventory synced live from the main vault.</p>
          </div>
          <div>
            <h4 className="font-metal text-white text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="text-zinc-400 text-xs space-y-2">
              <li><a href="mailto:Kips1963@gmail.com" className="hover:text-[#d4af37] transition-colors">Order Inquiries</a></li>
              <li><a href="mailto:Kips1963@gmail.com" className="hover:text-[#d4af37] transition-colors">General Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-metal text-white text-sm uppercase tracking-widest mb-4">Sync Status</h4>
            <p className={`text-[10px] uppercase tracking-wider mb-2 font-bold ${error ? 'text-[#b22222]' : 'text-green-500'}`}>
              System: {error ? 'Offline' : 'Online'}
            </p>
            <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Updates every 10 minutes</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-12 pt-8 text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold text-center">
          <p>© 2024 Flying Dragon Records. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
