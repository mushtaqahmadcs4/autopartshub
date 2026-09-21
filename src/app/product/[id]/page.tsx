'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ShoppingBag, Check, Plus, Minus } from 'lucide-react';

interface IProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  brand?: string;
  category?: string[];
  partNumber?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        let res = await fetch(`/api/product/${productId}`);
        if (!res.ok) {
          res = await fetch(`/api/products/${productId}`);
        }

        if (!res.ok) {
          throw new Error(`Failed to load product details (Status: ${res.status})`);
        }

        const data = await res.json();
        setProduct(data.product || data);
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Something went wrong while fetching product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    // Retrieve existing cart items from LocalStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item._id === product._id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        quantity: quantity,
      });
    }

    // Save back to LocalStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Dispatch custom event to notify Navbar/Cart icon badge
    window.dispatchEvent(new Event('cart-updated'));

    // Visual feedback button state
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-sm font-medium text-gray-400">Loading part details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold mb-2">Part Not Found</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          {error || "We couldn't locate the requested auto part."}
        </p>
        <a
          href="/"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-sm transition-colors"
        >
          Return to Catalog
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-xl">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-bold text-sm">NO IMAGE AVAILABLE</span>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col gap-4">
          {product.brand && (
            <span className="text-xs uppercase tracking-wider text-red-500 font-bold">
              {product.brand}
            </span>
          )}
          <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>

          <div className="text-3xl font-black text-red-500">
            ${Number(product.price).toFixed(2)}
          </div>

          {product.partNumber && (
            <div className="text-xs text-gray-400">
              Part SKU: <span className="text-gray-200 font-mono">{product.partNumber}</span>
            </div>
          )}

          <p className="text-gray-300 text-sm leading-relaxed mt-2">
            {product.description || 'High-performance automotive component tested for quality and precise fitment.'}
          </p>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Quantity:
            </span>
            <div className="flex items-center border border-gray-700 bg-gray-900 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 font-bold rounded-full text-white flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}