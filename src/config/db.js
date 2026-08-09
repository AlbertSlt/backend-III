import mongoose from "mongoose";
import { config } from "./env.config.js";
import logger from "./logger.js";


export async function connectDB() {
    try {
        logger.info("Conectando a la base de datos...");
        await mongoose.connect(config.MONGODB_URI);
        logger.info("Conexión a la base de datos establecida");
    } catch (error) {
        // un error crítico que impide arrancar la app.
        logger.fatal(`Error al conectar a la base de datos: ${error.message}`);
        process.exit(1);
    }
}