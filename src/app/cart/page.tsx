'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} from '@/redux/cartSlice'; 

import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Tag 
} from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartData = useSelector((state: RootState) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Fallbacks if cart state structure slightly differs
  const cartItems = cartData?.cartItems || [];
  
  // Calculate Totals
  const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 150 || cartItems.length === 0 ? 0 : 25; // Free shipping above $150
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toLowerCase() === 'garage10') {
      setDiscount(subtotal * 0.10); // 10% discount
    } else {
      alert('Invalid Promo Code. Try "GARAGE10"');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>

          {cartItems.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 underline transition-colors"
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart View */
          <div className="flex flex-col items-center justify-center text-center mt-6">
            
            {/* Centered Heading above Card */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Your Cart
              </h1>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                0 Parts
              </span>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-gray-100 max-w-xl w-full mx-auto"
            >
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Garage Cart is Empty</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                Looks like you haven't added any auto parts or tuning accessories to your cart yet.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all transform hover:-translate-y-0.5"
              >
                Explore Auto Parts
              </Link>
            </motion.div>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="space-y-6">
            
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Your Cart
              </h1>
              <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {cartItems.length} {cartItems.length === 1 ? 'Part' : 'Parts'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Products Table */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  
                  {/* Table Header Bar */}
                  <div className="hidden sm:grid grid-cols-12 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-xs uppercase tracking-wider py-4 px-6">
                    <div className="col-span-6">Product & Details</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  {/* Product Rows */}
                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {cartItems.map((item: any) => (
                        <motion.div
                          key={item._id || item.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                        >
                          {/* 1. Product Info */}
                          <div className="sm:col-span-6 flex items-center gap-4">
                            <button
                              onClick={() => dispatch(removeFromCart(item._id || item.id))}
                              className="text-gray-300 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                              <Image
                                src={item.image || '/placeholder-part.png'}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-800 text-base truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.category || 'Automotive Component'}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                                <ShieldCheck className="w-3 h-3" /> Guaranteed Fit
                              </span>
                            </div>
                          </div>

                          {/* 2. Price */}
                          <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                            <span className="sm:hidden text-xs text-gray-500 font-medium">Price:</span>
                            <span className="font-semibold text-gray-700 text-sm">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </div>

                          {/* 3. Quantity Controls */}
                          <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                            <span className="sm:hidden text-xs text-gray-500 font-medium">Quantity:</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                              <button
                                onClick={() => dispatch(decreaseQuantity(item._id || item.id))}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-9 text-center font-bold text-sm text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(increaseQuantity(item._id || item.id))}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 4. Subtotal */}
                          <div className="sm:col-span-2 flex sm:justify-end items-center justify-between">
                            <span className="sm:hidden text-xs text-gray-500 font-medium">Subtotal:</span>
                            <span className="font-bold text-red-600 text-base">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <form onSubmit={handleApplyCoupon} className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo / Garage Coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>

                  <Link
                    href="/"
                    className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Need more garage parts?
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Fast Ground Express</h4>
                      <p className="text-[11px] text-gray-500">Free on orders over $150</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">100% Tested Fitment</h4>
                      <p className="text-[11px] text-gray-500">OEM Grade standards</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Expert Tech Support</h4>
                      <p className="text-[11px] text-gray-500">Garage guidance ready</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Order Summary
                  </h2>

                  <div className="py-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Parts Subtotal</span>
                      <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-gray-900">
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                        ) : (
                          `$${shippingFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Promo Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-black text-red-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full mt-4 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 transform active:scale-95 text-center"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-center text-[11px] text-gray-400 mt-3">
                    Taxes & final logistics calculated at checkout.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}