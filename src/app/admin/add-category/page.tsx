'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, FolderPlus, Loader2, Disc, Wrench, Zap, Fuel, 
  Car, Laptop, Tv, Smartphone, Cpu, ShoppingBag 
} from 'lucide-react';

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('brake')) return <Disc className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('engine')) return <Wrench className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('electric') || lower.includes('battery')) return <Zap className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('oil') || lower.includes('fluid')) return <Fuel className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('body') || lower.includes('car')) return <Car className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('laptop')) return <Laptop className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('tv') || lower.includes('display')) return <Tv className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('phone') || lower.includes('mobile')) return <Smartphone className="w-8 h-8 text-cyan-600" />;
  if (lower.includes('electronic') || lower.includes('gadget')) return <Cpu className="w-8 h-8 text-cyan-600" />;
  return <ShoppingBag className="w-8 h-8 text-cyan-600" />;
};

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'MAJOR' | 'MINOR'>('MAJOR');
  const [placeBeforeDefault, setPlaceBeforeDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          slug,
          level,
          placeBeforeDefault 
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned a non-JSON response. Please check server logs.");
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add category');
      }

      setMessage({ type: 'success', text: 'Category added successfully!' });
      setName('');
      setLevel('MAJOR');
      setPlaceBeforeDefault(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col justify-center items-center font-sans">
      
      <div className="w-full max-w-lg mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
        
        <div className="flex flex-col items-center text-center mb-6 pb-2">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl mb-2">
            <FolderPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
          <p className="text-xs text-gray-500 mt-1">Create categories and levels for auto parts</p>
        </div>

        {/* Success / Error Notification Flag matching Auto Part design */}
        {message && (
          <div 
            className={`p-4 text-sm rounded-2xl mb-6 font-medium transition-all ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/60' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category Name *
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engine, Brakes, Suspension" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Auto-Assigned Category Logo
            </label>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
                {getCategoryIcon(name)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {name.trim() ? name : 'Category Preview'}
                </p>
                <p className="text-xs text-gray-500">
                  {name.trim() 
                    ? `Matched Logo: ${name.toLowerCase().includes('engine') ? 'Wrench' : 'Category Icon'}`
                    : 'Type a name above to preview logo'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category Level *
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as 'MAJOR' | 'MINOR')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all bg-white text-gray-800"
            >
              <option value="MAJOR">Major Category (Level 1)</option>
              <option value="MINOR">Minor Category (Level 2)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Placement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlaceBeforeDefault(true)}
                className={`px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  placeBeforeDefault
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Place BEFORE Banners
              </button>
              <button
                type="button"
                onClick={() => setPlaceBeforeDefault(false)}
                className={`px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  !placeBeforeDefault
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Place AFTER Banners
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-5 h-5" />
                <span>Add Category</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}