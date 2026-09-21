import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface IPaymentDetails {
  walletPhone?: string;
  transactionId?: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "cod" | "easypaisa" | "jazzcash" | "bank" | "card";
  paymentDetails?: IPaymentDetails;
  isPaid: boolean;
  paidAt?: Date;
  orderStatus: "Pending" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "easypaisa", "jazzcash", "bank", "card"],
      default: "cod",
      required: true,
    },
    paymentDetails: {
      walletPhone: { type: String },
      transactionId: { type: String },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;