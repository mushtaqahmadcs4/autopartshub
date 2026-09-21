'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ISearchProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string[];
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          updatePosition();
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductNavigate = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${productId}`);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              updatePosition();
              setIsOpen(true);
            }
          }}
          placeholder="Search parts by name, brand..."
          className="w-full pl-10 pr-10 py-2 bg-white text-gray-900 placeholder-gray-400 text-sm font-medium rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: `${coords.top + 8}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[99999] max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center p-5 text-gray-500 gap-2 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                <span>Searching catalog...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleProductNavigate(product._id);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-[9px] text-gray-400 font-bold uppercase">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h4>
                      {product.brand && (
                        <p className="text-[11px] text-gray-500 font-medium capitalize">
                          {product.brand}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-red-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearchSubmit();
                  }}
                  className="w-full py-3 bg-gray-50 hover:bg-red-100/60 text-red-600 font-bold text-xs uppercase tracking-wider text-center transition-colors block cursor-pointer"
                >
                  VIEW ALL RESULTS FOR "{query.toUpperCase()}"
                </button>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-gray-500">
                No auto parts found matching "<span className="font-semibold text-gray-700">{query}</span>"
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}