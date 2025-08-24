import dotenv from "dotenv"
dotenv.config();

import express from "express";
import http from "http";
import connectMongoDB from "./config/db.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import logger from "./middlewares/logger.js"
import errorHandler from "./middlewares/errorHandler.js"
import cors from "cors";
import OrderModel from "./models/OrderModel.js";

const app = express();
const server = http.createServer(app);

connectMongoDB();

// puerto de nuestro servidor
const PORT = process.env.PORT
// habilitamos poder recibir json
app.use(express.json());
// ✅ habilitamos CORS antes de cualquier endpoint
app.use(cors());
// habilitamos la carpeta public
// app.use(express.static( __dirname + "/public"));
app.use(logger); //loguea cada request

// endpoints
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter)
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new OrderModel(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Pedido guardado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el pedido" });
  }
});

app.use(errorHandler); // maneja los errores globales


// iniciamos el servidor y escuchamos en el puerto definido
server.listen(PORT, () => console.log(`Servidor iniciado en: http://localhost:${PORT}`) );
