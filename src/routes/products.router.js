import express from "express";
import {
  getAllProducts,
  searchProducts,
  filterProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

// /api/products
productRouter.get("/", getAllProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/filter", filterProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/:pid", getProductById);

// Escritura
productRouter.post("/", createProduct);
productRouter.put("/:pid", updateProduct);
productRouter.delete("/:pid", deleteProduct);


export default productRouter;
