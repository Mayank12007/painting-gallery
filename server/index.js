import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gallerist_super_secret_jwt_key_2024';

// Setup file upload with Multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'painting-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploaded artwork images
app.use('/uploads', express.static(uploadsDir));

// Authentication Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session. Please sign in again.' });
    }
    req.user = user;
    next();
  });
};

// Strict Admin-Only Middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Permission Denied: Only Gallery Administrators can upload or manage artwork.'
    });
  }
  next();
};

/* ---------------- AUTH ROUTES ---------------- */

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Register (Customer only!)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.createUser({
      email,
      name,
      phone: phone || '',
      password: hashedPassword,
      role: 'customer', // strictly enforce customer role for public registration
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone
  });
});

/* ---------------- PAINTINGS ROUTES ---------------- */

// Public: Get all paintings with filtering, searching, sorting
app.get('/api/paintings', (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      medium: req.query.medium,
      orientation: req.query.orientation,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      inStock: req.query.inStock,
      search: req.query.search,
      sort: req.query.sort
    };
    const paintings = db.getAllPaintings(filters);
    res.json(paintings);
  } catch (error) {
    console.error('Error fetching paintings:', error);
    res.status(500).json({ error: 'Failed to retrieve paintings' });
  }
});

// Public: Get painting by ID
app.get('/api/paintings/:id', (req, res) => {
  try {
    const painting = db.getPaintingById(req.params.id);
    if (!painting) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Also fetch 4 related paintings from the same category
    const all = db.getAllPaintings();
    const related = all
      .filter(p => p.id !== painting.id && (p.category === painting.category || p.artist === painting.artist))
      .slice(0, 4);

    res.json({ ...painting, related });
  } catch (error) {
    console.error('Error fetching painting details:', error);
    res.status(500).json({ error: 'Failed to retrieve painting' });
  }
});

// STRICT ADMIN ONLY: Upload new painting with image file OR image URL
app.post('/api/paintings', authenticateToken, requireAdmin, upload.single('imageFile'), (req, res) => {
  try {
    const {
      title,
      artist,
      artistBio,
      category,
      medium,
      style,
      orientation,
      dimensions,
      year,
      price,
      originalPrice,
      description,
      imageUrl,
      featured,
      stockQuantity
    } = req.body;

    if (!title || !artist || !price || !category) {
      return res.status(400).json({ error: 'Title, Artist, Price, and Category are mandatory fields' });
    }

    let finalImageUrl = imageUrl;
    if (req.file) {
      // Image uploaded via Multer
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'Please upload an image file or provide an artwork image URL' });
    }

    const painting = db.addPainting({
      title: title.trim(),
      artist: artist.trim(),
      artistBio: artistBio ? artistBio.trim() : 'Fine artist represented by Gallerist.',
      category: category.trim(),
      medium: medium ? medium.trim() : 'Mixed Media on Stretched Canvas',
      style: style ? style.trim() : 'Contemporary',
      orientation: orientation || 'vertical',
      dimensions: dimensions ? dimensions.trim() : '36" x 48" (91.4 x 121.9 cm)',
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      description: description ? description.trim() : 'Original artwork verified by Gallerist Curators.',
      image: finalImageUrl,
      featured: featured === 'true' || featured === true,
      stockQuantity: stockQuantity ? parseInt(stockQuantity, 10) : 1
    });

    res.status(201).json(painting);
  } catch (error) {
    console.error('Error adding painting:', error);
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

// STRICT ADMIN ONLY: Update existing painting
app.put('/api/paintings/:id', authenticateToken, requireAdmin, upload.single('imageFile'), (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    if (updates.year) updates.year = parseInt(updates.year, 10);
    if (updates.featured !== undefined) updates.featured = updates.featured === 'true' || updates.featured === true;
    if (updates.inStock !== undefined) updates.inStock = updates.inStock === 'true' || updates.inStock === true;

    const updated = db.updatePainting(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating painting:', error);
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

// STRICT ADMIN ONLY: Delete painting
app.delete('/api/paintings/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const success = db.deletePainting(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Artwork not found or already deleted' });
    }
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting painting:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

/* ---------------- ORDERS ROUTES ---------------- */

// Customer: Place an order
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add artwork to purchase.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ error: 'Complete delivery address is required.' });
    }

    const user = db.findUserById(req.user.id);

    const order = db.createOrder({
      userId: req.user.id,
      customerName: user ? user.name : req.user.name,
      customerEmail: user ? user.email : req.user.email,
      customerPhone: user ? user.phone : (req.body.phone || ''),
      shippingAddress,
      items,
      subtotal: subtotal || total,
      shippingFee: 0, // Free insured shipping across India
      discount: discount || 0,
      total,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      trackingNumber: `GLR-${Math.floor(1000000 + Math.random() * 9000000)}`
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Customer: View their own orders
app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Public / Customer: View specific order by ID (with authorization check)
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Allow if admin or order owner
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: You do not own this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

/* ---------------- ADMIN PORTAL ROUTES ---------------- */

// STRICT ADMIN ONLY: Get all orders
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  try {
    const orders = db.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to retrieve admin orders' });
  }
});

// STRICT ADMIN ONLY: Update order fulfillment status
app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// STRICT ADMIN ONLY: Get gallery performance metrics
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🎨 Gallerist Art Gallery API running on http://localhost:${PORT}`);
});
