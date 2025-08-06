import express from "express";
import {
  getProducts,
  searchProducts,
  filterProducts,
  // getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVariantsByTitle,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

// /api/products
productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/filter", filterProducts);
// productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/:pid", getProductById);
productRouter.get("/variants/:title", getVariantsByTitle);

// Escritura
productRouter.post("/", createProduct);
productRouter.put("/:pid", updateProduct);
productRouter.delete("/:pid", deleteProduct);


export default productRouter;
