import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Award, 
  Truck, 
  CheckCircle, 
  Clock, 
  Printer, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CertificateModal from '../components/CertificateModal';

export default function CustomerOrdersPage() {
  const { user, token, quickLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoaPainting, setSelectedCoaPainting] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const authToken = token || localStorage.getItem('gallerist_token');
        if (!authToken) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Framing & Packaging':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#ded8cb] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8b5e34] block">
            Collector Portfolio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
            My Acquired Artworks & Orders
          </h1>
          <p className="text-xs text-zinc-500">
            View order tracking status and access signed Certificates of Authenticity
          </p>
        </div>

        <Link
          to="/gallery"
          className="text-xs font-semibold text-[#8b5e34] hover:underline flex items-center gap-1"
        >
          <span>Explore More Art</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {!user ? (
        <div className="bg-white p-8 rounded-2xl border border-[#ded8cb] text-center space-y-4">
          <Package size={36} className="mx-auto text-zinc-400" />
          <h3 className="font-serif text-lg font-bold text-zinc-800">Sign in to view your collection</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Log in to view past artwork orders, consignment trackings, and print authentic certificates.
          </p>
          <button
            onClick={() => quickLogin('buyer')}
            className="bg-[#8b5e34] text-white text-xs font-semibold py-2.5 px-6 rounded-full shadow"
          >
            Quick Sign In as Art Collector
          </button>
        </div>
      ) : loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-zinc-600 mt-3 text-xs">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#ded8cb] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#faf5ee] text-zinc-400 flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h3 className="font-serif text-xl font-bold text-zinc-800">
            No acquisitions yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            You haven't acquired any original paintings yet. Explore our curated gallery of original hand-painted artworks with free insured delivery across India.
          </p>
          <Link
            to="/gallery"
            className="inline-block bg-[#8b5e34] text-white text-xs font-semibold py-2.5 px-6 rounded-full shadow"
          >
            Explore Available Paintings
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#ded8cb] shadow-sm overflow-hidden"
            >
              {/* Order Header Card */}
              <div className="bg-[#faf7f2] p-4 sm:p-5 border-b border-[#ded8cb] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Order Reference</span>
                    <span className="font-mono font-bold text-zinc-900">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Date Placed</span>
                    <span className="text-zinc-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Consignment Tracker</span>
                    <span className="font-mono text-zinc-700">{order.trackingNumber || 'GLR-7782193'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="font-bold text-sm text-zinc-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-5 sm:p-6 divide-y divide-zinc-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-md border border-[#ded8cb] shadow-sm shrink-0"
                      />
                      <div>
                        <h4 className="font-serif text-base font-bold text-zinc-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-600">By {item.artist}</p>
                        <p className="text-[11px] text-[#8b5e34] font-medium mt-0.5">
                          Framing: {item.framing?.name}
                        </p>
                        <p className="text-xs font-semibold text-zinc-900 mt-1">
                          {formatPrice(item.itemTotal || item.price)}
                        </p>
                      </div>
                    </div>

                    {/* View Certificate Button */}
                    <button
                      onClick={() => {
                        setSelectedCoaPainting({
                          title: item.title,
                          artist: item.artist,
                          image: item.image,
                          medium: 'Fine Art on Canvas',
                          dimensions: 'Verified by Gallerist',
                          year: 2024,
                          coaNumber: item.coaNumber || 'GLR-2024-8841'
                        });
                      }}
                      className="bg-white hover:bg-[#faf7f2] text-zinc-800 text-xs font-semibold py-2 px-4 rounded-xl border border-[#ded8cb] shadow-sm flex items-center gap-2 transition"
                    >
                      <Award size={16} className="text-[#8b5e34]" />
                      <span>Inspect & Print Signed Certificate</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Shipping Address Footer */}
              <div className="bg-[#fcfaf7] px-6 py-3 border-t border-[#ded8cb] text-xs text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#8b5e34]" />
                  <span>
                    Delivering to: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                  </span>
                </span>
                <span className="text-emerald-700 font-medium">Free Insured Transit Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCoaPainting && (
        <CertificateModal
          painting={selectedCoaPainting}
          isOpen={!!selectedCoaPainting}
          onClose={() => setSelectedCoaPainting(null)}
        />
      )}
    </div>
  );
}
