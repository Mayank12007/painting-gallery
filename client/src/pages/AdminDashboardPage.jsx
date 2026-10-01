import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Eye, 
  ShieldAlert, 
  Package, 
  DollarSign, 
  Layers, 
  CheckCircle, 
  Truck, 
  Clock, 
  IndianRupee,
  Sparkles,
  Search,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminUploadModal from '../components/AdminUploadModal';

export default function AdminDashboardPage() {
  const { user, token, isAdmin, quickLogin } = useAuth();

  const [paintings, setPaintings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchInventory, setSearchInventory] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [lastSeenOrders, setLastSeenOrders] = useState(() => {
    return parseInt(localStorage.getItem('gallerist_last_seen_orders') || '0', 10);
  });

  // Fetch admin data
  const fetchData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [paintingsRes, ordersRes, statsRes] = await Promise.all([
        fetch('/api/paintings'),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/stats', { headers })
      ]);

      if (paintingsRes.ok) setPaintings(await paintingsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin, token]);

  const handleDeletePainting = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${title}" from the gallery catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/paintings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setPaintings(prev => prev.filter(p => p.id !== id));
        setActionNotice(`"${title}" deleted successfully`);
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleToggleStock = async (painting) => {
    try {
      const res = await fetch(`/api/paintings/${painting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inStock: !painting.inStock })
      });

      if (res.ok) {
        const updated = await res.json();
        setPaintings(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
    } catch (err) {
      console.error('Stock toggle failed:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        setActionNotice(`Order #${orderId} status set to ${newStatus}`);
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      console.error('Order status update failed:', err);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // If user is not admin, show strict role restriction barrier
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-zinc-900">
          Admin Portal Access Restricted
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
          As requested by platform policy, <strong>only gallery administrators can upload painting images</strong> and manage artworks. Customers are restricted to purchasing and viewing art.
        </p>

        <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ded8cb] text-xs text-left space-y-3">
          <span className="font-semibold text-zinc-800 block">Switch to Admin Mode:</span>
          <p className="text-zinc-600">
            Click below to instantly log in as <strong>Gallery Administrator</strong> and unlock the upload tools.
          </p>
          <button
            onClick={() => quickLogin('admin')}
            className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold py-2.5 px-4 rounded-xl shadow transition"
          >
            👑 Log In as Gallery Admin (Upload Permissions)
          </button>
        </div>
      </div>
    );
  }

  const filteredPaintings = paintings.filter(p =>
    p.title.toLowerCase().includes(searchInventory.toLowerCase()) ||
    p.artist.toLowerCase().includes(searchInventory.toLowerCase()) ||
    p.category.toLowerCase().includes(searchInventory.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded8cb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-300">
              Curator & Administrator Mode
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
            Gallerist Management Dashboard
          </h1>
          <p className="text-xs text-zinc-500">
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs sm:text-sm font-semibold py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
        >
          <PlusCircle size={17} />
          <span>Upload New Painting</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 font-medium">
          <CheckCircle size={15} className="text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Artworks</span>
            <Layers size={18} className="text-[#8b5e34]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            {stats?.totalPaintings ?? paintings.length}
          </p>
          <span className="text-[10px] text-zinc-500 block">
            {stats?.activeListings ?? paintings.filter(p => p.inStock).length} Available in Storefront
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Customer Orders</span>
            <Package size={18} className="text-[#8b5e34]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            {stats?.totalOrders ?? orders.length}
          </p>
          <span className="text-[10px] text-zinc-500 block">
            Across India collector deliveries
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales Revenue</span>
            <IndianRupee size={18} className="text-[#8b5e34]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            {formatPrice(stats?.totalRevenue ?? orders.reduce((sum, o) => sum + (o.total || 0), 0))}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Verified Escrow Deposits
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Authenticity Status</span>
            <ShieldAlert size={18} className="text-[#8b5e34]" />
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
            100% Verified
          </p>
          <span className="text-[10px] text-zinc-500 block">
            Upload privileges strictly protected
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-3 border-b border-[#ded8cb] pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2 text-xs sm:text-sm font-semibold tracking-wide transition border-b-2 ${
            activeTab === 'inventory'
              ? 'border-[#8b5e34] text-[#8b5e34]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Artwork Inventory ({paintings.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
            const newCount = orders.length;
            setLastSeenOrders(newCount);
            localStorage.setItem('gallerist_last_seen_orders', String(newCount));
          }}
          className={`pb-2 text-xs sm:text-sm font-semibold tracking-wide transition border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#8b5e34] text-[#8b5e34]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Customer Orders ({orders.length})
          {orders.length > lastSeenOrders && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {orders.length - lastSeenOrders} NEW
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ARTWORK INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Inventory search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search catalog by title, artist, or style..."
                value={searchInventory}
                onChange={(e) => setSearchInventory(e.target.value)}
                className="w-full bg-white border border-[#ded8cb] text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#b59677]"
              />
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="text-xs font-semibold text-[#8b5e34] hover:underline flex items-center gap-1"
            >
              <PlusCircle size={14} /> Add Artwork
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#ded8cb] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf7f2] text-zinc-500 uppercase font-mono text-[10px] tracking-wider border-b border-[#ded8cb]">
                  <tr>
                    <th className="py-3 px-4">Artwork</th>
                    <th className="py-3 px-4">Artist & COA</th>
                    <th className="py-3 px-4">Category & Dimensions</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredPaintings.map((painting) => (
                    <tr key={painting.id} className="hover:bg-[#faf8f5] transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={painting.image}
                            alt={painting.title}
                            className="w-12 h-14 object-cover rounded shadow-sm border border-zinc-200"
                          />
                          <div>
                            <span className="font-serif font-bold text-zinc-900 block max-w-xs truncate">
                              {painting.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              ID: {painting.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-800 block">{painting.artist}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {painting.coaNumber || 'GLR-2024-8841'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-800 block">{painting.category}</span>
                        <span className="text-[10px] text-zinc-500">{painting.dimensions}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-900 block">
                          {formatPrice(painting.price)}
                        </span>
                        {painting.originalPrice && painting.originalPrice > painting.price && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatPrice(painting.originalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(painting)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                            painting.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                          }`}
                        >
                          {painting.inStock ? 'In Stock (Live)' : 'Sold Out'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <a
                          href={`/painting/${painting.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                          title="View on Storefront"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          onClick={() => handleDeletePainting(painting.id, painting.title)}
                          className="p-1.5 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete from Catalog"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#ded8cb] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf7f2] text-zinc-500 uppercase font-mono text-[10px] tracking-wider border-b border-[#ded8cb]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Acquired Artwork</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-400">
                        No customer orders received yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#faf8f5] transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-zinc-900 block">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-zinc-800 block">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-zinc-500 block">{order.customerEmail}</span>
                          {order.customerPhone && (
                            <span className="text-[11px] text-zinc-600 block">
                              Phone: {order.customerPhone}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400 block">
                            {[order.shippingAddress?.street, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.pincode, order.shippingAddress?.country]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={it.image}
                                alt={it.title}
                                className="w-8 h-10 object-cover rounded border"
                              />
                              <div className="min-w-0">
                                <span className="font-medium text-zinc-900 truncate block max-w-xs">
                                  {it.title}
                                </span>
                                <span className="text-[10px] text-[#8b5e34]">
                                  {it.framing?.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-zinc-900 block text-sm">
                            {formatPrice(order.total)}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-white border border-[#ded8cb] text-xs rounded-lg py-1.5 px-2.5 font-medium text-zinc-800 outline-none focus:border-[#b59677]"
                          >
                            <option value="Received">Received</option>
                            <option value="Framing & Packaging">Framing & Packaging</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Modal */}
      {uploadModalOpen && (
        <AdminUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onArtworkAdded={() => fetchData()}
        />
      )}
    </div>
  );
}
