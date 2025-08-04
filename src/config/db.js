import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
       await mongoose.connect(process.env.MONGO_URL);
       console.log("Conectado con MongoDB!")
    } catch (error) {
        console.log("Error al conectar MongoDB")
    }
}

export default connectMongoDB;

