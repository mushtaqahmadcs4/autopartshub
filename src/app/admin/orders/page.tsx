'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  CreditCard,
  Calendar,
  Phone,
  Hash,
  Loader2,
  RefreshCw,
  AlertCircle
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
  zipCode?: string;
}

interface IPaymentDetails {
  walletPhone?: string;
  transactionId?: string;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const orderStatusEnum = ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
  const statusSteps = ['Pending', 'Processing', 'Dispatched', 'Delivered'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.orders || []);
        if (data.orders?.length > 0) {
          setExpandedOrders({ [data.orders[0]._id]: true });
        }
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus as any } : ord))
        );
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error connecting to endpoint');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, isPaidValue: boolean) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: isPaidValue }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, isPaid: isPaidValue } : ord))
        );
      } else {
        alert(data.message || 'Failed to update payment status');
      }
    } catch (err) {
      alert('Error updating payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStepIndex = (status: string) => statusSteps.indexOf(status);

  return (
    <div className="min-h-screen bg-slate-100/80 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Admin Orders Management</h1>
              <p className="text-xs text-red-100">Update order status and confirm customer payments</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchOrders} 
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-red-200 uppercase font-bold tracking-wider">Total Orders</span>
              <p className="text-2xl font-black">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Dynamic States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto" />
            <p className="text-xs font-medium text-gray-500">Loading customer orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center text-red-700 text-xs font-bold space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-red-600" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-2 border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-800">No Orders Found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const currentStep = getStepIndex(order.orderStatus);
              const isUpdating = updatingId === order._id;

              return (
                <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  
                  {/* Summary Bar */}
                  <div className="p-5 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-gray-600">
                          {order.shippingAddress?.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Admin Dropdown Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Order Status Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-gray-400">Status:</span>
                        <select
                          disabled={isUpdating}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer disabled:opacity-50"
                        >
                          {orderStatusEnum.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Payment Status Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-gray-400">Payment:</span>
                        <select
                          disabled={isUpdating}
                          value={order.isPaid ? 'true' : 'false'}
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value === 'true')}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-50 ${
                            order.isPaid 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="false">Unpaid</option>
                          <option value="true">Paid</option>
                        </select>
                      </div>

                      <span className="text-sm font-black text-red-600">
                        Rs. {(order.totalAmount || 0).toLocaleString()}
                      </span>

                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-5 bg-gray-50/50 space-y-6">

                      {/* Live Progress Bar */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-3">Delivery Tracker</span>
                        <div className="relative flex items-center justify-between">
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                          <div 
                            className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 z-0 transition-all duration-300" 
                            style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                          />

                          {statusSteps.map((step, idx) => {
                            const isCompleted = currentStep >= idx;
                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                  isCompleted ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span className="text-[10px] font-bold mt-1 text-gray-600">{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="p-3.5 flex items-center gap-3 text-xs">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 truncate">{item.name}</p>
                              <p className="text-gray-400">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <span className="font-bold text-gray-900">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Address & Payment Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-red-600 font-bold mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>Shipping Address</span>
                          </div>
                          <p className="font-bold text-gray-800">{order.shippingAddress?.fullName}</p>
                          <p className="text-gray-600">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                          <p className="text-gray-400">Phone: {order.shippingAddress?.phone}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-red-600 font-bold mb-1">
                            <CreditCard className="w-4 h-4" />
                            <span>Payment Info</span>
                          </div>
                          <p className="text-gray-600">Method: <strong className="text-gray-800 uppercase">{order.paymentMethod}</strong></p>
                          {order.paymentDetails?.walletPhone && (
                            <p className="text-gray-600 flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone: <strong>{order.paymentDetails.walletPhone}</strong>
                            </p>
                          )}
                          {order.paymentDetails?.transactionId && (
                            <p className="text-gray-600 flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5 text-emerald-600" /> Trx ID: <strong className="font-mono bg-emerald-50 text-emerald-900 px-1 py-0.5 rounded">{order.paymentDetails.transactionId}</strong>
                            </p>
                          )}
                          <p className="text-gray-600 pt-1">
                            Status: <strong className={order.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </strong>
                          </p>
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