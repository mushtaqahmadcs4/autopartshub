'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  Phone,
  Hash,
  XCircle
} from 'lucide-react';

interface IOrderItem {
  _id?: string;
  product: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface IPaymentDetails {
  walletPhone?: string;
  easypaisaNumber?: string;
  transactionId?: string;
  trxId?: string;
  accountHolder?: string;
}

interface IOrder {
  _id: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'easypaisa' | 'jazzcash' | 'bank' | 'card' | string;
  paymentDetails?: IPaymentDetails;
  isPaid: boolean;
  orderStatus: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function MyOrder() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/my-orders');
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.orders);
        // Expand first order by default
        if (data.orders.length > 0) {
          setExpandedOrders({ [data.orders[0]._id]: true });
        }
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPaymentMethod = (method: string) => {
    const cleanMethod = method?.toLowerCase().trim();
    switch (cleanMethod) {
      case 'easypaisa': return 'EasyPaisa Mobile Wallet';
      case 'jazzcash': return 'JazzCash Mobile Wallet';
      case 'bank': return 'Direct Bank Transfer';
      case 'card': return 'Credit / Debit Card';
      default: return 'Cash on Delivery';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusSteps = ['Pending', 'Processing', 'Dispatched', 'Delivered'];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">My Orders</h1>
                  <p className="text-xs sm:text-sm text-red-100">
                    Track purchase history and real-time delivery status
                  </p>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:block text-right">
              <span className="text-xs text-red-200 uppercase font-bold tracking-wider">Total Orders</span>
              <p className="text-2xl font-black">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Content Loading / State Handling */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-gray-500">Loading your order history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-8 border border-red-200 text-center text-red-700 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-red-600" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-4">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500">Looks like you haven't bought any auto parts yet.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Order Cards List */
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const currentStep = getStepIndex(order.orderStatus);
              const cleanMethod = order.paymentMethod?.toLowerCase().trim();

              // Safe extractions for EasyPaisa / Wallet fields regardless of variable naming in DB
              const walletPhone = order.paymentDetails?.walletPhone || order.paymentDetails?.easypaisaNumber || order.shippingAddress.phone;
              const transactionId = order.paymentDetails?.transactionId || order.paymentDetails?.trxId;

              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
                >
                  {/* Top Order Summary Bar */}
                  <div className="p-5 sm:p-6 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Payment Badge Status */}
                      <span className={`text-xs font-bold px-3 py-1 rounded-md border ${
                        order.isPaid 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : cleanMethod === 'easypaisa' || cleanMethod === 'jazzcash'
                          ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {order.isPaid 
                          ? 'Paid' 
                          : cleanMethod === 'easypaisa'
                          ? 'EasyPaisa Submitted'
                          : cleanMethod === 'jazzcash'
                          ? 'JazzCash Submitted'
                          : 'Unpaid / COD'}
                      </span>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Total</span>
                        <span className="text-lg font-black text-red-600">
                          Rs. {(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                  </div>

                  {/* Order Details Accordion Body */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-gray-50/50 space-y-6">

                      {/* Delivery Status Tracker */}
                      {order.orderStatus !== 'Cancelled' ? (
                        <div className="bg-white p-5 rounded-xl border border-gray-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Delivery Progress</h4>
                          <div className="relative flex items-center justify-between">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 z-0 transition-all duration-500" 
                              style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                            />

                            {statusSteps.map((step, idx) => {
                              const isCompleted = currentStep >= idx;
                              const isCurrent = currentStep === idx;

                              return (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                    isCompleted 
                                      ? 'bg-red-600 text-white' 
                                      : 'bg-gray-100 text-gray-400'
                                  } ${isCurrent ? 'ring-4 ring-red-100' : ''}`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                  </div>
                                  <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-red-600' : 'text-gray-500'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-700 text-xs font-bold">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span>This order was cancelled.</span>
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Items Ordered</h4>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center gap-4">
                              <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-bold text-gray-800 truncate">{item.name}</h5>
                                <p className="text-xs text-gray-400">
                                  Qty: {item.quantity} × Rs. {(item.price || 0).toLocaleString()}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                Rs. {(item.quantity * item.price).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        
                        {/* Shipping Address */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
                          <div className="flex items-center gap-2 text-red-600 font-bold">
                            <MapPin className="w-4 h-4" />
                            <span>Shipping Address</span>
                          </div>
                          <div className="text-gray-600 space-y-0.5">
                            <p className="font-bold text-gray-800">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                            <p className="pt-1 text-gray-400">Phone: {order.shippingAddress.phone}</p>
                          </div>
                        </div>

                        {/* Payment Details Box */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
                          <div className="flex items-center gap-2 text-red-600 font-bold">
                            <CreditCard className="w-4 h-4" />
                            <span>Payment Information</span>
                          </div>
                          
                          <div className="text-gray-600 space-y-1.5">
                            <p>Method: <strong className="text-gray-800">{formatPaymentMethod(order.paymentMethod)}</strong></p>

                            {/* Wallet Specific Container (EasyPaisa / JazzCash) */}
                            {(cleanMethod === 'easypaisa' || cleanMethod === 'jazzcash') && (
                              <div className="mt-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                                {walletPhone && (
                                  <p className="flex items-center gap-1.5 font-medium text-emerald-950">
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Account Phone:</span> <strong>{walletPhone}</strong>
                                  </p>
                                )}
                                {transactionId ? (
                                  <p className="flex items-center gap-1.5 font-medium text-emerald-950">
                                    <Hash className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Trx ID / TID:</span> <strong className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-900">{transactionId}</strong>
                                  </p>
                                ) : (
                                  <p className="text-[11px] text-amber-700 font-medium italic">
                                    * Transaction ID pending manual store verification
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Generic fallback for other non-wallet transaction IDs */}
                            {cleanMethod !== 'easypaisa' && cleanMethod !== 'jazzcash' && transactionId && (
                              <p>Transaction ID: <strong className="text-gray-800 font-mono">{transactionId}</strong></p>
                            )}

                            <p className="pt-1">
                              Status: <strong className={
                                order.isPaid 
                                  ? "text-emerald-600" 
                                  : cleanMethod === 'easypaisa' || cleanMethod === 'jazzcash'
                                  ? "text-emerald-700"
                                  : "text-amber-600"
                              }>
                                {order.isPaid 
                                  ? "Payment Verified" 
                                  : cleanMethod === 'easypaisa'
                                  ? "EasyPaisa Details Received (Verification Pending)"
                                  : cleanMethod === 'jazzcash'
                                  ? "JazzCash Details Received (Verification Pending)"
                                  : "Cash on Delivery / Awaiting Payment"}
                              </strong>
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Full Cost Breakdown */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span className="font-semibold text-gray-800">Rs. {(order.subtotal || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Shipping Fee</span>
                          <span className="font-semibold text-gray-800">Rs. {(order.shippingFee || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-sm text-gray-900">
                          <span>Total Amount</span>
                          <span className="text-red-600">Rs. {(order.totalAmount || 0).toLocaleString()}</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}