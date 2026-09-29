import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Award, 
  Printer, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Package,
  Calendar,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token || localStorage.getItem('gallerist_token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    window.scrollTo(0, 0);
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-zinc-600 mt-4 text-sm">Issuing Official Certificates...</p>
      </div>
    );
  }

  const primaryItem = order?.items?.[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Success Hero Header (hidden on print) */}
      <div className="text-center space-y-3 bg-[#faf7f2] p-8 sm:p-12 rounded-3xl border border-[#ded8cb] shadow-sm print:hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle size={36} />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-[#8b5e34] block">
          Acquisition Secured
        </span>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zinc-900">
          Congratulations! Your Artwork is Confirmed.
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Order reference <span className="font-mono font-bold text-zinc-900">{order?.id || id}</span>. Our master framing artisans are preparing your custom packaging for insured delivery.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs font-semibold py-2.5 px-5 rounded-full shadow flex items-center gap-2 transition"
          >
            <Printer size={15} />
            <span>Print Official Certificate of Authenticity</span>
          </button>

          <Link
            to="/my-orders"
            className="bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold py-2.5 px-5 rounded-full border border-[#ded8cb] shadow-sm flex items-center gap-2 transition"
          >
            <Package size={15} className="text-[#8b5e34]" />
            <span>Track Delivery Status</span>
          </Link>
        </div>
      </div>

      {/* Transit & Fulfillment Info (hidden on print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs print:hidden">
        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#faf5ee] text-[#8b5e34]">
            <Truck size={20} />
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block font-mono">Consignment Tracker</span>
            <span className="font-bold text-zinc-900 text-sm">{order?.trackingNumber || 'GLR-7782193'}</span>
            <p className="text-zinc-500 mt-1">Dispatches in 24-48 hrs with BlueDart Apex Priority.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#faf5ee] text-[#8b5e34]">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block font-mono">Estimated Arrival</span>
            <span className="font-bold text-zinc-900 text-sm">3 &ndash; 5 Business Days</span>
            <p className="text-zinc-500 mt-1">Direct white-glove delivery to your doorstep.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#faf5ee] text-[#8b5e34]">
            <MapPin size={20} />
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block font-mono">Destination</span>
            <span className="font-bold text-zinc-900 text-sm truncate block">
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
            </span>
            <p className="text-zinc-500 mt-1">{order?.shippingAddress?.street} ({order?.shippingAddress?.pincode})</p>
          </div>
        </div>
      </div>

      {/* Official Certificate of Authenticity Document (Included & Printable) */}
      {primaryItem && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb] print:hidden">
            <h3 className="font-serif text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Award size={20} className="text-[#c59b27]" />
              Official Certificate of Authenticity Included with This Artwork
            </h3>
            <span className="text-xs text-zinc-500">Document No: {primaryItem.coaNumber || 'GLR-2024-8841'}</span>
          </div>

          <div className="bg-white p-8 sm:p-14 certificate-border rounded-xl shadow-xl relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <ShieldCheck size={360} />
            </div>

            <div className="text-center pb-6 border-b border-[#c5b49f]/50">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.25em] text-[#1c1917] block">
                GALLERIST
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#8c6d48] font-semibold block mt-1">
                National Fine Art Registry &bull; Bengaluru, India
              </span>
              <h2 className="font-serif text-2xl italic text-[#4a3f35] mt-4 font-normal">
                Official Certificate of Authenticity
              </h2>
              <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1">
                Issued for Order: <span className="font-mono font-bold text-zinc-800">{order?.id || id}</span>
              </p>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl mx-auto text-center italic font-serif">
                "This document legally certifies that the painting titled <strong className="text-zinc-900 not-italic">"{primaryItem.title}"</strong> is an original, 100% hand-painted work created by master artist <strong className="text-zinc-900 not-italic">{primaryItem.artist}</strong>, certified under registry seal."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#f0ece5] text-left">
                <div className="sm:col-span-1 flex justify-center sm:justify-start">
                  <img
                    src={primaryItem.image}
                    alt={primaryItem.title}
                    className="w-32 h-40 object-cover border-2 border-[#b59677] shadow-md rounded"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Title</span>
                    <span className="font-serif text-base font-bold text-zinc-900">{primaryItem.title}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Artist</span>
                    <span className="font-semibold text-zinc-800">{primaryItem.artist}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-zinc-400 uppercase text-[10px] block font-mono">Framing Specification</span>
                      <span className="text-zinc-700">{primaryItem.framing?.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 uppercase text-[10px] block font-mono">Serial / COA ID</span>
                      <span className="font-mono text-zinc-800 font-bold">{primaryItem.coaNumber || 'GLR-2024-8841'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Collector / Acquired By</span>
                    <span className="font-medium text-zinc-800">{order?.customerName || 'Aarav Mehta'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#c5b49f]/50 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
              <div>
                <div className="font-serif italic text-base text-[#8c6d48] font-bold">
                  {primaryItem.artist}
                </div>
                <div className="w-36 h-[1px] bg-zinc-400 mx-auto my-1"></div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                  Artist's Signature
                </span>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-[#b59677] bg-[#f9f5ed] flex flex-col items-center justify-center p-1 text-[#8b5e34] shadow-inner">
                <Award size={22} />
                <span className="text-[7px] uppercase font-bold tracking-tighter mt-0.5">SEAL OF AUTHENTICITY</span>
              </div>

              <div>
                <div className="font-serif italic text-base text-zinc-800 font-bold">
                  Devina Rao
                </div>
                <div className="w-36 h-[1px] bg-zinc-400 mx-auto my-1"></div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                  Chief Curator, Gallerist India
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Return to Gallery Link (hidden on print) */}
      <div className="text-center pt-4 print:hidden">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8b5e34] hover:underline"
        >
          <span>Continue Exploring Gallerist Collection</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
