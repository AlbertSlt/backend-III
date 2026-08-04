// mongoose es un: ODM -> Object document mapper (MONGODB NOSQL)
//ORM -> Object relational mapper (SQL)

import express from "express";

import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";

import mockRoutes from "./mocks/routes/mock.routes.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

if (config.NODE_ENV !== "production") {
    app.use("/api/mocks", mockRoutes);
}

app.get("/", (req, res) => {
    res.send("ShipNow API v1 - Corriendo");
});

// Los middlewares de error SIEMPRE van al final, después de todas las rutas:
// primero notFoundHandler (rutas que no matchean ningún router),
// y por último errorHandler (captura cualquier error lanzado en el camino).
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    await seedAdmin();
    app.listen(config.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${config.PORT}`);
    });
};

startServer();