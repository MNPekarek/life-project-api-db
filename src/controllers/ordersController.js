import OrderModel from "../models/OrderModel.js";
import { Parser } from "json2csv";

// Crear nuevo pedido
export const createOrder = async (req, res) => {
  try {
    const newOrder = new OrderModel(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Pedido guardado" });
  } catch (err) {
    console.error("Error al guardar pedido:", err);
    res.status(500).json({ error: "Error al guardar el pedido" });
  }
};

// Obtener todos los pedidos
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

//Filtrar pedidos por fecha
export const getOrdersByDate = async (req, res) => {
  try {
    const { fecha } = req.query;
    const start = new Date(fecha);
    const end = new Date(fecha);
    end.setHours(23, 59, 59, 999);

    const orders = await OrderModel.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error al filtrar por fecha:", err);
    res.status(500).json({ error: "Error al filtrar pedidos por fecha" });
  }
};

//Filtrar pedidos por estado
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await OrderModel.find({ status });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error al filtrar por estado:", err);
    res.status(500).json({ error: "Error al filtrar pedidos por estado" });
  }
};

// Devolver pedidos en formato CSV
export const exportOrdersCSV = async (req, res) => {
  try {
    const orders = await OrderModel.find().lean();

    const fields = ["_id", "cliente", "status", "total", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(orders);

    res.header("Content-Type", "text/csv");
    res.attachment("pedidos.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error al exportar CSV:", err);
    res.status(500).json({ error: "Error al exportar pedidos" });
  }
};
