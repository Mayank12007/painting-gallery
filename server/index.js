import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import { connectDB, db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gallerist_super_secret_jwt_key_2024';

// ─── Connect DB ───────────────────────────────────────────────────────────────
await connectDB();

// ─── Local Image Storage ──────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `art-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// ─── Auth Middleware ──────────────────────────────────────────────────────────
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required. Please sign in.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session. Please sign in again.' });
    req.user = user;
    next();
  });
};

// ─── Admin Middleware ─────────────────────────────────────────────────────────
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission Denied: Only Gallery Administrators can upload or manage artwork.' });
  }
  next();
};

/* ──────────────────── AUTH ROUTES ──────────────────────── */

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = db.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Name, email, and password are required' });
    const existing = db.findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.createUser({ email, name, phone: phone || '', password: hashedPassword, role: 'customer', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}` });
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, avatar: newUser.avatar, phone: newUser.phone } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone });
});

/* ──────────────────── PAINTINGS ROUTES ──────────────────────── */

app.get('/api/paintings', async (req, res) => {
  try {
    const paintings = db.getAllPaintings({
      category: req.query.category, medium: req.query.medium, orientation: req.query.orientation,
      minPrice: req.query.minPrice, maxPrice: req.query.maxPrice, inStock: req.query.inStock,
      search: req.query.search, sort: req.query.sort
    });
    res.json(paintings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve paintings' });
  }
});

app.get('/api/paintings/:id', async (req, res) => {
  try {
    const painting = db.getPaintingById(req.params.id);
    if (!painting) return res.status(404).json({ error: 'Artwork not found' });
    const all = db.getAllPaintings();
    const related = all.filter(p => p.id !== painting.id && (p.category === painting.category || p.artist === painting.artist)).slice(0, 4);
    res.json({ ...painting, related });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve painting' });
  }
});

app.post('/api/paintings', authenticateToken, requireAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, artist, artistBio, category, medium, style, orientation, dimensions, year, price, originalPrice, description, imageUrl, featured, stockQuantity } = req.body;
    if (!title || !artist || !price || !category) return res.status(400).json({ error: 'Title, Artist, Price, and Category are required' });
    let finalImageUrl = imageUrl;
    if (req.file) finalImageUrl = `/uploads/${req.file.filename}`;
    if (!finalImageUrl) return res.status(400).json({ error: 'Please upload an image or provide an image URL' });
    const painting = db.addPainting({
      title: title.trim(), artist: artist.trim(), artistBio: artistBio?.trim() || 'Fine artist represented by Gallerist.',
      category: category.trim(), medium: medium?.trim() || 'Mixed Media', style: style?.trim() || 'Contemporary',
      orientation: orientation || 'vertical', dimensions: dimensions?.trim() || '36" x 48"',
      year: year ? parseInt(year) : new Date().getFullYear(), price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      description: description?.trim() || 'Original artwork verified by Gallerist.',
      image: finalImageUrl, featured: featured === 'true' || featured === true,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : 1
    });
    res.status(201).json(painting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

app.put('/api/paintings/:id', authenticateToken, requireAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    if (updates.inStock !== undefined) updates.inStock = updates.inStock === 'true' || updates.inStock === true;
    const updated = db.updatePainting(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: 'Artwork not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

app.delete('/api/paintings/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const success = db.deletePainting(req.params.id);
    if (!success) return res.status(404).json({ error: 'Artwork not found' });
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

/* ──────────────────── ORDERS ROUTES ──────────────────────── */

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, total } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty.' });
    const user = db.findUserById(req.user.id);
    const order = db.createOrder({
      userId: req.user.id, customerName: user?.name || req.user.name, customerEmail: user?.email || req.user.email,
      customerPhone: user?.phone || req.body.phone || '', shippingAddress, items,
      subtotal: subtotal || total, shippingFee: 0, discount: discount || 0, total,
      paymentMethod: paymentMethod || 'UPI', paymentStatus: 'Paid',
      trackingNumber: `GLR-${Math.floor(1000000 + Math.random() * 9000000)}`
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders/my-orders', authenticateToken, async (req, res) => {
  try {
    res.json(db.getOrdersByUser(req.user.id));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

/* ──────────────────── ADMIN ROUTES ──────────────────────── */

app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    res.json(db.getAllOrders());
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin orders' });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    res.json(db.getAdminStats());
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// ─── Serve React in Production ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => res.sendFile(path.join(clientBuildPath, 'index.html')));
}

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎨 Gallerist Art Gallery API running on http://localhost:${PORT}`);
});
