import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShieldCheck, Truck, ArrowRight, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateFraming,
    subtotal,
    discountAmount,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    grandTotal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeCart();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl flex flex-col border-l border-[#ded8cb]">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-white border-b border-[#e8e2d8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-zinc-900 tracking-wide">
                Your Art Collection
              </span>
              <span className="bg-[#b59677]/15 text-[#8b5e34] text-xs font-semibold px-2 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'Artwork' : 'Artworks'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Insured Delivery Banner */}
          <div className="bg-[#f0ebe1] px-6 py-2.5 flex items-center gap-2 text-xs text-zinc-700 border-b border-[#e2dcce]">
            <Truck size={15} className="text-[#8b5e34] shrink-0" />
            <span>Eligible for <strong>Free Museum-Grade Insured Delivery</strong> across India.</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#f0ece5] flex items-center justify-center text-zinc-400">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="font-serif text-lg font-medium text-zinc-800">Your collection is empty</h4>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Discover museum-quality original paintings handcrafted by certified Indian artists.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/gallery');
                  }}
                  className="mt-2 bg-[#8b5e34] text-white text-xs font-medium py-2 px-4 rounded-full shadow hover:bg-[#724a25] transition"
                >
                  Explore Available Artworks
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-3.5 rounded-xl border border-[#e8e2d8] shadow-sm flex gap-3.5 relative group"
                >
                  <img
                    src={item.painting.image}
                    alt={item.painting.title}
                    className="w-20 h-24 object-cover rounded-md border border-[#f0ebe1] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-zinc-900 truncate">
                        {item.painting.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate">
                        By {item.painting.artist}
                      </p>

                      {/* Framing choice dropdown */}
                      <div className="mt-1.5">
                        <select
                          value={item.framing.id}
                          onChange={(e) => {
                            const newFraming = item.painting.framingOptions?.find(
                              f => f.id === e.target.value
                            );
                            if (newFraming) updateFraming(item.cartItemId, newFraming);
                          }}
                          className="text-[11px] bg-[#f9f7f4] border border-[#ded8cb] rounded px-2 py-1 text-zinc-700 outline-none w-full truncate focus:border-[#b59677]"
                        >
                          {item.painting.framingOptions?.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name} {f.price > 0 ? `(+₹${f.price.toLocaleString('en-IN')})` : '(Included)'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                      <span className="font-semibold text-sm text-zinc-900">
                        {formatPrice(item.totalPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-zinc-400 hover:text-rose-600 transition p-1"
                        title="Remove from cart"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#e8e2d8] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. GALLERIST10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-[#f9f7f4] border border-[#ded8cb] text-xs rounded-lg pl-8 pr-3 py-2 outline-none uppercase placeholder:normal-case focus:border-[#b59677]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2a2624] hover:bg-black text-white text-xs font-semibold px-4 rounded-lg transition"
                >
                  Apply
                </button>
              </form>

              {coupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-md border border-emerald-200">
                  <span className="flex items-center gap-1 font-medium">
                    <Check size={13} /> {coupon} Applied!
                  </span>
                  <button onClick={removeCoupon} className="text-zinc-500 hover:text-rose-600 text-[11px] underline">
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Collector Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Packaging & Transit</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span className="text-base text-[#8b5e34]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[10px] text-center text-zinc-400">
                🔒 256-bit Encrypted Checkout &bull; 7-Day Art Return Guarantee
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
