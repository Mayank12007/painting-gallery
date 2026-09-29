import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Truck, 
  RotateCcw, 
  Eye, 
  ChevronRight,
  SlidersHorizontal,
  Star,
  CheckCircle2
} from 'lucide-react';
import PaintingCard from '../components/PaintingCard';
import ViewInRoomModal from '../components/ViewInRoomModal';

const CATEGORIES_DATA = [
  {
    name: 'Abstract',
    query: 'Abstract',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
    tagline: 'Bold textures & evocative palettes'
  },
  {
    name: 'Landscape & Scenery',
    query: 'Landscape %26 Scenery',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    tagline: 'Serene ghats, mountains & waters'
  },
  {
    name: 'Spiritual & Devotional',
    query: 'Spiritual %26 Devotional',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
    tagline: 'Sacred Ganesha, Krishna & Buddha'
  },
  {
    name: 'Figurative & Portrait',
    query: 'Figurative %26 Portrait',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80',
    tagline: 'Rajasthani royalty & human grace'
  },
  {
    name: 'Modern & Contemporary',
    query: 'Modern %26 Contemporary',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80',
    tagline: 'Contemporary urban visions'
  },
  {
    name: 'Traditional & Folk Art',
    query: 'Traditional %26 Folk Art',
    count: 'Originals',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    tagline: 'Madhubani & Pichwai heritage'
  }
];

