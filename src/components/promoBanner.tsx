'use client'

import React from 'react'
import Link from 'next/link'
import { Wrench, Laptop } from 'lucide-react'

export default function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* High Performance Engine Card */}
        <div className="bg-gradient-to-br from-cyan-50/60 to-white border border-cyan-100 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-snug">
              High Performance<br />Engine & Auto Parts
            </h2>
            <p className="text-xs font-semibold text-orange-500 mt-2">From $99.00</p>
            <Link 
              href="/products?category=Engine" 
              className="inline-block mt-4 text-xs font-bold text-cyan-600 hover:text-cyan-700 uppercase tracking-wider transition-colors"
            >
              &rarr; SHOP NOW
            </Link>
          </div>
          <div className="w-24 h-24 relative flex items-center justify-center">
            <Wrench className="w-16 h-16 text-cyan-500/40" />
          </div>
        </div>

        {/* MacBook Pro Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-snug">
              MacBook Pro<br />With Smart Phone
            </h2>
            <p className="text-xs font-semibold text-orange-500 mt-2">From $129.00</p>
            <Link 
              href="/products?category=Laptop%20and%20TV" 
              className="inline-block mt-4 text-xs font-bold text-cyan-600 hover:text-cyan-700 uppercase tracking-wider transition-colors"
            >
              &rarr; SHOP NOW
            </Link>
          </div>
          <div className="w-24 h-24 relative flex items-center justify-center">
            <Laptop className="w-16 h-16 text-gray-400/50" />
          </div>
        </div>

      </div>
    </section>
  )
}