import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initialPaintings } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultState() {
  const adminHashedPassword = bcrypt.hashSync('admin123', 10);
  const userHashedPassword = bcrypt.hashSync('user123', 10);
  return {
    users: [
      { id: "usr_admin_1", email: "admin@gallerist.in", password: adminHashedPassword, name: "Devina Rao (Curator & Admin)", role: "admin", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80", phone: "+91 98200 12345", createdAt: new Date().toISOString() },
      { id: "usr_buyer_1", email: "buyer@example.com", password: userHashedPassword, name: "Aarav Sharma", role: "customer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", phone: "+91 98111 87654", createdAt: new Date().toISOString() }
    ],
    paintings: initialPaintings,
    orders: [{ id: "ORD-2024-9102", userId: "usr_buyer_1", customerName: "Aarav Sharma", customerEmail: "buyer@example.com", customerPhone: "+91 98111 87654", shippingAddress: { street: "Flat 402, Lotus Residency, Indiranagar 100ft Road", city: "Bengaluru", state: "Karnataka", pincode: "560038", country: "India" }, items: [{ paintingId: "art-5", title: "Monsoon Serenade over Alleppey", artist: "Thomas Kurian", image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80", price: 34000, framing: { id: "black_frame", name: "Matte Black Frame with 2\" White Mat", price: 4200 }, quantity: 1, itemTotal: 38200, coaNumber: "GLR-2024-8845" }], subtotal: 38200, shippingFee: 0, discount: 0, total: 38200, paymentMethod: "UPI (Google Pay)", paymentStatus: "Paid", orderStatus: "Dispatched", trackingNumber: "BLUEDART-IND-7782193", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }]
  };
}

class Database {
  constructor() { this.init(); }
  init() {
    if (!fs.existsSync(STORE_PATH)) { this.write(getDefaultState()); }
    else { try { JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')); } catch (err) { this.write(getDefaultState()); } }
  }
  read() { try { return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')); } catch (e) { return getDefaultState(); } }
  write(data) { try { fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8'); } catch (e) { console.error('Write error:', e); } }
  findUserByEmail(email) { return this.read().users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  findUserById(id) { return this.read().users.find(u => u.id === id); }
  createUser(userData) { const data = this.read(); const newUser = { id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, createdAt: new Date().toISOString(), role: 'customer', ...userData }; data.users.push(newUser); this.write(data); return newUser; }
  getAllPaintings(filters = {}) {
    const data = this.read(); let paintings = [...data.paintings];
    if (filters.category && filters.category !== 'All') paintings = paintings.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    if (filters.medium && filters.medium !== 'All') paintings = paintings.filter(p => p.medium.toLowerCase().includes(filters.medium.toLowerCase()));
    if (filters.orientation && filters.orientation !== 'All') paintings = paintings.filter(p => p.orientation.toLowerCase() === filters.orientation.toLowerCase());
    if (filters.minPrice) paintings = paintings.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) paintings = paintings.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.inStock === 'true') paintings = paintings.filter(p => p.inStock);
    if (filters.search) { const q = filters.search.toLowerCase(); paintings = paintings.filter(p => p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))); }
    if (filters.sort === 'price_asc') paintings.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price_desc') paintings.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'newest') paintings.sort((a, b) => (b.year || 0) - (a.year || 0));
    return paintings;
  }
  getPaintingById(id) { return this.read().paintings.find(p => p.id === id); }
  addPainting(paintingData) {
    const data = this.read();
    const newPainting = { id: `art-${Date.now()}`, createdAt: new Date().toISOString(), coaNumber: `GLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, inStock: true, stockQuantity: 1, featured: false, framingOptions: [{ id: "rolled", name: "Unframed (Rolled in Sturdy Art Tube)", price: 0, desc: "Ships safely rolled in heavy PVC tube" }, { id: "stretched", name: "Stretched Canvas (Gallery Wrapped)", price: 2000, desc: "Stretched on solid wood bars, ready to hang" }, { id: "teak_frame", name: "Handcrafted Teak Floating Frame", price: 4200, desc: "Solid teak floating frame with modern reveal" }, { id: "black_frame", name: "Minimalist Matte Black Frame", price: 3600, desc: "Contemporary matte black finish" }, { id: "gold_frame", name: "Royal Antique Gold Leaf Frame", price: 5400, desc: "Hand-finished museum gold leaf frame" }], ...paintingData };
    if (newPainting.originalPrice && newPainting.originalPrice > newPainting.price) { newPainting.discount = Math.round(((newPainting.originalPrice - newPainting.price) / newPainting.originalPrice) * 100); }
    data.paintings.unshift(newPainting); this.write(data); return newPainting;
  }
  updatePainting(id, updates) {
    const data = this.read(); const index = data.paintings.findIndex(p => p.id === id);
    if (index === -1) return null;
    data.paintings[index] = { ...data.paintings[index], ...updates, updatedAt: new Date().toISOString() };
    if (data.paintings[index].originalPrice && data.paintings[index].originalPrice > data.paintings[index].price) { data.paintings[index].discount = Math.round(((data.paintings[index].originalPrice - data.paintings[index].price) / data.paintings[index].originalPrice) * 100); }
    this.write(data); return data.paintings[index];
  }
  deletePainting(id) { const data = this.read(); const len = data.paintings.length; data.paintings = data.paintings.filter(p => p.id !== id); this.write(data); return data.paintings.length < len; }
  createOrder(orderData) {
    const data = this.read();
    const newOrder = { id: `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`, createdAt: new Date().toISOString(), orderStatus: "Received", paymentStatus: "Paid", ...orderData };
    orderData.items.forEach(item => { const art = data.paintings.find(p => p.id === item.paintingId); if (art) { art.stockQuantity = Math.max(0, (art.stockQuantity || 1) - item.quantity); if (art.stockQuantity === 0) art.inStock = false; } });
    data.orders.unshift(newOrder); this.write(data); return newOrder;
  }
  getOrdersByUser(userId) { return this.read().orders.filter(o => o.userId === userId); }
  getAllOrders() { return this.read().orders; }
  getOrderById(id) { return this.read().orders.find(o => o.id === id); }
  updateOrderStatus(orderId, status) { const data = this.read(); const order = data.orders.find(o => o.id === orderId); if (!order) return null; order.orderStatus = status; order.updatedAt = new Date().toISOString(); this.write(data); return order; }
  getAdminStats() {
    const data = this.read();
    const categoryCounts = {};
    data.paintings.forEach(p => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });
    return { totalPaintings: data.paintings.length, activeListings: data.paintings.filter(p => p.inStock).length, totalOrders: data.orders.length, totalRevenue: data.orders.reduce((sum, o) => sum + (o.total || 0), 0), recentOrders: data.orders.slice(0, 5), categoryCounts };
  }
}

export const db = new Database();
// stub for compatibility
export const connectDB = async () => { console.log('✅ JSON Database ready'); };
