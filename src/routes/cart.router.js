import express from "express";
import Cart from "../models/cart.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const cartRouter = express.Router();
// /api/carts

// POST
// Crear carrito
cartRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  })
);

// GET
// Listar productos del carrito

cartRouter.get(
  "/:cid",
  asyncHandler(async (req, res) => {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart });
  })
);

// POST
// Agregar productos al carrito



cartRouter.post(
  "/:cid/product/:pid",
  asyncHandler(async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updateCart = await Cart.findByIdAndUpdate(
      cid,
      { $push: { products: { product: pid, quantity } } },
      { new: true }
    );
    if (!updateCart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.status(201).json({ status: "success", payload: updateCart });
  })
);

// Delete products en cart
cartRouter.delete(
  "/:cid/product/:pid",
  asyncHandler(async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();

    res
      .status(200)
      .json({
        status: "success",
        message: "Producto eliminado del carrito",
        payload: cart,
      });
  })
);

// Delete cart
cartRouter.delete(
  "/:cid",
  asyncHandler(async (req, res) => {
    const cid = req.params.cid;

    const cart = await Cart.findByIdAndDelete(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart });
  })
);

export default cartRouter;
