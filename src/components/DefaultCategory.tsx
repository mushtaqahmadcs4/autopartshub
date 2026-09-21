'use client'

import React from 'react'
import Link from 'next/link'
import {
  Disc,
  Wrench,
  Zap,
  Fuel,
  Car,
  Laptop,
  Tv,
  Smartphone,
  Cpu,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'
import AutoPartsItemCard from './AutoPartsItemCard'

interface ICategory {
  _id: string
  name: string
  placeBeforeDefault: boolean
}

interface DefaultCategoryProps {
  autoParts?: any[]
  beforeCategories?: ICategory[]
  afterCategories?: ICategory[]
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase()

  if (lower.includes('brake')) {
    return <Disc className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('engine')) {
    return <Wrench className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('electric') || lower.includes('battery')) {
    return <Zap className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('oil') || lower.includes('fluid')) {
    return <Fuel className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('body') || lower.includes('car')) {
    return <Car className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('laptop')) {
    return <Laptop className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('tv') || lower.includes('display')) {
    return <Tv className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('phone') || lower.includes('mobile')) {
    return <Smartphone className="w-6 h-6 text-red-600" />
  }

  if (lower.includes('electronic') || lower.includes('gadget')) {
    return <Cpu className="w-6 h-6 text-red-600" />
  }

  return <ShoppingBag className="w-6 h-6 text-red-600" />
}

export default function DefaultCategory({
  autoParts = [],
  beforeCategories = [],
  afterCategories = []
}: DefaultCategoryProps) {

  const getProductsForCategory = (catName: string) => {
    const target = catName.trim().toLowerCase()

    return autoParts.filter((item: any) => {
      if (!item.category) return false

      const cats = Array.isArray(item.category)
        ? item.category
        : [item.category]

      return cats.some(
        (c: string) => c.trim().toLowerCase() === target
      )
    })
  }

  const renderCategoryBlock = (cat: ICategory) => {
    const categoryProducts = getProductsForCategory(cat.name)

    return (
      <div key={cat._id} className="mb-12">

        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center shadow-sm">
              {getCategoryIcon(cat.name)}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {cat.name}
            </h2>

          </div>

          <Link
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            View All

            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

        {categoryProducts.length === 0 ? (

          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center text-xs text-gray-400 shadow-sm">
            No products found in this category yet.
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {categoryProducts.map((item: any) => (
              <AutoPartsItemCard
                key={item._id}
                item={item}
              />
            ))}

          </div>

        )}

      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">

      {/* 1. Categories marked to display BEFORE the promo banners */}
      {beforeCategories.map(renderCategoryBlock)}

      {/* 2. Static Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

        <div className="bg-gradient-to-br from-cyan-50/60 to-white border border-cyan-100 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">

          <div>

            <h2 className="text-xl font-bold text-gray-800 leading-snug">
              High Performance<br />
              Engine & Auto Parts
            </h2>

            <p className="text-xs font-semibold text-orange-500 mt-2">
              From $99.00
            </p>

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

        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">

          <div>

            <h2 className="text-xl font-bold text-gray-800 leading-snug">
              MacBook Pro<br />
              With Smart Phone
            </h2>

            <p className="text-xs font-semibold text-orange-500 mt-2">
              From $129.00
            </p>

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

      {/* 3. Categories marked to display AFTER the promo banners */}
      {afterCategories.map(renderCategoryBlock)}

    </section>
  )
}