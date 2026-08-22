import express from "express";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";

import { config } from "./config/env.config.js";
import logger from "./config/logger.js";

import mockRoutes from "./mocks/routes/mock.routes.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import deliveryRoutes from "./routes/deliveries.routes.js";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);

if (config.NODE_ENV !== "production") {
    app.use("/api/mocks", mockRoutes);
}

app.get("/", (req, res) => {
    res.send("Ship-POW! API v1 - Corriendo");
});

// verif que los niveles del logger funcionan (consola + archivo rotado para error/fatal).
if (config.NODE_ENV !== "production") {
    app.get("/api/logger-test", (req, res) => {
        logger.debug("Log de nivel debug");
        logger.http("Log de nivel http");
        logger.info("Log de nivel info");
        logger.warning("Log de nivel warning");
        logger.error("Log de nivel error");
        logger.fatal("Log de nivel fatal");

        res.status(200).json({
            status: "success",
            message: "Logs generados correctamente"
        });
    });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;