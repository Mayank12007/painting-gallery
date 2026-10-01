import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  SlidersHorizontal,
  Sparkles,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenUpload }) {
  const { user, isAdmin, logout, openAuth, quickLogin } = useAuth();
  const { totalItemsCount, openCart, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e2d8]">
      {/* Top Gallery Announcement Strip */}
      <div className="bg-[#1c1917] text-[#e7e1d5] text-xs py-2 px-4 font-light tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c59b27] animate-pulse"></span>
            <span>100% Original Hand-Painted Artwork &bull; Free Insured Delivery &bull; Certificate of Authenticity Included</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-zinc-300 text-[11px]">
            <span className="text-[#c59b27]">✦</span>
            <span>Pay on Delivery Available across India</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-700 hover:text-zinc-950 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#1c1917] group-hover:text-[#8b5e34] transition">
            New Creations
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#8c6d48] font-medium -mt-1">
            Fine Art &bull; Curated Originals
          </span>
        </Link>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-1 max-w-md mx-6 relative"
        >
          <input
            type="text"
            placeholder="Search paintings, artists, styles (e.g. Ganesha, Abstract, Oil)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f2ec] border border-[#ded8cb] focus:border-[#b59677] focus:bg-white text-zinc-900 text-sm rounded-full py-2 pl-4 pr-10 outline-none transition placeholder:text-zinc-400"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#8b5e34]"
          >
            <Search size={17} />
          </button>
        </form>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin Upload Painting Button (Visible strictly to Admin) */}
          {isAdmin ? (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs sm:text-sm font-medium py-2 px-3.5 rounded-full shadow-sm transition"
              title="Upload new painting to gallery"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Upload Painting</span>
            </button>
          ) : (
            <Link
              to="/gallery"
              className="hidden lg:flex items-center gap-1 text-xs text-[#8c6d48] hover:text-[#5e4528] font-medium py-1 px-2.5 rounded-full border border-[#ded8cb] hover:border-[#b59677] transition"
            >
              <Sparkles size={13} className="text-[#c59b27]" />
              <span>Originals</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/gallery"
            className="relative p-2 text-zinc-700 hover:text-[#8b5e34] transition"
            title="Wishlist"
          >
            <Heart size={21} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#8b5e34] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <button
            onClick={openCart}
            className="relative p-2 text-zinc-700 hover:text-[#8b5e34] transition"
            title="Shopping Cart"
          >
            <ShoppingBag size={21} />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#8b5e34] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#ded8cb] hover:border-[#8b5e34] transition focus:outline-none"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown size={14} className="text-zinc-600 hidden sm:block pr-0.5" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white border border-[#e5dfd4] rounded-xl shadow-xl py-2 z-50 text-sm"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="font-semibold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#8b5e34]">
                        {isAdmin ? (
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            👑 Gallery Administrator
                          </span>
                        ) : (
                          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                            🎨 Art Collector
                          </span>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-zinc-700 hover:bg-[#faf6f0] hover:text-[#8b5e34] transition"
                      >
                        <SlidersHorizontal size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-zinc-700 hover:bg-[#faf6f0] hover:text-[#8b5e34] transition"
                    >
                      <ShieldCheck size={15} />
                      <span>My Orders & Certificates</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition border-t border-zinc-100 mt-1"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-[#8b5e34] py-1.5 px-3 rounded-full border border-zinc-300 hover:border-[#8b5e34] transition"
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="hidden md:block bg-[#faf7f2] border-t border-[#ede7dc] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-wider uppercase font-medium text-zinc-700">
          <div className="flex items-center space-x-7 py-2.5">
            <Link to="/gallery" className="hover:text-[#8b5e34] transition">All Artworks</Link>
            <Link to="/gallery?category=Abstract" className="hover:text-[#8b5e34] transition">Abstract</Link>
            <Link to="/gallery?category=Landscape %26 Scenery" className="hover:text-[#8b5e34] transition">Landscape</Link>
            <Link to="/gallery?category=Spiritual %26 Devotional" className="hover:text-[#8b5e34] transition">Spiritual & Devotional</Link>
            <Link to="/gallery?category=Figurative %26 Portrait" className="hover:text-[#8b5e34] transition">Figurative</Link>
            <Link to="/gallery?category=Modern %26 Contemporary" className="hover:text-[#8b5e34] transition">Modern</Link>
            <Link to="/gallery?category=Traditional %26 Folk Art" className="hover:text-[#8b5e34] transition">Traditional & Folk</Link>
          </div>

          <div className="flex items-center gap-4 text-[#8c6d48]">
            <Link to="/gallery" className="flex items-center gap-1 hover:underline">
              <Eye size={13} />
              <span>Interactive Wall Preview</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5dfd4] px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search paintings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f6f2ec] border border-[#ded8cb] text-sm rounded-lg py-2 pl-3 pr-9 outline-none"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search size={16} />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wider pt-2 border-t border-zinc-100">
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery" className="py-1.5 text-zinc-700">All Artworks</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Abstract" className="py-1.5 text-zinc-700">Abstract</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Landscape %26 Scenery" className="py-1.5 text-zinc-700">Landscape</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Spiritual %26 Devotional" className="py-1.5 text-zinc-700">Spiritual</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Figurative %26 Portrait" className="py-1.5 text-zinc-700">Figurative</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Modern %26 Contemporary" className="py-1.5 text-zinc-700">Modern</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/gallery?category=Traditional %26 Folk Art" className="py-1.5 text-zinc-700">Folk Art</Link>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUpload();
                }}
                className="w-full bg-[#8b5e34] text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={15} /> Upload Artwork (Admin)
              </button>
            )}
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-zinc-700 py-1 flex items-center gap-2"
            >
              <ShieldCheck size={14} className="text-[#c59b27]" /> My Orders & Certificates
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
