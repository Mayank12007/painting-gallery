import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, RotateCcw, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#181615] text-[#d6cec2] pt-16 pb-12 border-t border-[#2e2a27]">
      {/* 4 Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2e2a27]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#2a2624] flex items-center justify-center text-[#c59b27] shrink-0 border border-[#3e3833]">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">100% Original Art</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Handmade by master artists, never machine prints.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#2a2624] flex items-center justify-center text-[#c59b27] shrink-0 border border-[#3e3833]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Signed Certificate</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Official COA signed by artist & gallery curator.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#2a2624] flex items-center justify-center text-[#c59b27] shrink-0 border border-[#3e3833]">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Free Insured Transit</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Custom wooden crating with door-to-door transit cover.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#2a2624] flex items-center justify-center text-[#c59b27] shrink-0 border border-[#3e3833]">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium text-base">Cod available</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Return policy not available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-sm">
        {/* Brand Bio */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
              GALLERIST
            </span>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#b59677] font-medium">
              Fine Art &bull; Curated Originals
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
           New Creations is India's leading online art platform connecting discerning collectors, interior designers, and art lovers with certified original artworks. Only verified gallery curators upload artworks, ensuring 100% authenticity and museum-grade quality.
          </p>
          <div className="text-xs text-zinc-400 space-y-1.5 pt-2">
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-[#c59b27]" />
              <span>Art Advisory Helpline: +91 9610105883</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-[#c59b27]" />
              <span>newcreations.parul@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-[#c59b27]" />
              <span> Flat no 103, G-13, Krishna Marg, C-Scheme, Jaipur, Raj 302001</span>
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="font-serif text-white font-medium tracking-wider text-sm uppercase">Curated Styles</h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link to="/gallery?category=Abstract" className="hover:text-[#c59b27] transition">Abstract Paintings</Link></li>
            <li><Link to="/gallery?category=Landscape %26 Scenery" className="hover:text-[#c59b27] transition">Landscapes & Nature</Link></li>
            <li><Link to="/gallery?category=Spiritual %26 Devotional" className="hover:text-[#c59b27] transition">Spiritual & Devotional</Link></li>
            <li><Link to="/gallery?category=Figurative %26 Portrait" className="hover:text-[#c59b27] transition">Figurative & Regal</Link></li>
            <li><Link to="/gallery?category=Modern %26 Contemporary" className="hover:text-[#c59b27] transition">Modern Contemporary</Link></li>
            <li><Link to="/gallery?category=Traditional %26 Folk Art" className="hover:text-[#c59b27] transition">Folk & Madhubani</Link></li>
          </ul>
        </div>

        {/* Mediums */}
        <div className="space-y-3">
          <h5 className="font-serif text-white font-medium tracking-wider text-sm uppercase">Art Mediums</h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link to="/gallery?medium=Oil" className="hover:text-[#c59b27] transition">Oil on Canvas</Link></li>
            <li><Link to="/gallery?medium=Acrylic" className="hover:text-[#c59b27] transition">Acrylic on Linen</Link></li>
            <li><Link to="/gallery?medium=Watercolor" className="hover:text-[#c59b27] transition">Watercolor on Cotton</Link></li>
            <li><Link to="/gallery?medium=Mixed Media" className="hover:text-[#c59b27] transition">Mixed Media & Gold Leaf</Link></li>
            <li><Link to="/gallery?orientation=horizontal" className="hover:text-[#c59b27] transition">Over-Sofa Horizontal Art</Link></li>
            <li><Link to="/gallery?orientation=vertical" className="hover:text-[#c59b27] transition">Tall Foyer Art</Link></li>
          </ul>
        </div>

        {/* Collector Services */}
        <div className="space-y-3">
          <h5 className="font-serif text-white font-medium tracking-wider text-sm uppercase">Collector Services</h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link to="/gallery" className="hover:text-[#c59b27] transition">Interactive Room Simulator</Link></li>
            <li><Link to="/my-orders" className="hover:text-[#c59b27] transition">Certificate Verification</Link></li>
            <li><Link to="/my-orders" className="hover:text-[#c59b27] transition">Track Insured Delivery</Link></li>
            <li><Link to="/admin" className="hover:text-[#c59b27] transition">Curator Admin Portal</Link></li>
            <li><span className="text-zinc-500">Custom Framing Workshop</span></li>
            <li><span className="text-zinc-500">Corporate & Hotel Art Advisory</span></li>
          </ul>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-[#2a2624] flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
        <p>&copy; {new Date().getFullYear()} Gallerist Art Gallery India. All Rights Reserved.</p>
        <p className="flex items-center gap-4">
          <span>Terms of Sale</span>
          <span>&bull;</span>
          <span>Authenticity Guarantee</span>
          <span>&bull;</span>
          <span>Privacy Policy</span>
        </p>
      </div>
    </footer>
  );
}
