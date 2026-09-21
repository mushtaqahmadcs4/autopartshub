'use client';

import mongoose from 'mongoose';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FolderPlus, LogOut, Menu, Package, PlusCircle, Search, ShoppingBag, ShoppingCart, User2, X } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SearchBar from './SearchBar'; // Imported the dynamic search component

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "admin" | "vendor";
  image?: string;
}

function NavBar({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Read Redux Cart State
  const cartData = useSelector((state: RootState) => state.cart);

  const profileDropDown = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
    const handleClickOutSide = (e: MouseEvent) => {
      if (profileDropDown.current && !profileDropDown.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  // Mobile Menu Overlay rendered via React Portal
  const sideBar = openMenu && mounted ? createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-end md:hidden"
        onClick={() => setOpenMenu(false)}
      >
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-[75%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Close Button */}
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xl font-bold text-red-600">Admin Menu</span>
              <button 
                onClick={() => setOpenMenu(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-3">
              <Link 
                href="/admin/add-category" 
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 bg-red-50 text-red-700 font-semibold p-3 rounded-xl hover:bg-red-100 transition-colors"
              >
                <FolderPlus className="w-5 h-5" />
                Add Category
              </Link>

              <Link 
                href="/admin/add-autoparts" 
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 bg-red-50 text-red-700 font-semibold p-3 rounded-xl hover:bg-red-100 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Add Auto Part
              </Link>

              <Link 
                href="/admin/add-product" 
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 bg-red-50 text-red-700 font-semibold p-3 rounded-xl hover:bg-red-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                View Parts
              </Link>

              <Link 
                href="/admin/orders" 
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 bg-red-50 text-red-700 font-semibold p-3 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Package className="w-5 h-5" />
                Orders
              </Link>
            </div>
          </div>

          {/* User Section at Bottom */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image src={user.image} alt='user' fill className='object-cover' />
                ) : (
                  <User2 className='text-gray-700' />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 w-full text-left p-3 bg-gray-100 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <div className='w-[95%] fixed top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl shadow-lg shadow-black/30 flex flex-col z-50 px-4 md:px-8 py-3 transition-all'>
        
        {/* Main Navigation Bar */}
        <div className='flex justify-between items-center w-full h-12'>
          
          {/* 1. Brand Logo */}
          <Link 
            href="/" 
            className='text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform shrink-0'
          >
            AutoPartsHub
          </Link>

          {/* 2. Desktop Navigation Links (Hidden for Admin) */}
          {!isAdmin && (
            <nav className='hidden lg:flex items-center gap-6 text-white font-medium text-sm'>
              <Link href="/" className='hover:text-gray-200 transition-colors'>Home</Link>
              <Link href="/products" className='hover:text-gray-200 transition-colors'>All Products</Link>
              <Link href="/about" className='hover:text-gray-200 transition-colors'>About</Link>
              <Link href="/terms" className='hover:text-gray-200 transition-colors'>Terms & Conditions</Link>
            </nav>
          )}

          {/* 3. Desktop Search Bar Component (Hidden for Admin) */}
          {!isAdmin && (
            <div className='hidden md:block w-1/3 max-w-md'>
              <SearchBar />
            </div>
          )}

          {/* 4. Action Area */}
          <div className='flex items-center gap-2 sm:gap-3'>
            
            {/* Desktop Admin Quick-Links */}
            {isAdmin && (
              <div className='hidden md:flex items-center gap-3'>
                <Link 
                  href="/admin/add-category" 
                  className='flex items-center gap-2 bg-white text-red-700 font-semibold text-xs lg:text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-all shadow-md'
                >
                  <FolderPlus className='w-4 h-4' />
                  Add Category
                </Link>
                <Link 
                  href="/admin/add-autoparts" 
                  className='flex items-center gap-2 bg-white text-red-700 font-semibold text-xs lg:text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-all shadow-md'
                >
                  <PlusCircle className='w-4 h-4' />
                  Add Auto Part
                </Link>
                <Link 
                  href="/admin/add-product" 
                  className='flex items-center gap-2 bg-white text-red-700 font-semibold text-xs lg:text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-all shadow-md'
                >
                  <ShoppingBag className='w-4 h-4' />
                  View Parts
                </Link>
                <Link 
                  href="/admin/orders" 
                  className='flex items-center gap-2 bg-white text-red-700 font-semibold text-xs lg:text-sm px-4 py-2 rounded-full hover:bg-red-50 transition-all shadow-md'
                >
                  <Package className='w-4 h-4' />
                  Orders
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Icon for Admin */}
            {isAdmin && (
              <button 
                onClick={() => setOpenMenu(true)}
                className='md:hidden bg-white text-red-600 rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:scale-105 transition-transform'
              >
                <Menu className='w-5 h-5' />
              </button>
            )}

            {/* Mobile Search & Cart (Hidden for Admin) */}
            {!isAdmin && (
              <>
                <button 
                  onClick={() => setShowSearch((prev) => !prev)}
                  className='md:hidden bg-white text-red-600 rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:scale-105 transition-transform'
                >
                  <Search className='w-5 h-5' />
                </button>

                <Link 
                  id="cart-icon"
                  href="/cart" 
                  className='relative flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-full transition-all cursor-pointer'
                >
                  <ShoppingCart className='w-5 h-5' />
                  <span className='font-semibold text-sm hidden sm:inline'>Cart</span>
                  <motion.span 
                    key={cartData?.totalQuantity || 0}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className='bg-white text-red-600 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center shadow-sm'
                  >
                    {cartData?.totalQuantity || 0}
                  </motion.span>
                </Link>
              </>
            )}

            {/* Profile Avatar Button */}
            <div className='relative' ref={profileDropDown}>
              <div 
                className='relative bg-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer'
                onClick={() => setOpen((prev) => !prev)}
              >
                {user?.image ? (
                  <Image src={user.image} alt='user' fill className='object-cover rounded-full' />
                ) : (
                  <User2 className='text-gray-700' />
                )}
              </div>

              {/* Profile Dropdown Card */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className='absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50'
                  >
                    <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-100'>
                      <div className='relative w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden shrink-0'>
                        {user?.image ? (
                          <Image src={user.image} alt='user' fill className='object-cover rounded-full' />
                        ) : (
                          <User2 className='text-gray-700' />
                        )}
                      </div>
                      <div>
                        <div className='text-gray-800 font-semibold text-sm truncate max-w-[120px]'>{user?.name}</div>
                        <div className='text-xs text-gray-500 capitalize'>{user?.role}</div>
                      </div>
                    </div>

                    {!isAdmin && (
                      <Link href='/my-orders' className='flex items-center gap-2 px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium transition-colors' onClick={() => setOpen(false)}>
                        <Package className='w-5 h-5 text-red-600'/>
                        My Orders
                      </Link>
                    )}

                    <button 
                      className='flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium transition-colors' 
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      <LogOut className='w-5 h-5 text-red-600'/>
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Mobile Search Dropdown (Hidden for Admin) */}
        {!isAdmin && (
          <AnimatePresence>
            {showSearch && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='md:hidden overflow-hidden mt-3 pt-2 border-t border-white/20'
              >
                <div className='relative flex items-center w-full'>
                  <SearchBar />
                  <button 
                    type='button' 
                    onClick={() => setShowSearch(false)}
                    className='shrink-0 ml-2 p-1 text-white hover:text-gray-200 focus:outline-none'
                  >
                    <X className='w-5 h-5'/>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>

      {/* Render Mobile Sidebar Portal */}
      {sideBar}
    </>
  );
}

export default NavBar;