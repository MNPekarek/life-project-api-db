import Product from "../models/product.model.js";
import Order from "../models/OrderModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();
    const pendingOrders = orders.filter(o => o.status === "pendiente").length;
    const totalOrders = orders.length;

    // ventas totales
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    // ventas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = orders
      .filter(o => new Date(o.createdAt) >= today)
      .reduce((acc, o) => acc + (o.total || 0), 0);

    res.json({
      status: "success",
      payload: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        todayRevenue,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error al obtener estadísticas" });
  }
};

export const getWeeklySales = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // últimos 7 días
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: startDate } });

    // Agrupar por día (formato YYYY-MM-DD)
    const salesByDay = {};
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(startDate.getDate() + i);
      const key = day.toISOString().split("T")[0];
      salesByDay[key] = 0;
    }

    orders.forEach(order => {
      const key = new Date(order.createdAt).toISOString().split("T")[0];
      if (salesByDay[key] !== undefined) {
        salesByDay[key] += order.total || 0;
      }
    });

    const formatted = Object.entries(salesByDay).map(([date, total]) => ({
      date,
      total,
    }));

    res.json({ status: "success", payload: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error al obtener ventas semanales" });
  }
};