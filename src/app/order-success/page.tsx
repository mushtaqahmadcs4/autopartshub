'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, ShoppingBag, ArrowRight, ArrowLeft, PackageCheck } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20 pb-16">
      
      {/* Absolute Top-Left Back Button */}
      <Link
        href="/checkout"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-red-600 font-bold text-xs rounded-xl shadow-sm hover:shadow-md hover:border-red-200 transition-all group z-10"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Checkout</span>
      </Link>

      {/* Main Order Success Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg w-full border border-gray-100 shadow-xl space-y-6"
      >
        
        {/* Animated Checkmark Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.1 
          }}
          className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>

        {/* Heading & Confirmation Message */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order Placed Successfully
          </h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Thank you for shopping with us! Your order has been placed and is being processed. 
            You can track its progress in your{' '}
            <Link 
              href="/my-orders" 
              className="font-bold text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors"
            >
              My Orders
            </Link>{' '}
            section.
          </p>
        </div>

        {/* Quick Tracking Status Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3 text-left">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0 mt-0.5">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Track Your Shipment</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              Check live status updates, delivery estimates, and invoices directly inside{' '}
              <Link href="/my-orders" className="text-red-600 font-semibold hover:underline">
                My Orders
              </Link>.
            </p>
          </div>
        </div>

        {/* Email Notification Card */}
        <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-left">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Confirmation Email Sent</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-snug">
              An order confirmation email with your invoice details will arrive in your inbox shortly.
            </p>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all gap-2 group"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </motion.div>
    </div>
  );
}