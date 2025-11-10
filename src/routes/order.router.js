import express from "express";
import { createOrder, getOrders, getOrdersByDate, getOrdersByStatus, exportOrdersCSV, updateOrderStatus, deleteOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/export", exportOrdersCSV);
router.get("/by-date", getOrdersByDate);
router.get("/by-status", getOrdersByStatus);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;