import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Eye, Layers, Palette, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ROOM_SETTINGS = [
  {
    id: 'living',
    name: 'Luxury Living Room',
    furnitureType: 'sofa',
    description: 'Centered over a 84-inch designer linen sofa'
  },
  {
    id: 'bedroom',
    name: 'Master Suite',
    furnitureType: 'bed',
    description: 'Mounted above an upholstered king bed headboard'
  },
  {
    id: 'office',
    name: 'Executive Office',
    furnitureType: 'desk',
    description: 'Statement wall behind a minimalist walnut work desk'
  }
];

const WALL_COLORS = [
  { name: 'Warm Alabaster', bg: '#f4f1ea', border: '#e2ddd3', textColor: 'text-zinc-800' },
  { name: 'Oatmeal Greige', bg: '#ded8ce', border: '#c7bfb3', textColor: 'text-zinc-800' },
  { name: 'Sage Garden', bg: '#4e5d52', border: '#3f4c42', textColor: 'text-white' },
  { name: 'Midnight Navy', bg: '#1c2833', border: '#151f28', textColor: 'text-white' },
  { name: 'Terracotta Earth', bg: '#915344', border: '#784336', textColor: 'text-white' },
  { name: 'Charcoal Gallery', bg: '#2b2c2f', border: '#1f2022', textColor: 'text-white' }
];

const FRAME_STYLES = [
  { id: 'rolled', name: 'Raw Gallery Canvas', styleClass: 'shadow-2xl' },
  { id: 'teak_frame', name: 'Teak Floating Frame', styleClass: 'p-3 bg-[#8b5a2b] shadow-[0_20px_45px_rgba(0,0,0,0.5)] border-4 border-[#5c3a1e]' },
  { id: 'black_frame', name: 'Matte Black Gallery Frame', styleClass: 'p-3 bg-[#111111] shadow-[0_20px_45px_rgba(0,0,0,0.6)] border-4 border-black' },
  { id: 'gold_frame', name: 'Royal Antique Gold Leaf', styleClass: 'p-3.5 bg-gradient-to-tr from-[#997328] via-[#e5c158] to-[#805e1b] shadow-[0_25px_50px_rgba(0,0,0,0.6)] border-4 border-[#b89130]' }
];

