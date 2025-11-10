import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: { type: String, default: "" },
  code: { type: String, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  quantity: String,
  category: { type: String, index: true },
  status: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },   // ⭐ NUEVO
  offer: {                                       // 🔥 NUEVO
    active: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },      // % de descuento
    expiresAt: { type: Date, default: null },
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { collection: "products" });

productSchema.index({ title: "text", description: "text" });
productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);
export default Product;
