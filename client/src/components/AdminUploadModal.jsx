import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  IndianRupee,
  Layers,
  FileText,
  User,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Abstract',
  'Landscape & Scenery',
  'Spiritual & Devotional',
  'Figurative & Portrait',
  'Modern & Contemporary',
  'Traditional & Folk Art',
  'Still Life & Botanical'
];

const MEDIUMS = [
  'Oil on Fine Belgian Linen',
  'Acrylic on Stretched Canvas',
  'Mixed Media & 24K Gold Leaf',
  'Watercolor on 100% Cotton Rag',
  'Palette Knife Heavy Impasto',
  'Natural Mineral Pigments & Gouache'
];

export default function AdminUploadModal({ isOpen, onClose, onArtworkAdded }) {
  const { token, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [artistBio, setArtistBio] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [medium, setMedium] = useState(MEDIUMS[0]);
  const [style, setStyle] = useState('Contemporary Fine Art');
  const [orientation, setOrientation] = useState('vertical');
  const [dimensions, setDimensions] = useState('36" x 48" (91.4 x 121.9 cm)');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [stockQuantity, setStockQuantity] = useState(1);

  // Image mode: 'file' or 'url'
  const [imageMode, setImageMode] = useState('file');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={28} />
          </div>
          <h3 className="font-serif text-lg font-bold text-zinc-900">Admin Permission Required</h3>
          <p className="text-xs text-zinc-600">
            Only verified Gallery Administrators are authorized to upload artworks. Regular customers are only permitted to browse and purchase paintings.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-zinc-900 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-black transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('artistBio', artistBio);
      formData.append('category', category);
      formData.append('medium', medium);
      formData.append('style', style);
      formData.append('orientation', orientation);
      formData.append('dimensions', dimensions);
      formData.append('year', year);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice || price);
      formData.append('description', description);
      formData.append('featured', featured);
      formData.append('stockQuantity', stockQuantity);

      if (imageMode === 'file' && imageFile) {
        formData.append('imageFile', imageFile);
      } else if (imageMode === 'url' && imageUrl) {
        formData.append('imageUrl', imageUrl);
      } else {
        throw new Error('Please select an artwork image file or provide an image link');
      }

      const res = await fetch('/api/paintings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload artwork');
      }

      setSuccess(true);
      if (onArtworkAdded) onArtworkAdded(data);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setTitle('');
        setArtist('');
        setArtistBio('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setImageFile(null);
        setImageUrl('');
        setPreviewUrl('');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#ded8cb] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1f1d1b] text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#b59677]/20 text-[#c59b27]">
              <Upload size={18} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-wide">
                Admin Portal: Upload New Painting
              </h3>
              <p className="text-xs text-zinc-400">
                Curator artwork registry &bull; Authenticity Certificate auto-generated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 font-medium">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Artwork successfully cataloged and published to the Gallerist storefront!</span>
            </div>
          )}

          {/* Image Upload Area */}
          <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#ded8cb]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                <ImageIcon size={15} className="text-[#8b5e34]" /> Artwork Photography (High Resolution)
              </label>
              <div className="flex text-xs bg-white rounded-lg p-0.5 border border-[#ded8cb]">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-3 py-1 rounded-md transition ${
                    imageMode === 'file' ? 'bg-[#8b5e34] text-white font-medium' : 'text-zinc-600'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-md transition ${
                    imageMode === 'url' ? 'bg-[#8b5e34] text-white font-medium' : 'text-zinc-600'
                  }`}
                >
                  Image Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                {imageMode === 'file' ? (
                  <div className="border-2 border-dashed border-[#c5b49f] hover:border-[#8b5e34] rounded-xl p-6 text-center bg-white transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload size={32} className="mx-auto text-[#b59677] mb-2" />
                    <p className="text-xs font-semibold text-zinc-800">
                      {imageFile ? imageFile.name : 'Click or drag & drop high-resolution artwork photo'}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      JPEG, PNG, WEBP up to 25MB (Minimum 1200x1200px recommended)
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/painting.jpg"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="w-full bg-white border border-[#ded8cb] text-sm rounded-lg p-3 outline-none focus:border-[#b59677]"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Paste a direct image link from an art archive or Unsplash
                    </p>
                  </div>
                )}
              </div>

              {/* Preview Window */}
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-[#b59677] shadow-md w-36 h-44 bg-zinc-100">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  </div>
                ) : (
                  <div className="w-36 h-44 rounded-lg border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 bg-white">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">No Image Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artwork Info Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Painting Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Celestial Flute of Eternity"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Artist Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Devendra Joshi"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Medium / Technique *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acrylic & 24K Gold Leaf on Linen"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Dimensions (Inches & cm) *
              </label>
              <input
                type="text"
                required
                placeholder='e.g. 36" x 48" (91.4 x 121.9 cm)'
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
              >
                <option value="vertical">Vertical / Portrait (Tall)</option>
                <option value="horizontal">Horizontal / Landscape (Wide)</option>
                <option value="square">Square</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Selling Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="500"
                  placeholder="45000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-8 pr-3 py-2.5 outline-none focus:border-[#b59677]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Original Price / MRP (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                <input
                  type="number"
                  min="500"
                  placeholder="60000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-8 pr-3 py-2.5 outline-none focus:border-[#b59677]"
                />
              </div>
            </div>
          </div>

          {/* Description & Curatorial Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Curatorial Description & Art Concept
            </label>
            <textarea
              rows={3}
              placeholder="Detail the thematic concept, artistic technique, brushwork nuances, and texture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-3 outline-none focus:border-[#b59677]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Artist Biography
            </label>
            <input
              type="text"
              placeholder="e.g. Master painter hailing from Rajasthan, renowned for royal miniature traditions..."
              value={artistBio}
              onChange={(e) => setArtistBio(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg p-2.5 outline-none focus:border-[#b59677]"
            />
          </div>

          {/* Feature and Stock toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#8b5e34] rounded focus:ring-[#8b5e34]"
              />
              <span>Feature on Gallery Homepage (Curator's Spotlight)</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8b5e34] hover:bg-[#724a25] text-white text-xs font-semibold py-2.5 px-6 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              <Upload size={15} />
              <span>{loading ? 'Publishing Artwork...' : 'Publish to Gallery Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
