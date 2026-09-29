<!-- # 🎨 Gallerist &mdash; Luxury Online Art Gallery & Marketplace -->

<!-- Inspired by **[Gallerist.in](https://gallerist.in)**, this application is a full-stack, role-based fine art e-commerce platform built for collectors, art lovers, and gallery curators. -->

<!-- ## 🔒 Role-Based Permissions
In accordance with fine art gallery integrity standards:
- **👑 Gallery Administrator**:
  - **Exclusively authorized to upload painting images and catalog new artworks**.
  - Sets artist name, title, medium, dimensions, orientation, pricing, discount, and framing options.
  - Automatically generates tamper-proof **Certificates of Authenticity (COA)** with unique serial numbers.
  - Manages artwork inventory (toggle in-stock / sold-out, edit, delete).
  - Admin Orders Pipeline: view incoming collector orders, update shipping and fulfillment status (*Received*, *Framing & Packaging*, *Dispatched*, *Delivered*).
  - Gallery analytics dashboard (total artworks, active listings, total orders, sales revenue in ₹).
- **🎨 Art Collector / Customer (Buyer)**:
  - **Strictly restricted from uploading paintings** (API enforces `403 Forbidden` if a non-admin attempts to upload).
  - Can browse and filter paintings by **Category**, **Medium**, **Orientation**, and **Price Range**.
  - **Interactive "View in Room" Simulator**: Visualize paintings scaled on living room, bedroom, or executive office walls with custom wall paint colors and live frame options.
  - Custom Framing Selector (Unframed Rolled, Stretched, Teakwood Floating, Matte Black, Royal Antique Gold) with real-time price updates.
  - Cart drawer, coupon discount support (`GALLERIST10`), and secure checkout flow with Indian addresses and simulated payment (UPI, Cards, Net Banking, COD).
  - Download and print the official signed **Certificate of Authenticity (COA)** for every acquired artwork.
  - Customer order tracking with BlueDart consignment numbers and status timeline.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### 1-Click Launch (Both Backend & Frontend)
From the project root:
```bash
npm start
```
This runs both the Express API server (Port 5000) and the Vite React frontend (Port 5173 / 5175) concurrently.

### Or Run Individually:

#### 1. Backend Server
```bash
cd server
npm start
```
API running on `http://localhost:5000`

#### 2. Frontend Client
```bash
cd client
npm run dev
```
Client running on `http://localhost:5175` (or `http://localhost:5173`)

---

## 🔑 Pre-Seeded Demo Accounts
Use the top announcement bar's **1-Click Demo Switcher** or enter these credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Gallery Admin** | `admin@gallerist.in` | `admin123` | Upload painting photos, set prices, manage inventory, fulfill orders |
| **🎨 Art Collector (Buyer)** | `buyer@example.com` | `user123` | Browse, interactive room preview, buy paintings, print certificates |

---

## 🌟 Key Features

### 1. Curated Artwork Catalog
- High-resolution photography of original, 100% hand-painted canvases.
- Filter by categories: **Abstract**, **Landscape & Scenery**, **Spiritual & Devotional** (Ganesha, Krishna, Buddha), **Figurative & Regal**, **Modern Contemporary**, **Traditional & Folk Art** (Madhubani).
- Filter by medium: **Oil on Belgian Linen**, **Acrylic**, **Watercolor**, **Mixed Media & Gold Leaf**.
- Filter by wall orientation: **Horizontal (Over the Sofa)**, **Vertical (Tall Entryway)**, **Square**.

### 2. Interactive "View in Room" 3D Simulator
- Allows collectors to preview how a painting looks on a wall before making an investment.
- Switch between 3 realistic room scenes:
  - Luxury Living Room (centered over 84" designer sofa)
  - Master Suite Bedroom (mounted above bed headboard)
  - Executive Office (statement study wall)
- Test 6 realistic wall paint colors (Warm Alabaster, Greige, Sage Garden, Midnight Navy, Terracotta Earth, Charcoal).
- Preview live frame styles on the wall.

### 3. Custom Handcrafted Gallery Framing
- Choose from 5 framing options with live price updates:
  1. *Unframed (Rolled in Sturdy PVC Art Tube)* (+₹0)
  2. *Stretched Canvas (Gallery Wrapped on pine wood)* (+₹2,000)
  3. *Handcrafted Teakwood Floating Frame* (+₹4,500)
  4. *Minimalist Matte Black Frame* (+₹3,800)
  5. *Royal Antique Gold Leaf Frame* (+₹5,600)

### 4. Official Signed Certificate of Authenticity (COA)
- Automatically generated for every cataloged artwork and order.
- Features Gallerist gold seal, unique serial number (e.g. `GLR-2024-8841`), artist signature, curator signature, and technical specifications.
- Printable layout directly from the browser (`window.print()`).

### 5. Secure Buyer Checkout & Order Tracking
- Multi-step address form with PIN code validation for India.
- Simulated payment options: UPI (Google Pay / PhonePe), Credit/Debit Cards, Net Banking, and Pay on Delivery.
- Free insured wooden crate delivery across India.

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, React Router v7.
- **Backend**: Express.js, JWT Authentication, bcryptjs, Multer (file uploads up to 25MB), CORS.
- **Storage**: Persistent JSON database engine with atomic file writes and seeded artwork data. -->
