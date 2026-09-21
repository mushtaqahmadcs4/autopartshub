import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },

    slug: { type: String, required: true, unique: true },

    level: {
      type: String,
      enum: ["MAJOR", "MINOR"],
      default: "MINOR",
    },

    image: {
      type: String,
      default: "",
    },

    // Controls whether this category appears before or after
    // the hardcoded default/promo banners.
    placeBeforeDefault: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Category =
  models.Category || model("Category", CategorySchema);