export default function ViewInRoomModal({ painting, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [selectedRoom, setSelectedRoom] = useState(ROOM_SETTINGS[0]);
  const [wallColor, setWallColor] = useState(WALL_COLORS[0]);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [added, setAdded] = useState(false);

  if (!isOpen || !painting) return null;

  const handleAddToCart = () => {
    // Find corresponding framing option in painting
    const match = painting.framingOptions?.find(f => f.id === selectedFrame.id) || painting.framingOptions?.[0];
    addToCart(painting, match);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#1c1917] text-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-700 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#171514]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#b59677]/20 text-[#c59b27]">
              <Eye size={18} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
                Interactive Room Visualizer
              </h3>
              <p className="text-xs text-zinc-400">
                Visualize <span className="text-zinc-200 font-medium">"{painting.title}"</span> ({painting.dimensions}) in real interior scale
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Room Stage (Interactive Wall Simulator) */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] flex flex-col justify-end overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: wallColor.bg }}
        >
          {/* Subtle Wall Texture */}
          <div className="absolute inset-0 wall-texture opacity-30 pointer-events-none"></div>

          {/* Wall Lamp / Light Accent */}
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>

          {/* The Mounted Artwork */}
          <div className="relative z-10 mx-auto mb-16 sm:mb-20 flex flex-col items-center">
            {/* Scale Container */}
            <div className={`transition-all duration-300 max-w-[240px] sm:max-w-[320px] md:max-w-[380px] ${selectedFrame.styleClass}`}>
              <img
                src={painting.image}
                alt={painting.title}
                className="w-full h-auto object-cover max-h-[220px] sm:max-h-[280px] block"
              />
            </div>

            {/* Dimensional Tag under Artwork */}
            <div className="mt-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-white tracking-wider font-mono border border-white/10 shadow-lg">
              {painting.dimensions} &bull; {selectedFrame.name}
            </div>
          </div>

          {/* Realistic Furniture Silhouette Mockups */}
          <div className="relative z-20 w-full flex justify-center">
            {selectedRoom.furnitureType === 'sofa' && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center">
                {/* Modern Sofa illustration */}
                <div className="w-full h-20 sm:h-24 bg-[#2b2b2b] rounded-t-3xl shadow-2xl border-t-4 border-[#3a3a3a] flex items-center justify-around px-4">
                  <div className="w-14 h-8 bg-[#3d3d3d] rounded-lg"></div>
                  <div className="w-14 h-8 bg-[#3d3d3d] rounded-lg"></div>
                </div>
                <div className="w-full h-6 bg-[#1a1a1a] flex justify-between px-8">
                  <div className="w-3 h-6 bg-[#634832]"></div>
                  <div className="w-3 h-6 bg-[#634832]"></div>
                </div>
              </div>
            )}

            {selectedRoom.furnitureType === 'bed' && (
              <div className="w-full max-w-xl px-4 flex flex-col items-center">
                <div className="w-full h-24 bg-[#3d424b] rounded-t-2xl shadow-2xl border-t-4 border-[#505763] flex items-center justify-center">
                  <div className="flex gap-4">
                    <div className="w-20 h-10 bg-white/90 rounded-md shadow"></div>
                    <div className="w-20 h-10 bg-white/90 rounded-md shadow"></div>
                  </div>
                </div>
              </div>
            )}

            {selectedRoom.furnitureType === 'desk' && (
              <div className="w-full max-w-xl px-4 flex flex-col items-center">
                <div className="w-full h-6 bg-[#5c3a21] rounded-t-sm shadow-xl"></div>
                <div className="w-full h-16 bg-[#3d2413] flex justify-between px-10">
                  <div className="w-4 h-full bg-[#24150b]"></div>
                  <div className="w-4 h-full bg-[#24150b]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Hardwood Floor Strip */}
          <div className="w-full h-10 bg-gradient-to-r from-[#4d321d] via-[#5c3c23] to-[#422b19] border-t-2 border-[#6f492b] shadow-inner"></div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-[#171514] p-4 sm:p-5 border-t border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Room Environment Selection */}
          <div className="flex flex-col gap-1.5 w-full lg:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1">
              <Layers size={13} /> Room Environment
            </span>
            <div className="flex gap-1.5">
              {ROOM_SETTINGS.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                    selectedRoom.id === room.id
                      ? 'bg-[#b59677] text-white shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Wall Color Palette */}
          <div className="flex flex-col gap-1.5 w-full lg:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1">
              <Palette size={13} /> Wall Color
            </span>
            <div className="flex items-center gap-2">
              {WALL_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setWallColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                    wallColor.name === c.name ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' : 'border-zinc-700'
                  }`}
                  style={{ backgroundColor: c.bg }}
                  title={c.name}
                >
                  {wallColor.name === c.name && (
                    <Check size={12} className={c.textColor} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Style */}
          <div className="flex flex-col gap-1.5 w-full lg:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              Frame Option
            </span>
            <select
              value={selectedFrame.id}
              onChange={(e) => {
                const found = FRAME_STYLES.find(f => f.id === e.target.value);
                if (found) setSelectedFrame(found);
              }}
              className="bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 py-1.5 px-3 rounded-lg outline-none focus:border-[#b59677]"
            >
              {FRAME_STYLES.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart CTA */}
          <div className="w-full lg:w-auto pt-2 lg:pt-0">
            <button
              onClick={handleAddToCart}
              className="w-full lg:w-auto bg-[#8b5e34] hover:bg-[#724a25] text-white font-medium text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag size={16} />
              <span>{added ? 'Added to Cart!' : `Acquire for ₹${painting.price.toLocaleString('en-IN')}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
