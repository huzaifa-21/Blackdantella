import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const colorVariantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    images: [imageSchema], // Array of images for this color
    sizes: [sizeSchema], // Array of sizes for this color
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: Number,
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    colorVariants: [colorVariantSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
