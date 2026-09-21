'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram } from 'lucide-react'

// Custom SVG Icons
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.011 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.761.459 3.479 1.33 4.992l-1.412 5.163 5.286-1.386a9.948 9.948 0 004.785 1.215h.004c5.505 0 9.988-4.478 9.988-9.984 0-2.668-1.039-5.176-2.926-7.062A9.923 9.923 0 0012.011 2zm0 18.291h-.003a8.27 8.27 0 01-4.217-1.162l-.302-.18-3.134.821.836-3.056-.197-.314a8.262 8.262 0 01-1.266-4.412c0-4.561 3.711-8.272 8.275-8.272 2.209 0 4.285.86 5.849 2.427a8.23 8.23 0 012.423 5.846c0 4.562-3.712 8.273-8.264 8.273z" />
    </svg>
  )
}

export default function AutopartFooter() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  // 4 Main Columns (Resources excluded as requested)
  const footerColumns = [
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '/about' },
        { label: 'Careers', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Engine Parts', href: '/shop?category=Engine%20Parts' },
        { label: 'Braking System', href: '/shop?category=Braking%20System' },
        { label: 'Suspension & Steering', href: '/shop?category=Suspension%20%26%20Steering' },
        { label: 'Performance Tuning', href: '/shop?category=Exterior%20%26%20Tuning' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use', href: '/terms&conditions' },
        { label: 'Acceptance Policy', href: '#' },
        { label: 'Cookies', href: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'support@autopartshub.com', href: 'mailto:support@autopartshub.com' },
        { label: '+1 (800) 555-0199', href: 'tel:+18005550199' },
        { label: '07000-AUTOPARTS', href: 'tel:07000288672787' },
      ],
    },
  ]

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-12 overflow-hidden font-sans border-t border-slate-900 mt-auto">
      {/* Huge Background Watermark Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none text-slate-900/40 text-[13vw] font-black tracking-tight leading-none whitespace-nowrap z-0">
        AutoPartsHub
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Top Section: App Logo (Slightly Smaller & Redirects to Home) */}
        <motion.div variants={itemVariants} className="pb-8 mb-10 border-b border-slate-800/80">
          <Link href="/" className="inline-block group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-red-500 transition-colors">
              AutoParts<span className="text-red-600">Hub</span>
            </span>
          </Link>
        </motion.div>

        {/* 4 Navigation Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          {footerColumns.map((col, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-4">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-800/80 my-2" />

        {/* Bottom Section: Address, Copyright & Social Icons */}
        <motion.div
          variants={itemVariants}
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Address & Copyright */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs text-slate-400">
              AutoPartsHub HQ, 100 Performance Way, Auto District, USA.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} AutoPartsHub. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/18005550199"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}