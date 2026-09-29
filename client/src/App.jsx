import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickAuthModal from './components/QuickAuthModal';
import AdminUploadModal from './components/AdminUploadModal';

import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PaintingDetailPage from './pages/PaintingDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';

function AppContent() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* Top Navbar */}
      <Navbar onOpenUpload={() => setUploadModalOpen(true)} />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/paintings" element={<Navigate to="/gallery" replace />} />
          <Route path="/painting/:id" element={<PaintingDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/my-orders" element={<CustomerOrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <QuickAuthModal />
      <AdminUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onArtworkAdded={() => {
          // Artwork added! Refresh or broadcast if needed
          window.location.reload();
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
