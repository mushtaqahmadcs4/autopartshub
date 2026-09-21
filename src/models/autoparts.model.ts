import mongoose from "mongoose";

export interface IAutoPart {
  _id?: mongoose.Types.ObjectId;
  name: string;
  partNumber: string;
  brand: string;
  category: string[];
  compatibility: string[];
  price: number;
  stock: number;
  unit: string;
  image?: string;
  description?: string;
  isPopular?: boolean; // Added field
  createdAt?: Date;
  updatedAt?: Date;
}

const autoPartSchema = new mongoose.Schema<IAutoPart>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    partNumber: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: [String],
      required: true,
      default: [],
    },
    compatibility: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      default: "piece",
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    isPopular: {
      type: Boolean,
      default: false, // Default to false for all newly created items
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.AutoPart) {
  delete mongoose.models.AutoPart;
}

export const AutoPart =
  mongoose.models.AutoPart ||
  mongoose.model<IAutoPart>("AutoPart", autoPartSchema);