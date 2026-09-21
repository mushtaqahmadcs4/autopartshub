'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, Wrench, Award, ArrowRight } from 'lucide-react'

export default function AboutUsPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stats = [
    { value: '10K+', label: 'Genuine Parts' },
    { value: '99.8%', label: 'Order Accuracy' },
    { value: '24/7', label: 'Expert Support' },
    { value: '100%', label: 'Guaranteed Fitment' },
  ]

  const features = [
    {
      icon: ShieldCheck,
      title: 'OEM & Performance Grade',
      description: 'Every part in our inventory is strictly vetted for precision engineering, durability, and high performance.',
    },
    {
      icon: Truck,
      title: 'Express Nationwide Delivery',
      description: 'We know downtime hurts. Our logistically optimized network delivers directly to your garage or workshop in record time.',
    },
    {
      icon: Wrench,
      title: 'Built by Enthusiasts',
      description: 'Our technical support team isn’t just customer service—they are mechanics, tuners, and automotive specialists.',
    },
    {
      icon: Award,
      title: 'Guaranteed Compatibility',
      description: 'Filter parts by make, model, and part number to guarantee 100% accurate fitment before you buy.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.span
          variants={itemVariants}
          className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-600/10 text-red-500 border border-red-600/20 uppercase tracking-widest"
        >
          Driven by Performance
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white"
        >
          Powering Your Drive with <span className="text-red-600">Precision Parts</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          AutoPartsHub was created to eliminate the guesswork from automotive maintenance and performance tuning. From daily replacement components to race-ready upgrades, we bring quality directly to your doorstep.
        </motion.p>
      </motion.div>

      {/* Stats Counter Section */}
      <motion.div
        className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="text-center p-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stat.value}
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Brand Story Section */}
      <motion.div
        className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Our Mission & Commitment
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Finding reliable, exact-fit auto components shouldn't be a gamble. Whether you run a professional auto garage or tackle weekend builds in your driveway, we believe in giving drivers access to transparent pricing, verifiable part numbers, and rapid dispatch.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Every product cataloged in AutoPartsHub undergoes strict verification to ensure compliance with OEM standards, giving you peace of mind with every mile.
          </p>
        </motion.div>

        {/* Story Decorative Graphic */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl bg-gradient-to-br from-red-600/20 via-slate-900 to-slate-900 p-8 border border-slate-800 flex flex-col justify-between h-72 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs font-mono text-red-500 uppercase tracking-widest">
            // Quality Assurance Standard
          </span>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white tracking-tight">
              Tested for Endurance. Engineered for Speed.
            </p>
            <p className="text-xs text-slate-400">
              Backing every brake set, engine part, and suspension link with total confidence.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Core Features Grid */}
      <motion.div
        className="max-w-6xl mx-auto mt-28 space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Choose AutoPartsHub?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            We build our service around what drivers and mechanics value most.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl hover:border-red-600/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* CTA Footer Direct Banner */}
      <motion.div
        className="max-w-5xl mx-auto mt-28 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Ready to Upgrade Your Vehicle?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          Explore our extensive catalog of genuine engine parts, braking systems, fluids, and performance accessories.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium text-xs rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            <span>Explore Parts Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}