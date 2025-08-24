import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  quantity: { type: String }, // Ej: "500g", "unidad", etc.
  cantidadCart: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  neighborhood: { type: String, required: true },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pendiente", "enviado", "cancelado"],
    default: "pendiente",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
