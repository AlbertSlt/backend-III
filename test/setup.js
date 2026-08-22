import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import logger from "../src/config/logger.js";

export const mochaHooks = {
    async beforeAll() {
        await connectDB();
    },

    async afterAll() {
        await mongoose.connection.close();
        logger.info("Conexión de testing cerrada");
    },
};