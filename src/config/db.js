import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDB() {
    try {
        console.log("Conectando a la base de datos...");
        await mongoose.connect(config.MONGO_URI);
        console.log("Conexión a la base de datos establecida");
    } catch (error) {
        console.warn("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}