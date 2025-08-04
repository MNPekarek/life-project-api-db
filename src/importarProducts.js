import mongoose from "mongoose";
import Product from "./models/product.model.js";
import connectMongoDB from "./config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Ruta dinamica al JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "../productosViejos.json");

const convertirProducto = (p) => ({
  title: p.nombre,
  description: p.descripcion,
  code: `code-${p.id}`, // o algo único
  price: p.precio,
  stock: p.stock,
  quantity: p.cantidad,
  category: p.categoria,
  thumbnail: p.img,
  status: true,
});

const importar = async () => {
    try {
        await connectMongoDB();

        const rawData = await fs.readFile(jsonPath, "utf-8");
        const productosViejos = JSON.parse(rawData);

        const productosConvertidos = productosViejos.map(convertirProducto);
        await Product.insertMany(productosConvertidos);

        console.log("Productos importados con exito");
        
    } catch (error) {
        console.error("Error al importar:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

importar();
