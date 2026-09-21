'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import mongoose from 'mongoose'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  X,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/redux/cartSlice'
import { AppDispatch } from '@/redux/store'
import { useFlyingCart } from '@/components/FlyingCartContext'

export interface IAutoPart {
  _id?: mongoose.Types.ObjectId | string
  name: string
  category: string
  price: string | number
  originalPrice?: string | number
  description?: string
  unit?: string
  image: string
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export default function AutoPartsItemCard({ item }: { item: IAutoPart }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { triggerFlyAnimation } = useFlyingCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Image Gallery Fallback
  const imageList =
    item.images && item.images.length > 0 ? item.images : [item.image]

  const priceNum = Number(item.price)
  const origPriceNum = item.originalPrice ? Number(item.originalPrice) : priceNum * 1.25
  const discountPercent = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)

  // Opens modal without dispatching item to cart
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdded(false)
    setQuantity(1)
    setIsModalOpen(true)
  }

  // Closes modal and resets component UI state
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsAdded(false)
  }

  // Handle direct Buy Now click - Bypass Redux Cart completely
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Prepare single item payload
    const buyNowItem = {
      _id: String(item._id),
      name: item.name,
      category: item.category,
      price: priceNum,
      image: item.image,
      unit: item.unit || 'piece',
      quantity: quantity,
    }

    // Encode item in query params for instant checkout isolation
    const query = new URLSearchParams({
      buyNow: 'true',
      item: JSON.stringify(buyNowItem),
    }).toString()

    handleCloseModal()
    router.push(`/checkout?${query}`)
  }

  return (
    <>
      {/* ITEM CARD ON GRID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: false, margin: '-50px' }}
        whileHover={{ y: -4 }}
        className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100 cursor-pointer"
        onClick={handleOpenModal}
      >
        <div className="relative w-full h-48 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden mb-4 transition-all duration-300 group-hover:bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4 transition-all duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 tracking-wider block mb-0.5 uppercase">
              {item.category}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
              {item.name}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400 font-medium">
              {item.unit || 'piece'}
            </span>
            <span className="text-lg font-extrabold text-red-600">
              ${priceNum.toFixed(2)}
            </span>
          </div>

          {/* Button opens details modal without adding to cart */}
          <button
            onClick={handleOpenModal}
            className="w-full font-semibold text-xs sm:text-sm py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-md border-none cursor-pointer bg-red-600 hover:bg-red-700 active:scale-[0.97] text-white"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </motion.div>

      {/* FULLY ANIMATED LIGHT MODAL POP-UP */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: IMAGES */}
                <div className="md:col-span-6 space-y-3">
                  <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                    <Image
                      src={imageList[selectedImage]}
                      alt={item.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {imageList.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {imageList.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative w-16 h-16 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                            selectedImage === idx
                              ? 'border-red-600 ring-2 ring-red-600/20'
                              : 'border-slate-100 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt="thumb" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: PRODUCT INFO & ACTIONS */}
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                      {item.name}
                    </h2>
                  </div>

                  {/* PRICING & DISCOUNT */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-red-600">
                      ${priceNum.toFixed(2)}
                    </span>
                    {origPriceNum > priceNum && (
                      <>
                        <span className="text-sm text-slate-400 line-through">
                          ${origPriceNum.toFixed(2)}
                        </span>
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                          SAVE ${(origPriceNum - priceNum).toFixed(0)} ({discountPercent}% OFF)
                        </span>
                      </>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description ||
                      'High-performance automotive component designed for precise fitment, maximum reliability, and extended service life.'}
                  </p>

                  {/* FEATURES */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span>OEM Quality</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-red-600" />
                      <span>Fast Shipping</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-red-600" />
                      <span>Easy Returns</span>
                    </div>
                  </div>

                  {/* QUANTITY SELECTOR */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-slate-600 hover:text-slate-900 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-900 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-2 pt-2">
                    {/* Add to Cart button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerFlyAnimation(e, imageList[selectedImage] || item.image)
                        
                        dispatch(
                          addToCart({
                            _id: String(item._id),
                            name: item.name,
                            category: item.category,
                            price: priceNum,
                            image: item.image,
                            unit: item.unit || 'piece',
                            quantity: quantity,
                          })
                        )

                        handleCloseModal()
                      }}
                      className="w-full font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    {/* Buy Now button */}
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}