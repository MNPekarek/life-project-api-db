import express from "express";
import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { validateProduct } from "../middlewares/validateProduct.js";

const productRouter = express.Router();

// /api/products

// GET - Obtener datos
productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page });
    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", payload: products, ...data });
  })
);

// GET
// Obtener datos por id
productRouter.get(
  "/:pid",
  asyncHandler(async (req, res) => {
    const pid = req.params.pid;
    const product = await Product.findById(pid);

    res.status(200).json({ status: "success", payload: product });
  })
);

// Obtener datos por categoria
productRouter.get(
  "/category/:category",
  asyncHandler(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const category = req.params.category;
    const query = category ? { category } : {};

    const data = await Product.paginate(query, { limit, page });
    const products = data.docs;
    delete data.docs;

    if (!products)
      return res
        .status(404)
        .json({ status: "error", message: "Categoria no encontrada" });

    res.status(200).json({ status: "success", payload: products });
  })
);

// Filtrar productos por nombre
productRouter.get("/search", asyncHandler(async (req, res) => {
  const { title = "", limit = 10, page = 1 } = req.query;
  const regex = new RegExp(title, "i"); //case-insensitive
  const data = await Product.paginate({ title: regex }, { limit, page });
  const products = data.docs;
  delete data.docs;

  res.status(200).json({ status: "success", payload: products, ...data });
}));

//Filter
productRouter.get("/filter", asyncHandler(async (req, res) => {
  const { title = "", category, minStock = 0, limit = 10, page = 1 } = req.query;

  const query = {
    ...(title && { title: new RegExp(title, "i") }),
    ...(category && { category }),
    stock: { $gte: minStock }
  };

  const data = await Product.paginate(query, { limit, page });
  const products = data.docs;
  delete data.docs;

  res.status(200).json({ status: "success", payload: products, ...data });
}));

// POST
productRouter.post(
  "/",
  validateProduct,
  asyncHandler(async (req, res) => {
    const { title, description, code, price, stock,quantity, category } = req.body;

    const product = new Product({
      title,
      description,
      code,
      price,
      stock,
      quantity,
      category,
    });
    await product.save();

    res.status(201).json({ status: "success", payload: product });
  })
);

// PUT
productRouter.put(
  "/:pid",
  asyncHandler(async (req, res) => {
    const pid = req.params.pid;
    const updatedData = req.body;

    const updateProduct = await Product.findByIdAndUpdate(pid, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updateProduct)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: updateProduct });
  })
);

// DELETE
productRouter.delete(
  "/:pid",
  asyncHandler(async (req, res) => {
    const pid = req.params.pid;

    const deleteProduct = await Product.findByIdAndDelete(pid);
    if (!deleteProduct)
      return res
        .status(404)
        .json({ status: "error", message: " Producto no encontrado" });
    res.status(200).json({ status: "success", payload: deleteProduct });
  })
);

export default productRouter;
