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
