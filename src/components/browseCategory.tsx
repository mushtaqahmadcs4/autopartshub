'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

const defaultCategories = [
  {
    name: 'Engine Parts',
    offer: 'Get 20% off',
    image: '/categories/engine.jpg',
    slug: 'Engine Parts',
    bgColor: 'bg-red-50 hover:bg-red-100/80 border-red-100',
    accentColor: 'text-red-600',
  },
  {
    name: 'Braking System',
    offer: 'Get 15% off',
    image: '/categories/brakes.jpg',
    slug: 'Braking System',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
    accentColor: 'text-amber-600',
  },
  {
    name: 'Suspension & Steering',
    offer: 'Up to 30% off',
    image: '/categories/steering.jpg',
    slug: 'Suspension & Steering',
    bgColor: 'bg-rose-50 hover:bg-rose-100/80 border-rose-100',
    accentColor: 'text-rose-600',
  },
  {
    name: 'Electrical & Ignition',
    offer: 'Save 25%',
    image: '/categories/electrical.jpg',
    slug: 'Electrical & Ignition',
    bgColor: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100',
    accentColor: 'text-blue-600',
  },
  {
    name: 'Exterior & Tuning',
    offer: 'Sale 10% off',
    image: '/categories/tuning.jpg',
    slug: 'Exterior & Tuning',
    bgColor: 'bg-orange-50 hover:bg-orange-100/80 border-orange-100',
    accentColor: 'text-orange-600',
  },
  {
    name: 'Fluids & Oils',
    offer: 'Best Deals',
    image: '/categories/fluids.jpg',
    slug: 'Fluids & Oils',
    bgColor: 'bg-slate-100 hover:bg-slate-200/70 border-slate-200',
    accentColor: 'text-slate-700',
  },
]

export default function BrowseCategory() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const [allCategories, setAllCategories] = useState(defaultCategories)

  // Fetch dynamic database categories and merge them into slider
  useEffect(() => {
    fetch('/api/category')
      .then((res) => res.json())
      .then((data) => {
        let fetchedArray: any[] = []
        if (data.success && Array.isArray(data.categories)) {
          fetchedArray = data.categories
        } else if (Array.isArray(data.categories)) {
          fetchedArray = data.categories
        } else if (Array.isArray(data)) {
          fetchedArray = data
        }

        if (fetchedArray.length > 0) {
          const dbCategories = fetchedArray.map((c: any) => {
            const categoryName = typeof c === 'string' ? c : c.name
            return {
              name: categoryName,
              offer: 'New Arrival',
              image: typeof c === 'object' && c?.image ? c.image : '',
              slug: categoryName,
              bgColor: 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-100',
              accentColor: 'text-cyan-600',
            }
          })

          // Merge without duplicate names
          const existingNames = new Set(defaultCategories.map((c) => c.name.toLowerCase()))
          const filteredDbCategories = dbCategories.filter(
            (c) => c.name && !existingNames.has(c.name.toLowerCase())
          )

          setAllCategories([...defaultCategories, ...filteredDbCategories])
        }
      })
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    return () => el.removeEventListener('scroll', checkScroll)
  }, [allCategories])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans relative group"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Browse by Categories
        </h2>
        <Link
          href="/shop"
          className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-red-600 hover:text-white text-gray-800 shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all -ml-3 sm:-ml-5 border border-gray-100"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allCategories.map((cat, index) => (
            <motion.div
              key={`${cat.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="min-w-[200px] sm:min-w-[220px] flex-shrink-0"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className={`group relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md ${cat.bgColor} h-full block`}
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-normal">{cat.offer}</p>
                  <div className={`pt-1 flex items-center gap-1 text-[11px] font-semibold ${cat.accentColor}`}>
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="relative w-full h-28 mt-4 flex items-center justify-center">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="220px"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-cyan-600/50" />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-red-600 hover:text-white text-gray-800 shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all -mr-3 sm:-mr-5 border border-gray-100"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.section>
  )
}