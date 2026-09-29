import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  Award, 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote,
  CheckCircle2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, grandTotal, clearCart } = useCart();
  const { user, token, quickLogin, openAuth } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Mehta',
    email: user?.email || 'buyer@example.com',
    phone: user?.phone || '+91 98111 87654',
    street: 'Flat 402, Lotus Residency, Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-900">Your Art Collection is Empty</h2>
        <p className="text-xs text-zinc-500">Please choose an original painting to acquire before checking out.</p>
        <Link to="/gallery" className="inline-block bg-[#8b5e34] text-white text-xs font-semibold py-2.5 px-6 rounded-full">
          Browse Gallery
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let authToken = token;

      // If buyer is not signed in yet, auto quick-login as demo customer to proceed seamlessly!
      if (!authToken) {
        const loginRes = await quickLogin('buyer');
        if (loginRes.success && loginRes.user) {
          authToken = localStorage.getItem('gallerist_token');
        } else {
          openAuth('login');
          setLoading(false);
          return;
        }
      }

      const orderPayload = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        },
        phone: formData.phone,
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod,
        subtotal,
        discount: discountAmount,
        total: grandTotal,
        items: cartItems.map(item => ({
          paintingId: item.painting.id,
          title: item.painting.title,
          artist: item.painting.artist,
          image: item.painting.image,
          price: item.painting.price,
          framing: item.framing,
          quantity: item.quantity,
          itemTotal: item.totalPrice,
          coaNumber: item.painting.coaNumber
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      navigate(`/order-success/${data.id}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-[#ded8cb] pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
            Gallerist Secure Checkout
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
            Complete Your Artwork Acquisition
          </h1>
        </div>

        <Link
          to="/gallery"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Gallery</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Shipping & Payment vs Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Address & Payment Selection */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          {/* 1. Collector & Delivery Information */}
          <div className="bg-white p-6 rounded-2xl border border-[#ded8cb] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-[#8b5e34] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                Delivery Address (India)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Collector Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Phone Number (for transit updates) *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Email Address (for Certificate of Authenticity delivery) *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Street Address & Apartment / Landmark *
                </label>
                <input
                  type="text"
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-[#faf7f2] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full bg-zinc-100 border border-zinc-200 text-sm text-zinc-500 rounded-lg p-2.5 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-[#ded8cb] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-[#8b5e34] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                Payment Option
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'UPI' ? 'border-[#8b5e34] bg-[#faf5ee]' : 'border-[#ded8cb] bg-white'
                }`}
              >
                <Smartphone size={20} className="text-[#8b5e34]" />
                <div>
                  <p className="font-semibold text-zinc-900">UPI / QR (Instant)</p>
                  <p className="text-[10px] text-zinc-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'Card' ? 'border-[#8b5e34] bg-[#faf5ee]' : 'border-[#ded8cb] bg-white'
                }`}
              >
                <CreditCard size={20} className="text-[#8b5e34]" />
                <div>
                  <p className="font-semibold text-zinc-900">Credit / Debit Card</p>
                  <p className="text-[10px] text-zinc-500">Visa, MasterCard, RuPay</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'NetBanking' ? 'border-[#8b5e34] bg-[#faf5ee]' : 'border-[#ded8cb] bg-white'
                }`}
              >
                <Building size={20} className="text-[#8b5e34]" />
                <div>
                  <p className="font-semibold text-zinc-900">Net Banking</p>
                  <p className="text-[10px] text-zinc-500">HDFC, ICICI, SBI, Axis</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === 'COD' ? 'border-[#8b5e34] bg-[#faf5ee]' : 'border-[#ded8cb] bg-white'
                }`}
              >
                <Banknote size={20} className="text-[#8b5e34]" />
                <div>
                  <p className="font-semibold text-zinc-900">Pay on Delivery (COD)</p>
                  <p className="text-[10px] text-zinc-500">Inspection before payment</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ded8cb] space-y-2 mt-2">
                <label className="block text-xs font-semibold text-zinc-700">UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] text-xs rounded-lg p-2.5 outline-none focus:border-[#b59677]"
                />
                <p className="text-[10px] text-zinc-400">
                  Instant verification via NPCI gateway. Your payment is held securely in escrow until delivery is verified.
                </p>
              </div>
            )}

            {/* Place Order CTA */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold text-sm py-4 px-6 rounded-xl shadow-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Lock size={17} />
                <span>
                  {loading ? 'Confirming Artwork Acquisition...' : `Authorize Payment (${formatPrice(grandTotal)})`}
                </span>
              </button>
              <p className="text-[11px] text-center text-zinc-400 mt-2">
                🔒 256-Bit SSL Encrypted &bull; 100% Refundable within 7 Days of Receipt
              </p>
            </div>
          </div>
        </form>

        {/* Right 5 Cols: Cart Review & Inclusions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#ded8cb] shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Acquisition Summary ({cartItems.length} {cartItems.length === 1 ? 'Artwork' : 'Artworks'})
            </h3>

            {/* Item list */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-3.5 pb-4 border-b border-zinc-100">
                  <img
                    src={item.painting.image}
                    alt={item.painting.title}
                    className="w-16 h-20 object-cover rounded-md border border-[#ded8cb] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-zinc-900 truncate">
                      {item.painting.title}
                    </h4>
                    <p className="text-xs text-zinc-500">By {item.painting.artist}</p>
                    <p className="text-[11px] text-[#8b5e34] font-medium mt-0.5">
                      Framing: {item.framing.name}
                    </p>
                    <p className="text-xs font-semibold text-zinc-900 mt-1">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Artwork & Framing Subtotal</span>
                <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Collector Privileged Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Doorstep Freight (India)</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-lg text-[#8b5e34]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ded8cb] space-y-2 text-xs text-zinc-600">
              <span className="font-bold uppercase text-[10px] text-zinc-800 tracking-wider block">
                Included with this purchase:
              </span>
              <p className="flex items-center gap-1.5">
                <Award size={14} className="text-[#c59b27] shrink-0" />
                <span>Physical & digital signed Certificate of Authenticity (COA)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#c59b27] shrink-0" />
                <span>Reinforced 5-ply wooden crate with insurance coverage</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#c59b27] shrink-0" />
                <span>7-Day Home Trial with free pickup return guarantee</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