export default function HomePage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomPainting, setSelectedRoomPainting] = useState(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const res = await fetch('/api/paintings');
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

    fetchPaintings();
  }, []);

  const featuredArtworks = paintings.filter(p => p.featured).slice(0, 8);
  const heroPainting = paintings.find(p => p.id === 'art-1') || paintings[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Grand Luxury Hero Section */}
      <section className="relative bg-[#1c1917] text-white overflow-hidden py-16 sm:py-24 border-b border-[#2e2a27]">
        {/* Ambient Warm Backlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8b5e34]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2a2624] border border-[#443e39] text-[#c59b27] text-xs font-medium tracking-wider uppercase">
                <Sparkles size={14} />
                <span>India's Premier Online Fine Art Destination</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#f7f4ed]">
                Buy Original <br />
                <span className="italic font-light gold-text">Handmade Paintings</span> <br />
                Online in India
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                Discover museum-caliber fine art directly from vetted masters. Every canvas is 100% hand-painted, individually cataloged, and accompanied by a signed Certificate of Authenticity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/gallery"
                  className="w-full sm:w-auto bg-[#8b5e34] hover:bg-[#724a25] text-white text-sm font-semibold px-8 py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <span>Explore Art Collection</span>
                  <ArrowRight size={16} />
                </Link>

                {heroPainting && (
                  <button
                    onClick={() => setSelectedRoomPainting(heroPainting)}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-6 py-3.5 rounded-full border border-white/20 flex items-center justify-center gap-2 transition backdrop-blur-sm"
                  >
                    <Eye size={16} className="text-[#c59b27]" />
                    <span>Try "View in Room" 3D</span>
                  </button>
                )}
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-8 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl font-bold text-white block">100%</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Hand-Painted</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-white block">Free</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Insured Transit</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-white block">Official</span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Signed COA</span>
                </div>
              </div>
            </div>

            {/* Right Hero Artwork Card */}
            {heroPainting && (
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#8b5e34] to-[#c59b27] rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
                  
                  <div className="relative bg-[#262321] p-4 rounded-xl border border-[#443e39] shadow-2xl">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden relative">
                      <img
                        src={heroPainting.image}
                        alt={heroPainting.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        Curator's Choice
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{heroPainting.category}</span>
                        <span className="text-amber-400 font-medium">Original 1 of 1</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white truncate">
                        {heroPainting.title}
                      </h3>
                      <p className="text-xs text-zinc-300">By {heroPainting.artist}</p>

                      <div className="pt-3 flex items-center justify-between border-t border-zinc-700 mt-2">
                        <div>
                          <span className="text-xs text-zinc-400 block text-[10px] uppercase">Acquisition Price</span>
                          <span className="font-serif text-lg font-bold text-white">
                            ₹{heroPainting.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedRoomPainting(heroPainting)}
                          className="bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition"
                        >
                          <Eye size={14} />
                          <span>View on Wall</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Curated Categories Visual Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#e2dcce]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
              Explore by Art Style & Theme
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-[#8b5e34] hover:text-[#634120] flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.name}
              to={`/gallery?category=${cat.query}`}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-[#2a2624] shadow-md border border-[#ded8cb] hover:border-[#8b5e34] transition duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                <span className="text-[10px] text-[#c59b27] uppercase tracking-wider font-semibold">
                  Original
                </span>
                <h4 className="font-serif text-sm font-semibold leading-snug group-hover:text-[#f0e6d2] transition">
                  {cat.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Artworks (Curator's Spotlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#e2dcce]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
              Handpicked Originals
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
              Curator's Spotlight &bull; Trending Paintings
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-[#8b5e34] hover:text-[#634120] flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>Browse Full Gallery ({paintings.length} Artworks)</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#f2eee9] rounded-lg aspect-[4/5]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((painting) => (
              <PaintingCard
                key={painting.id}
                painting={painting}
                onViewInRoom={(art) => setSelectedRoomPainting(art)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Experience Art in Your Living Room Interactive Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24211e] rounded-2xl overflow-hidden border border-[#3e3833] text-white p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#c59b27] font-semibold uppercase tracking-wider">
                <Eye size={15} /> 3D Wall Simulation Technology
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-normal leading-tight">
                Preview Every Painting on Your Home Wall Before You Buy
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                Not sure if a 48-inch canvas will suit your living room sofa? Use our interactive room visualizer to toggle between wall paint colors, test floating teak or black framing, and check exact scale.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#c59b27]" /> Real-to-scale dimensions
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#c59b27]" /> Wall paint color testing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#c59b27]" /> Frame style previews
                </span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setSelectedRoomPainting(paintings[1] || paintings[0])}
                  className="bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition"
                >
                  <Eye size={16} />
                  <span>Launch Interactive Room Visualizer</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#332e2a] p-4 rounded-xl border border-zinc-700 shadow-inner w-full max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
                  alt="Room Visualizer"
                  className="rounded-lg shadow-md w-full h-52 object-cover"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                  <span>Living Room &bull; Greige Wall</span>
                  <span className="text-[#c59b27] font-medium">Teak Floater Frame</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Gallerist Guarantee Section */}
      <section className="bg-[#f2ece2] py-16 border-y border-[#ded8cb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34]">
              Buyer Confidence & Quality Assurance
            </span>
            <h2 className="font-serif text-3xl font-bold text-zinc-900">
              The Gallerist Authenticity Promise
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Every artwork bought from Gallerist represents the pinnacle of original hand-painted craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#faf5ee] text-[#8b5e34] flex items-center justify-center border border-[#e8dfd3]">
                <Award size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-zinc-900">100% Hand-Painted</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Handcrafted using pure pigments, oils, and acrylics on archival canvas or linen. We never sell computerized prints.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#faf5ee] text-[#8b5e34] flex items-center justify-center border border-[#e8dfd3]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-zinc-900">Signed Official COA</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Accompanied by a tamper-proof Certificate of Authenticity signed by both the master artist and our curatorial team.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#faf5ee] text-[#8b5e34] flex items-center justify-center border border-[#e8dfd3]">
                <Truck size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-zinc-900">Museum-Grade Packaging</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Packed in 5-ply waterproof bubble armor and reinforced wooden crates to ensure pristine door-to-door delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#faf5ee] text-[#8b5e34] flex items-center justify-center border border-[#e8dfd3]">
                <RotateCcw size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-zinc-900">Cod available</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hang the art in your home “Bring Timeless Art Into Your Home”
Let every wall tell a story with art that speaks to your soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Collector Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34]">
            Collector Experiences
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            Trusted by Art Enthusiasts & Designers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 italic leading-relaxed">
              "Acquired the 'Cosmic Ganesha' painting for our new home in Bengaluru. The 24K gold foil gleams exquisitely under our warm ceiling spotlights. The signed certificate and wooden crate packaging were world class."
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8b5e34] text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <h5 className="font-medium text-xs text-zinc-900">Raghavan Srinivasan</h5>
                <span className="text-[10px] text-zinc-400">Collector, Bengaluru</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 italic leading-relaxed">
              "As an interior designer, finding reliable original artwork with high-res photos and transparent pricing was always a struggle until Gallerist. The 'View in Room' tool made convincing our client effortless."
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8b5e34] text-white flex items-center justify-center font-bold text-xs">
                NM
              </div>
              <div>
                <h5 className="font-medium text-xs text-zinc-900">Nalini Mukherjee</h5>
                <span className="text-[10px] text-zinc-400">Principal Architect, Studio Opus, Mumbai</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#ded8cb] shadow-sm space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-zinc-600 italic leading-relaxed">
              "The palette knife texture on the Mumbai urban skyline is so rich you can feel the energy of the monsoon street. Gallerist is the most authentic art platform in India."
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8b5e34] text-white flex items-center justify-center font-bold text-xs">
                AK
              </div>
              <div>
                <h5 className="font-medium text-xs text-zinc-900">Dr. Anand Kapoor</h5>
                <span className="text-[10px] text-zinc-400">Senior Art Patron, New Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
