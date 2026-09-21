'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AnimationItem {
  id: string;
  imgUrl: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyingCartContextType {
  triggerFlyAnimation: (e: React.MouseEvent<HTMLElement>, imgUrl?: string) => void;
}

const FlyingCartContext = createContext<FlyingCartContextType | undefined>(undefined);

export const FlyingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [animations, setAnimations] = useState<AnimationItem[]>([]);

  const triggerFlyAnimation = (e: React.MouseEvent<HTMLElement>, imgUrl?: string) => {
    const cartElement = document.getElementById('cart-icon');
    if (!cartElement) return;

    const cartRect = cartElement.getBoundingClientRect();
    const buttonRect = e.currentTarget.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const animId = `${Date.now()}-${Math.random()}`;

    setAnimations((prev) => [
      ...prev,
      {
        id: animId,
        imgUrl: imgUrl && imgUrl.trim() !== '' ? imgUrl : '/placeholder.png',
        startX,
        startY,
        endX,
        endY,
      },
    ]);
  };

  const removeAnimation = (id: string) => {
    setAnimations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FlyingCartContext.Provider value={{ triggerFlyAnimation }}>
      {children}
      {/* Global Canvas Overlay for Flying Elements */}
      <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
        <AnimatePresence>
          {animations.map((anim) => (
            <motion.div
              key={anim.id}
              initial={{
                x: anim.startX - 32,
                y: anim.startY - 32,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: [anim.startX - 32, (anim.startX + anim.endX) / 2, anim.endX - 16],
                y: [anim.startY - 32, Math.min(anim.startY, anim.endY) - 150, anim.endY - 16],
                scale: [1, 0.9, 0.3],
                opacity: [1, 1, 0.2],
              }}
              transition={{
                /* Set to 8 seconds so you can pause or inspect it easily in DevTools */
                duration: 4,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => removeAnimation(anim.id)}
              className="absolute w-16 h-16 rounded-2xl border-2 border-red-600 bg-white shadow-2xl overflow-hidden flex items-center justify-center p-1"
            >
              <div className="relative w-full h-full">
                <img
                  src={anim.imgUrl}
                  alt="flying-item"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if path resolution fails
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FlyingCartContext.Provider>
  );
};

export const useFlyingCart = () => {
  const context = useContext(FlyingCartContext);
  if (!context) {
    throw new Error('useFlyingCart must be used within a FlyingCartProvider');
  }
  return context;
};