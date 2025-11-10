import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";
import { generateNextCode } from "../utils/codeGenerator.js";

// Obtener todos los productos
// ✅ Obtener todos los productos con filtros, búsqueda y orden
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    page = 1,
    limit = 10,
    minPrice,
    maxPrice,
    sortBy,
    order = "asc",
    featured,
    offer
  } = req.query;

  const query = {};

  if (category && category !== "all") query.category = category;
  if (featured === "true") query.featured = true;
  if (offer === "true") query["offer.active"] = true;
  if (search?.trim()) {
    const regex = { $regex: search.trim(), $options: "i" };
    query.$or = [{ title: regex }, { description: regex }, { category: regex }];
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const allowedSortFields = ["price", "title", "created_at"];
  const sortOptions = {};
  if (sortBy && allowedSortFields.includes(sortBy)) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  }

  const data = await Product.paginate(query, {
    page: Number(page),
    limit: Number(limit),
    sort: Object.keys(sortOptions).length ? sortOptions : { created_at: -1 },
  });

  res.status(200).json({
    status: "success",
    payload: data.docs,
    totalPages: data.totalPages || 1,
    currentPage: data.page,
  });
});

// productos destacados
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ featured: true }).limit(8);
  res.status(200).json({ status: "success", payload: featured });
});

// Ofertas
export const getOfferProducts = asyncHandler(async (req, res) => {
  const offers = await Product.find({ "offer.active": true }).limit(8);
  res.status(200).json({ status: "success", payload: offers });
});




// GET cantidades por title
export const getVariantsByTitle = asyncHandler(async (req, res) => {
  const { title } = req.params;

  const variants = await Product.find({
    title: { $regex: `^${title}$`, $options: "i" },
  });

  if (!variants || variants.length === 0) {
    return res.status(200).json({ payload: [] });
  }

  res.status(200).json({ payload: variants });
});

// por favor anda

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
  const {
    title = "",
    category,
    minStock = 0,
    limit = 10,
    page = 1,
  } = req.query;

  const query = {
    ...(title && { title: new RegExp(title, "i") }),
    ...(category && { category }),
    stock: { $gte: minStock },
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
    return res
      .status(404)
      .json({ status: "error", message: "Producto no encontrado" });

  res.status(200).json({ status: "success", payload: product });
});

// Crear producto
export const createProduct = asyncHandler(async (req, res) => {
  const lastProduct = await Product.findOne().sort({ created_at: -1 });

  const nextCode = await generateNextCode(lastProduct?.code);

  const newProduct = new Product ({
    ...req.body,
    code: nextCode,
  });
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
    return res
      .status(404)
      .json({ status: "error", message: "Producto no encontrado" });

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
    return res
      .status(404)
      .json({ status: "error", message: "Producto no encontrado" });

  res.status(200).json({ status: "success", message: "Producto eliminado" });
});
