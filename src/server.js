import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import logger from "./config/logger.js";

const startServer = async () => {
    await connectDB();
    await seedAdmin();
    app.listen(config.PORT, () => {
        logger.info(`Servidor Ship-POW! escuchando en el puerto ${config.PORT}`);
    });
};

startServer();