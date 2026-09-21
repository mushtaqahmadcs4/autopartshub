'use client'
import { AnimatePresence, scale } from 'framer-motion'
import { Wrench , ShieldCheck , Car, ShoppingBasket } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import Image from 'next/image'

function HeroSection() {
    const slides=[
        {
      id: 1,
      icon: <Wrench className="w-20 h-20 sm:w-28 sm:h-28 text-red-500 drop-shadow-lg" />,
      title: "Premium Auto Parts & Accessories ⚡",
      subtitle: "High-performance engines, brake kits, and visual upgrades for your ride.",
      btnText: "Shop Parts Now",
      bg:"https://i.pinimg.com/736x/88/55/8c/88558c1c940a62e387ed13712834357b.jpg"
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-20 h-20 sm:w-28 sm:h-28 text-amber-400 drop-shadow-lg" />,
      title: "OEM Quality Guaranteed 🛡️",
      subtitle: "100% genuine replacement parts backed by top automotive brand warranties.",
      btnText: "Explore Brands",
      bg:"https://i.pinimg.com/736x/85/71/f3/8571f3518765d508ab55e6e1d7a2088c.jpg"
    },
    {
      id: 3,
      icon: <Car className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />,
      title: "Fast Shipping & Garage Delivery 🚚",
      subtitle: "Get performance parts delivered directly to your workshop or home in no time.",
      btnText: "Order Now",
      bg:"https://i.pinimg.com/736x/52/30/9c/52309c33a28864f012def7a6e0fd2514.jpg"
    }
   ]
   const [currentSlide,SetCurrentSlide]=useState(0)
useEffect(()=>{
const timer=setInterval(()=>{
SetCurrentSlide((prev)=>(prev+1)%(slides.length))

    },4000)
    return ()=> clearInterval(timer)
},[])
  return (
    <div className='relative w-[98%] mx-auto mt-32 h-[88vh] rounded-3xl overflow-hidden shadow-2xl'>
        <AnimatePresence mode='wait'>
            <motion.div
            key={slides[currentSlide].id}
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.8}}
            exit={{opacity:0}} className='absolute inset-0'>
              <Image
                src={slides[currentSlide].bg}
                fill
                alt='slide'
                priority
                className='object-cover'
              />
    <div className='absolute inset-0 bg-black/50 backdrop-blur[1px]'/>
            </motion.div>
        </AnimatePresence>
    <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
        <motion.div
        initial={{y:30,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8}}
        className='flex flex-col items-center justify-center gap-6 max-w-3xl'>
        <div className='bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg'>{slides[currentSlide].icon}</div>
        <h1 className='text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg'>{slides[currentSlide].title}</h1>
        <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>{slides[currentSlide].subtitle}</p>
        <motion.button
        whileHover={{scale:1.09 }}
        whileTap={{scale:0.96}}
        transition={{duration:0.2}}
         className='mt-4 bg-white text-red-700 hover:bg-red-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'>
            <ShoppingBasket className='w-5 h-5'/>
            {slides[currentSlide].btnText}
        </motion.button>

        </motion.div>

    </div>
    <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
    {slides.map((_,index)=>(
        <button
        key={index}
        className={`w-3 h-3 rounded-full transition-all ${
            index===currentSlide?"bg-white w-6 ": "bg-white/50"
        }`}/>
    ))}

    </div>
    </div>
  )
}

export default HeroSection