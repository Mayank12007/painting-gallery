import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  Check, 
  RotateCcw,
  Sparkles,
  Layers,
  IndianRupee,
  ChevronDown
} from 'lucide-react';
import PaintingCard from '../components/PaintingCard';
import ViewInRoomModal from '../components/ViewInRoomModal';

const CATEGORIES = [
  'All',
  'Abstract',
  'Landscape & Scenery',
  'Spiritual & Devotional',
  'Figurative & Portrait',
  'Modern & Contemporary',
  'Traditional & Folk Art'
];

const MEDIUMS = [
  'All',
  'Oil',
  'Acrylic',
  'Watercolor',
  'Mixed Media'
];

const ORIENTATIONS = [
  { id: 'All', label: 'All Orientations' },
  { id: 'horizontal', label: 'Horizontal (Wide/Over Sofa)' },
  { id: 'vertical', label: 'Vertical (Tall/Foyer)' },
  { id: 'square', label: 'Square (Harmonious)' }
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: null, max: null },
  { id: 'under_30k', label: 'Under ₹30,000', min: 0, max: 30000 },
  { id: '30k_50k', label: '₹30,000 - ₹50,000', min: 30000, max: 50000 },
  { id: '50k_75k', label: '₹50,000 - ₹75,000', min: 50000, max: 75000 },
  { id: 'above_75k', label: 'Above ₹75,000', min: 75000, max: null }
];

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [medium, setMedium] = useState(searchParams.get('medium') || 'All');
  const [orientation, setOrientation] = useState(searchParams.get('orientation') || 'All');
  const [priceRange, setPriceRange] = useState('all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedRoomPainting, setSelectedRoomPainting] = useState(null);

  // Sync state if query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
    const orient = searchParams.get('orientation');
    if (orient) setOrientation(orient);
    const med = searchParams.get('medium');
    if (med) setMedium(med);
  }, [searchParams]);

  // Fetch paintings based on filters
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (medium && medium !== 'All') params.append('medium', medium);
        if (orientation && orientation !== 'All') params.append('orientation', orientation);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        if (inStockOnly) params.append('inStock', 'true');

        const activePrice = PRICE_RANGES.find(p => p.id === priceRange);
        if (activePrice) {
          if (activePrice.min !== null) params.append('minPrice', activePrice.min);
          if (activePrice.max !== null) params.append('maxPrice', activePrice.max);
        }

        const res = await fetch(`/api/paintings?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPaintings(data);
        }
      } catch (err) {
        console.error('Failed to load paintings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [category, medium, orientation, priceRange, search, sort, inStockOnly]);

  const resetFilters = () => {
    setCategory('All');
    setMedium('All');
    setOrientation('All');
    setPriceRange('all');
    setSearch('');
    setSort('newest');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'All' || medium !== 'All' || orientation !== 'All' || priceRange !== 'all' || search !== '' || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Gallery Header */}
      <div className="border-b border-[#e2dcce] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
            Gallerist Online Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1">
            Original Fine Art & Paintings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Showing <strong className="text-zinc-800">{paintings.length}</strong> certified original artworks available for private acquisition
          </p>
        </div>

        {/* Sort and Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-[#f6f2ec] border border-[#ded8cb] text-xs font-semibold text-zinc-800 py-2 px-3.5 rounded-lg"
          >
            <Filter size={15} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 hidden sm:inline">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#f6f2ec] border border-[#ded8cb] text-zinc-800 text-xs rounded-lg py-2 px-3 outline-none focus:border-[#b59677]"
            >
              <option value="newest">Latest Creations (Year)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar Filters + Art Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block col-span-1 bg-white p-6 rounded-2xl border border-[#ded8cb] shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <span className="font-serif text-base font-bold text-zinc-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#8b5e34]" />
              Filter Artworks
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#8b5e34] hover:text-[#5e4122] flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* Search in gallery */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, artist, deity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#faf7f2] border border-[#ded8cb] text-xs rounded-lg pl-3 pr-8 py-2 outline-none focus:border-[#b59677]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Category / Theme
            </label>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between transition ${
                    category === cat
                      ? 'bg-[#b59677]/15 text-[#8b5e34] font-semibold'
                      : 'text-zinc-600 hover:bg-[#faf7f2]'
                  }`}
                >
                  <span>{cat}</span>
                  {category === cat && <Check size={13} className="text-[#8b5e34]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Medium */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Medium
            </label>
            <div className="space-y-1">
              {MEDIUMS.map(med => (
                <button
                  key={med}
                  onClick={() => setMedium(med)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between transition ${
                    medium === med
                      ? 'bg-[#b59677]/15 text-[#8b5e34] font-semibold'
                      : 'text-zinc-600 hover:bg-[#faf7f2]'
                  }`}
                >
                  <span>{med === 'All' ? 'All Mediums' : med}</span>
                  {medium === med && <Check size={13} className="text-[#8b5e34]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Wall Space & Orientation
            </label>
            <div className="space-y-1">
              {ORIENTATIONS.map(orient => (
                <button
                  key={orient.id}
                  onClick={() => setOrientation(orient.id)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between transition ${
                    orientation === orient.id
                      ? 'bg-[#b59677]/15 text-[#8b5e34] font-semibold'
                      : 'text-zinc-600 hover:bg-[#faf7f2]'
                  }`}
                >
                  <span>{orient.label}</span>
                  {orientation === orient.id && <Check size={13} className="text-[#8b5e34]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Price Range (₹ INR)
            </label>
            <div className="space-y-1">
              {PRICE_RANGES.map(pr => (
                <button
                  key={pr.id}
                  onClick={() => setPriceRange(pr.id)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between transition ${
                    priceRange === pr.id
                      ? 'bg-[#b59677]/15 text-[#8b5e34] font-semibold'
                      : 'text-zinc-600 hover:bg-[#faf7f2]'
                  }`}
                >
                  <span>{pr.label}</span>
                  {priceRange === pr.id && <Check size={13} className="text-[#8b5e34]" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-2 border-t border-zinc-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#8b5e34] rounded focus:ring-[#8b5e34]"
              />
              <span>In Stock Only (Ready to Ship)</span>
            </label>
          </div>
        </aside>

        {/* Artworks Grid */}
        <main className="col-span-1 md:col-span-3">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-zinc-400">Active Filters:</span>
              {category !== 'All' && (
                <span className="bg-[#ede7dc] text-[#8b5e34] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Category: {category}
                  <button onClick={() => setCategory('All')}><X size={12} /></button>
                </span>
              )}
              {medium !== 'All' && (
                <span className="bg-[#ede7dc] text-[#8b5e34] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Medium: {medium}
                  <button onClick={() => setMedium('All')}><X size={12} /></button>
                </span>
              )}
              {orientation !== 'All' && (
                <span className="bg-[#ede7dc] text-[#8b5e34] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Orientation: {orientation}
                  <button onClick={() => setOrientation('All')}><X size={12} /></button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="bg-[#ede7dc] text-[#8b5e34] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Price: {PRICE_RANGES.find(p => p.id === priceRange)?.label}
                  <button onClick={() => setPriceRange('all')}><X size={12} /></button>
                </span>
              )}
              {search && (
                <span className="bg-[#ede7dc] text-[#8b5e34] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  Query: "{search}"
                  <button onClick={() => setSearch('')}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#f2eee9] rounded-xl aspect-[4/5]"></div>
              ))}
            </div>
          ) : paintings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#ded8cb] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#faf5ee] text-zinc-400 flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-800">
                No matching artworks found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try widening your price range, clearing some filter tags, or searching for other subjects like "Abstract", "Ganesha", or "Landscape".
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#8b5e34] text-white text-xs font-semibold py-2 px-5 rounded-full shadow hover:bg-[#724a25] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paintings.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onViewInRoom={(art) => setSelectedRoomPainting(art)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="font-serif text-lg font-bold text-zinc-900">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-zinc-400">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-700 block mb-2">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                      category === cat ? 'bg-[#8b5e34] text-white' : 'text-zinc-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-700 block mb-2">Orientation</label>
              <div className="space-y-1">
                {ORIENTATIONS.map(orient => (
                  <button
                    key={orient.id}
                    onClick={() => setOrientation(orient.id)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                      orientation === orient.id ? 'bg-[#8b5e34] text-white' : 'text-zinc-600'
                    }`}
                  >
                    {orient.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#8b5e34] text-white text-xs font-semibold py-3 rounded-xl shadow"
            >
              Apply Filters ({paintings.length} Artworks)
            </button>
          </div>
        </div>
      )}

      {/* Room Visualizer Modal */}
      {selectedRoomPainting && (
        <ViewInRoomModal
          painting={selectedRoomPainting}
          isOpen={!!selectedRoomPainting}
          onClose={() => setSelectedRoomPainting(null)}
        />
      )}
    </div>
  );
}
