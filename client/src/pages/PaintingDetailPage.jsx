import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Award, 
  Truck, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  Share2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ViewInRoomModal from '../components/ViewInRoomModal';
import CertificateModal from '../components/CertificateModal';
import PaintingCard from '../components/PaintingCard';

export default function PaintingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFraming, setSelectedFraming] = useState(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [coaModalOpen, setCoaModalOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchPainting = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/paintings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPainting(data);
          // Set default framing
          if (data.framingOptions && data.framingOptions.length > 0) {
            setSelectedFraming(data.framingOptions[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching artwork details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPainting();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-zinc-600 mt-4 text-sm">Curating Artwork Details...</p>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-900">Artwork Not Found</h2>
        <p className="text-xs text-zinc-500">The painting may have been archived or entered a private collection.</p>
        <Link to="/gallery" className="inline-block bg-[#8b5e34] text-white text-xs font-semibold py-2 px-5 rounded-full">
          Return to Gallery
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(painting.id);
  const currentTotal = painting.price + (selectedFraming?.price || 0);

  const handleAddToCart = () => {
    addToCart(painting, selectedFraming);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(painting, selectedFraming);
    navigate('/checkout');
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-[#8b5e34]">Home</Link>
        <span>&bull;</span>
        <Link to="/gallery" className="hover:text-[#8b5e34]">Gallery</Link>
        <span>&bull;</span>
        <Link to={`/gallery?category=${encodeURIComponent(painting.category)}`} className="hover:text-[#8b5e34]">
          {painting.category}
        </Link>
        <span>&bull;</span>
        <span className="text-zinc-900 font-medium truncate max-w-[200px]">{painting.title}</span>
      </div>

      {/* Main Artwork Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
        {/* Left Column: High-Res Artwork Visuals */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Painting Frame Preview */}
          <div className="relative bg-[#f5f1eb] rounded-2xl overflow-hidden border border-[#ded8cb] shadow-lg flex items-center justify-center p-4 sm:p-8">
            <div className="relative group max-h-[640px] flex items-center justify-center">
              <img
                src={painting.image}
                alt={painting.title}
                className="max-h-[580px] w-auto object-contain rounded shadow-2xl transition duration-500"
              />

              {/* Badges on artwork */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                <span className="bg-[#1c1917]/90 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-sm shadow">
                  Original 1 of 1
                </span>
                {painting.discount > 0 && (
                  <span className="bg-[#b59677] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow w-fit">
                    {painting.discount}% Savings
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Interactive Actions Strip */}
          <div className="grid grid-cols-2 gap-3">
            {/* View in Room 3D simulator */}
            <button
              onClick={() => setRoomModalOpen(true)}
              className="bg-[#262321] hover:bg-black text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow transition group"
            >
              <Eye size={16} className="text-[#c59b27] group-hover:scale-110 transition" />
              <span>Interactive View in Room (3D)</span>
            </button>

            {/* Official Signed Certificate modal trigger */}
            <button
              onClick={() => setCoaModalOpen(true)}
              className="bg-white hover:bg-[#faf7f2] text-zinc-900 text-xs font-semibold py-3 px-4 rounded-xl border border-[#ded8cb] flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Award size={16} className="text-[#8b5e34]" />
              <span>Inspect Signed Certificate</span>
            </button>
          </div>
        </div>

        {/* Right Column: Specifications, Custom Framing & Purchase Flow */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span className="uppercase tracking-widest text-[#8c6d48] font-semibold">
                {painting.category}
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                COA #{painting.coaNumber || 'GLR-2024-8841'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
              {painting.title}
            </h1>

            <p className="text-sm text-zinc-600 mt-1">
              Hand-painted by <strong className="text-zinc-900 font-semibold">{painting.artist}</strong>
            </p>

            <p className="text-xs text-zinc-500 mt-0.5">
              {painting.medium} &bull; {painting.dimensions} &bull; Created in {painting.year || 2024}
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ded8cb]">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                {formatPrice(currentTotal)}
              </span>
              {painting.originalPrice && painting.originalPrice > painting.price && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(painting.originalPrice + (selectedFraming?.price || 0))}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
              <Check size={13} /> Includes 100% Free Insured Wooden Crate Delivery Across India
            </p>
          </div>

          {/* Framing Customizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                <Layers size={14} className="text-[#8b5e34]" /> Select Custom Gallery Framing
              </label>
              <span className="text-[11px] text-[#8b5e34] font-medium">Handcrafted in teak & pine</span>
            </div>

            <div className="space-y-2">
              {painting.framingOptions?.map((framing) => (
                <div
                  key={framing.id}
                  onClick={() => setSelectedFraming(framing)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedFraming?.id === framing.id
                      ? 'border-[#8b5e34] bg-[#faf5ee] shadow-sm'
                      : 'border-[#ded8cb] bg-white hover:bg-[#fcfaf7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedFraming?.id === framing.id ? 'border-[#8b5e34] bg-[#8b5e34]' : 'border-zinc-300'
                    }`}>
                      {selectedFraming?.id === framing.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{framing.name}</p>
                      <p className="text-[10px] text-zinc-500">{framing.desc}</p>
                    </div>
                  </div>

                  <span className="font-medium text-zinc-800 shrink-0">
                    {framing.price > 0 ? `+${formatPrice(framing.price)}` : 'Included'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition CTAs */}
          <div className="space-y-3 pt-2">
            {painting.inStock ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-900 font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag size={17} />
                  <span>{addedNotice ? 'Added to Cart!' : 'Add to Collection'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Lock size={16} />
                  <span>Instant Buy Now</span>
                </button>
              </div>
            ) : (
              <div className="bg-zinc-100 border border-zinc-300 text-zinc-600 p-4 rounded-xl text-center text-xs font-semibold">
                This original masterpiece is currently in a private collection (Sold Out).
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(painting.id)}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-zinc-700 border-[#ded8cb] hover:bg-zinc-50'
              }`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Collector Wishlist'}</span>
            </button>
          </div>

          {/* Authenticity Guarantee Bullet Points */}
          <div className="bg-white p-4 rounded-xl border border-[#ded8cb] space-y-2.5 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#8b5e34] shrink-0" />
              <span>100% Genuine Hand-Painted Original Artwork</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#8b5e34] shrink-0" />
              <span>Includes Official Signed Certificate of Authenticity (COA)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#8b5e34] shrink-0" />
              <span>Dispatches within 24-48 hrs in a custom reinforced wooden crate</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-[#8b5e34] shrink-0" />
              <span>7-Day In-Home Art Return Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Fine Art Specifications Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#ded8cb] shadow-sm space-y-8">
        <div>
          <h3 className="font-serif text-xl font-bold text-zinc-900">
            Artwork Specifications & Curatorial Statement
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Archival museum standards certified by the Gallerist Board
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-700">
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-100">
              Curator's Notes
            </h4>
            <p className="leading-relaxed text-zinc-600">
              {painting.description}
            </p>
            {painting.artistBio && (
              <div className="pt-2">
                <span className="font-semibold text-zinc-900 block mb-1">About {painting.artist}:</span>
                <p className="leading-relaxed text-zinc-600 italic">
                  "{painting.artistBio}"
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-100">
              Technical Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Medium</span>
                <span className="font-medium text-zinc-800">{painting.medium}</span>
              </div>
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Dimensions</span>
                <span className="font-medium text-zinc-800">{painting.dimensions}</span>
              </div>
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Orientation</span>
                <span className="font-medium text-zinc-800 capitalize">{painting.orientation}</span>
              </div>
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Year Created</span>
                <span className="font-medium text-zinc-800">{painting.year || 2024}</span>
              </div>
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Signature</span>
                <span className="font-medium text-zinc-800">Signed by artist on front & verso</span>
              </div>
              <div className="p-2.5 bg-[#faf7f2] rounded-lg">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">Authenticity</span>
                <span className="font-medium text-zinc-800">Tamper-proof signed COA included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Artworks Recommendation Strip */}
      {painting.related && painting.related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2dcce]">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
                More Creations
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
                You May Also Appreciate
              </h3>
            </div>
            <Link to="/gallery" className="text-xs text-[#8b5e34] font-medium hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painting.related.map((rel) => (
              <PaintingCard
                key={rel.id}
                painting={rel}
                onViewInRoom={(art) => {
                  setPainting(art);
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      {roomModalOpen && (
        <ViewInRoomModal
          painting={painting}
          isOpen={roomModalOpen}
          onClose={() => setRoomModalOpen(false)}
        />
      )}

      {coaModalOpen && (
        <CertificateModal
          painting={painting}
          isOpen={coaModalOpen}
          onClose={() => setCoaModalOpen(false)}
        />
      )}
    </div>
  );
}
