import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PaintingCard({ painting, onViewInRoom }) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const isWishlisted = isInWishlist(painting.id);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-[#e8e2d8] hover:border-[#b59677] hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Artwork Image Container */}
      <div className="relative aspect-[4/5] bg-[#f5f1eb] overflow-hidden">
        <Link to={`/painting/${painting.id}`} className="block w-full h-full">
          <img
            src={painting.image}
            alt={painting.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-[#1c1917]/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded backdrop-blur-sm shadow-sm">
            Original Art
          </span>
          {painting.discount && painting.discount > 0 && (
            <span className="bg-[#b59677] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm w-fit">
              {painting.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(painting.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-md ${
            isWishlisted 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/90 text-zinc-700 hover:text-rose-500 hover:bg-white backdrop-blur-sm'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Sold Out Overlay */}
        {!painting.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-900/90 text-red-100 font-serif uppercase tracking-widest text-sm font-semibold px-4 py-1.5 border border-red-400">
              Private Collection &bull; Sold
            </span>
          </div>
        )}

        {/* Bottom Quick-Action Hover Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
          {/* View in Room simulator button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onViewInRoom(painting);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-zinc-900 text-xs font-semibold py-2 px-2.5 rounded flex items-center justify-center gap-1.5 shadow transition"
            title="Preview this painting on a living room wall"
          >
            <Eye size={14} className="text-[#8b5e34]" />
            <span>View in Room</span>
          </button>

          {/* Quick Add to Cart button */}
          {painting.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(painting);
              }}
              className="bg-[#8b5e34] hover:bg-[#724a25] text-white p-2 rounded shadow transition"
              title="Add to Cart"
            >
              <ShoppingBag size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Artwork Meta Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Verified Badge */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[#8c6d48]">
              {painting.category}
            </span>
            <span className="flex items-center gap-0.5 text-emerald-700" title="Signed Certificate of Authenticity Included">
              <ShieldCheck size={13} />
              <span className="text-[10px]">Verified COA</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/painting/${painting.id}`} className="block group-hover:text-[#8b5e34] transition">
            <h3 className="font-serif text-base font-semibold text-zinc-900 line-clamp-1">
              {painting.title}
            </h3>
          </Link>

          {/* Artist */}
          <p className="text-xs text-zinc-600 mt-0.5">
            By <span className="font-medium text-zinc-800">{painting.artist}</span>
          </p>

          {/* Medium & Dimensions */}
          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
            {painting.medium} &bull; {painting.dimensions}
          </p>
        </div>

        {/* Pricing & Cart Button */}
        <div className="mt-4 pt-3 border-t border-[#f0ebe3] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base text-zinc-900">
                {formatPrice(painting.price)}
              </span>
              {painting.originalPrice && painting.originalPrice > painting.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(painting.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 block font-medium">
              Free Insured Delivery
            </span>
          </div>

          <Link
            to={`/painting/${painting.id}`}
            className="text-xs font-medium text-[#8b5e34] hover:text-[#5c3e1e] hover:underline transition"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
