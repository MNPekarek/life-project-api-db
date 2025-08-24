import express from "express";
import { createOrder, getOrders, getOrdersByDate, getOrdersByStatus, exportOrdersCSV } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/export", exportOrdersCSV);
router.get("/by-date", getOrdersByDate);
router.get("/by-status", getOrdersByStatus);

export default router;