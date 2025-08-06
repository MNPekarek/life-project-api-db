import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

// Obtener todos los productos
export const getProducts = asyncHandler(async (req, res) => {
  const { 
    category,
    search,
    page = 1,
    limit = 10,
    minPrice,
    maxPrice,
    sortBy,
    order = "asc"
     } = req.query;

  const query = {};

  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: "i" };
  if (minPrice || maxPrice) {
    if (minPrice) query.price.$gte = Number(minPrice);
    if ( maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortOptions = {};
  if (sortBy) sortOptions(sortBy) = order === "desc" ? -1 : 1;

  const data = await Product.paginate(query, { 
    page: Number(page),
    limit: Number(limit),
    sort: sortOptions,  
  });

  res.status(200).json({ status: "success", payload: data.docs, totalPages: data.totalPages || 1, currentPage: data.page,
  });
});

// Buscar por nombre
export const searchProducts = asyncHandler(async (req, res) => {
  const { title = "", limit = 10, page = 1 } = req.query;
  const regex = new RegExp(title, "i");
  const data = await Product.paginate({ title: regex }, { limit, page });
  const products = data.docs;
  delete data.docs;

  res.status(200).json({ status: "success", payload: products, ...data });
});

// Filtrar por múltiples criterios
export const filterProducts = asyncHandler(async (req, res) => {
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
});

// Filtrar por categoría
// export const getProductsByCategory = asyncHandler(async (req, res) => {
//   const { limit = 10, page = 1 } = req.query;
//   const category = req.params.category;
//   const query = category ? { category } : {};

//   const data = await Product.paginate(query, { limit, page });
//   const products = data.docs;
//   delete data.docs;

//   if (!products || products.length === 0)
//     return res.status(404).json({ status: "error", message: "Categoría no encontrada" });

//   res.status(200).json({ status: "success", payload: products });
// });

// Obtener por ID
export const getProductById = asyncHandler(async (req, res) => {
  const pid = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: "error", message: "ID inválido" });
  }

  const product = await Product.findById(pid);

  if (!product)
    return res.status(404).json({ status: "error", message: "Producto no encontrado" });

  res.status(200).json({ status: "success", payload: product });
});

// Crear producto
export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();

  res.status(201).json({ status: "success", payload: saved });
});

// Actualizar producto
export const updateProduct = asyncHandler(async (req, res) => {
  const pid = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: "error", message: "ID inválido" });
  }

  const updated = await Product.findByIdAndUpdate(pid, req.body, { new: true });

  if (!updated)
    return res.status(404).json({ status: "error", message: "Producto no encontrado" });

  res.status(200).json({ status: "success", payload: updated });
});

// Eliminar producto
export const deleteProduct = asyncHandler(async (req, res) => {
  const pid = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: "error", message: "ID inválido" });
  }

  const deleted = await Product.findByIdAndDelete(pid);

  if (!deleted)
    return res.status(404).json({ status: "error", message: "Producto no encontrado" });

  res.status(200).json({ status: "success", message: "Producto eliminado" });
});