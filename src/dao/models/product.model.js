import mongoose from "mongoose";

export const productModel = mongoose.model(
  "products",
  new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: [String], required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
    category: { type: String, required: true },
  }, 
  { timestamps: true }),
);