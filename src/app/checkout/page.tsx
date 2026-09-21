'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '@/redux/store'
import { clearCart } from '@/redux/cartSlice'

import easypaisaLogo from '@/assets/easypisa.jpg'
import jazzcashLogo from '@/assets/jazzcash.jpg'

import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  User, 
  Phone, 
  Building, 
  Hash,
  Banknote,
  Building2,
  Copy,
  CheckCircle2,
  Zap
} from 'lucide-react'

function CheckoutContent() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  // Read URL query parameters for direct "Buy Now" flow
  const isBuyNow = searchParams.get('buyNow') === 'true'
  const buyNowParam = searchParams.get('item')

  // Parse direct Buy Now item if available
  let buyNowItem: any = null
  if (isBuyNow && buyNowParam) {
    try {
      buyNowItem = JSON.parse(buyNowParam)
    } catch (err) {
      console.error('Error parsing Buy Now query item:', err)
    }
  }

  // Redux Cart items fallback
  const storeCartItems = useSelector((state: RootState) => state.cart?.cartItems || [])

  // Use single Buy Now item if present, otherwise fallback to Redux store
  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : storeCartItems

  // Order calculation logic
  const subtotal = checkoutItems.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0)
  const shippingFee = subtotal > 150 || checkoutItems.length === 0 ? 0 : 25
  const grandTotal = subtotal + shippingFee

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
    walletPhone: '',
    transactionId: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const isShippingValid = 
    formData.fullName.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.zipCode.trim() !== ''

  const isPaymentValid = () => {
    const method = formData.paymentMethod

    if (method === 'cod') return true

    if (method === 'easypaisa' || method === 'jazzcash') {
      return (
        formData.walletPhone.trim().length >= 10 && 
        formData.transactionId.trim().length >= 4
      )
    }

    if (method === 'bank') {
      return formData.transactionId.trim().length >= 4
    }

    if (method === 'card') {
      return (
        formData.cardNumber.trim().length >= 12 &&
        formData.cardExp.trim().length >= 4 &&
        formData.cardCvc.trim().length >= 3
      )
    }

    return false
  }

  const isFormValid = isShippingValid && isPaymentValid() && checkoutItems.length > 0

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      const isOnlinePayment = ['easypaisa', 'jazzcash', 'bank', 'card'].includes(formData.paymentMethod)

      const orderPayload = {
        items: checkoutItems.map((item: any) => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        paymentMethod: formData.paymentMethod,
        isPaid: isOnlinePayment,
        paidAt: isOnlinePayment ? new Date().toISOString() : null,
        paymentDetails: {
          walletPhone: formData.walletPhone,
          transactionId: formData.transactionId,
          cardNumber: formData.cardNumber ? `**** **** **** ${formData.cardNumber.slice(-4)}` : undefined
        }
      }

      const res = await fetch('/api/user/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Clear global cart only if user checked out using the cart flow
        if (!isBuyNow) {
          dispatch(clearCart())
        }
        router.push('/order-success')
      } else {
        alert(data.message || 'Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('An unexpected error occurred. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href={isBuyNow ? '/autoparts' : '/cart'} 
            className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {isBuyNow ? 'Back to Shop' : 'Back to Cart'}
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Secure Checkout
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping Details Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                  <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Street Address *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="House #123, Street 4, Block B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">City *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Lahore"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Postal / Zip Code *</label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="zipCode"
                        required
                        placeholder="54000"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                  <p className="text-xs text-gray-500">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash On Delivery */}
                <div 
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod' ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                    <Banknote className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-sm text-gray-800">Cash on Delivery (COD)</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Pay when delivered</span>
                </div>

                {/* EasyPaisa */}
                <div 
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'easypaisa' }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'easypaisa' ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMethod" value="easypaisa" checked={formData.paymentMethod === 'easypaisa'} onChange={handleInputChange} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                    <div className="w-6 h-6 relative rounded overflow-hidden flex items-center justify-center shrink-0">
                      <Image src={easypaisaLogo} alt="EasyPaisa" width={24} height={24} className="object-cover" />
                    </div>
                    <span className="font-bold text-sm text-gray-800">EasyPaisa</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">Mobile Wallet</span>
                </div>

                {formData.paymentMethod === 'easypaisa' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-emerald-100 text-xs space-y-1">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Account Title: <strong>Your Store Name</strong></span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>EasyPaisa Number: <strong>0300 0000000</strong></span>
                        <button type="button" onClick={() => copyToClipboard('03000000000', 'ep')} className="text-emerald-600 hover:text-emerald-700">
                          {copiedField === 'ep' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Sender Mobile Number *</label>
                      <input type="tel" name="walletPhone" placeholder="03XXXXXXXXX" value={formData.walletPhone} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Transaction ID (Trx ID) *</label>
                      <input type="text" name="transactionId" placeholder="e.g. 1234567890" value={formData.transactionId} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </motion.div>
                )}

                {/* JazzCash */}
                <div 
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'jazzcash' }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'jazzcash' ? 'border-amber-600 bg-amber-50/30 ring-1 ring-amber-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMethod" value="jazzcash" checked={formData.paymentMethod === 'jazzcash'} onChange={handleInputChange} className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
                    <div className="w-6 h-6 relative rounded overflow-hidden flex items-center justify-center shrink-0">
                      <Image src={jazzcashLogo} alt="JazzCash" width={24} height={24} className="object-cover" />
                    </div>
                    <span className="font-bold text-sm text-gray-800">JazzCash</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">Mobile Wallet</span>
                </div>

                {formData.paymentMethod === 'jazzcash' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-amber-100 text-xs space-y-1">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Account Title: <strong>Your Store Name</strong></span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>JazzCash Number: <strong>0301 0000000</strong></span>
                        <button type="button" onClick={() => copyToClipboard('03010000000', 'jc')} className="text-amber-600 hover:text-amber-700">
                          {copiedField === 'jc' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Sender Mobile Number *</label>
                      <input type="tel" name="walletPhone" placeholder="03XXXXXXXXX" value={formData.walletPhone} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Transaction ID (Trx ID) *</label>
                      <input type="text" name="transactionId" placeholder="e.g. 9876543210" value={formData.transactionId} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                  </motion.div>
                )}

                {/* Direct Bank Transfer */}
                <div 
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'bank' }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === 'bank'} onChange={handleInputChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-sm text-gray-800">Direct Bank Transfer</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">IBAN / Account</span>
                </div>

                {formData.paymentMethod === 'bank' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-blue-100 text-xs space-y-1 text-gray-600">
                      <div>Bank Name: <strong>Meezan Bank</strong></div>
                      <div>Account Title: <strong>Your Store Name Ltd</strong></div>
                      <div className="flex justify-between items-center">
                        <span>Account Number: <strong>01020304050607</strong></span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>IBAN: <strong>PK36MEZN0001020304050607</strong></span>
                        <button type="button" onClick={() => copyToClipboard('PK36MEZN0001020304050607', 'iban')} className="text-blue-600 hover:text-blue-700">
                          {copiedField === 'iban' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Transaction Ref / Reference Number *</label>
                      <input type="text" name="transactionId" placeholder="e.g. Ref No / Trx ID" value={formData.transactionId} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </motion.div>
                )}

                {/* Card Payment */}
                <div 
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'card' }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'card' ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-sm text-gray-800">Credit or Debit Card</span>
                  </div>
                  <span className="text-xs text-gray-400">Visa / Mastercard</span>
                </div>

                {formData.paymentMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Card Number *</label>
                      <input type="text" name="cardNumber" placeholder="4532 •••• •••• 8892" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">MM/YY *</label>
                        <input type="text" name="cardExp" placeholder="12/28" value={formData.cardExp} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">CVC *</label>
                        <input type="password" name="cardCvc" maxLength={4} placeholder="•••" value={formData.cardCvc} onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>Summary</span>
                  {isBuyNow && (
                    <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-600 text-amber-600" /> Express Checkout
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}
                </span>
              </h2>

              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 pr-1">
                {checkoutItems.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">Your checkout list is empty.</p>
                ) : (
                  checkoutItems.map((item: any) => (
                    <div key={item._id || item.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-red-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/25 hover:from-red-700 hover:to-red-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : !isFormValid ? (
                  'Fill Required Details to Order'
                ) : (
                  'Place Order'
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Fast Dispatch</span>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}