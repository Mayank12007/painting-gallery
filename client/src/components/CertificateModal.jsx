import React from 'react';
import { X, Printer, ShieldCheck, Award } from 'lucide-react';

export default function CertificateModal({ painting, isOpen, onClose }) {
  if (!isOpen || !painting) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#fcfaf7] text-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-[#ded8cb] overflow-hidden">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#24211e] text-white print:hidden">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Award size={18} className="text-[#c59b27]" />
            <span>Official Certificate of Authenticity</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-[#b59677] hover:bg-[#967756] text-white px-3 py-1.5 rounded transition"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Body (Styled for Luxury Paper feel & Print) */}
        <div className="p-8 sm:p-12 certificate-border m-4 sm:m-6 bg-white relative">
          {/* Subtle Watermark Seal in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck size={320} />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-[#c5b49f]/40">
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.25em] text-[#1c1917] block">
              GALLERIST
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#8c6d48] font-semibold block mt-1">
              National Fine Art Registry &bull; Bengaluru, India
            </span>
            <h2 className="font-serif text-xl sm:text-2xl italic text-[#4a3f35] mt-4 font-normal">
              Certificate of Authenticity
            </h2>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1">
              Registry Serial No: <span className="font-mono font-bold text-zinc-800">{painting.coaNumber || 'GLR-2024-8841'}</span>
            </p>
          </div>

          {/* Certificate Verification Text */}
          <div className="py-6 text-center space-y-4">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto italic font-serif">
              "This document officially certifies that the artwork detailed below is an authentic, original, hand-painted creation by the documented master artist, verified under the rigorous quality standards of the Gallerist Curatorial Board."
            </p>

            {/* Artwork Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#f0ece5] text-left">
              <div className="sm:col-span-1 flex justify-center sm:justify-start">
                <img
                  src={painting.image}
                  alt={painting.title}
                  className="w-28 h-36 object-cover border-2 border-[#b59677] shadow-md rounded-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-zinc-400 uppercase text-[10px] block font-mono">Artwork Title</span>
                  <span className="font-serif text-base font-bold text-zinc-900">{painting.title}</span>
                </div>
                <div>
                  <span className="text-zinc-400 uppercase text-[10px] block font-mono">Artist Name</span>
                  <span className="font-semibold text-zinc-800">{painting.artist}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Medium</span>
                    <span className="text-zinc-700">{painting.medium}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Dimensions</span>
                    <span className="text-zinc-700">{painting.dimensions}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Year Created</span>
                    <span className="text-zinc-700">{painting.year || 2024}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase text-[10px] block font-mono">Edition</span>
                    <span className="text-zinc-700 font-medium">Original 1 of 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-[#c5b49f]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
            <div>
              <div className="font-serif italic text-base text-[#8c6d48] font-bold">
                {painting.artist}
              </div>
              <div className="w-32 h-[1px] bg-zinc-400 mx-auto my-1"></div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Artist's Signature
              </span>
            </div>

            {/* Official Wax / Gold Seal */}
            <div className="w-16 h-16 rounded-full border-2 border-[#b59677] bg-[#f9f5ed] flex flex-col items-center justify-center p-1 text-[#8b5e34] shadow-inner">
              <Award size={22} />
              <span className="text-[7px] uppercase font-bold tracking-tighter mt-0.5">VERIFIED</span>
            </div>

            <div>
              <div className="font-serif italic text-base text-zinc-800 font-bold">
                Devina Rao
              </div>
              <div className="w-32 h-[1px] bg-zinc-400 mx-auto my-1"></div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Chief Gallery Curator
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
