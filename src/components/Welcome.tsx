'use client'
import React from 'react'
import { motion } from "framer-motion"
// Importing both mechanical workshop tools from Lucide
import { Wrench, Hammer, ArrowRight } from 'lucide-react'
type propType={
  nextStep:(s:number)=>void
}
function Welcome({nextStep}:propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.8
        }}
        /* flex-col: Stacks the top icon group above the text title
           items-center: Keeps everything centered perfectly on the viewport
           gap-5: Adds a sharp, clean gap between the tools and the brand name below
        */
        className="flex flex-col items-center justify-center gap-5"
      >
        
        {/* Step 1: Side-by-Side Tools directly on top (No rotation) */}
        <div className="flex items-center justify-center gap-4">
          {/* Steel Gray Wrench standing upright */}
          <Wrench className="w-12 h-12 md:w-16 md:h-16 text-black-600" />
          
          {/* Performance Red Hammer standing upright */}
          <Hammer className="w-12 h-12 md:w-16 md:h-16 text-black-600 " />
        </div>

        {/* Step 2: High-contrast Clean Text Title Row */}
        <div className="flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter  drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <span className="text-white">AutoParts</span>
            <span className="text-[#C1040E]">Hub</span>
          </h1>
        </div>

      </motion.div>
      <motion.p
      initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y:0
        }}
        transition={{
          duration: 0.8,
          delay:0.3
        }}
        className='mt-4 text-gray-700 text-lg md:text-xl max-w-lg'>
        Welcome to AutoPartsHub
        Your trusted auto parts seller accross pakistan
      </motion.p>
      <motion.button
       initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y:0
        }}
        transition={{
          duration: 0.8,
          delay:0.6
        }}
        className='mt-12 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200'onClick={()=>nextStep(2)}>
      Next 
      <ArrowRight/>
        </motion.button>
    </div>
  )
}

export default Welcome