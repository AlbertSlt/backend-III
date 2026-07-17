// mongoose es un: ODM -> Object document mapper (MONGODB NOSQL)
//ORM -> Object relational mapper (SQL)

import express from "express";

import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/users.routes.js";
import UserModel from "./models/user.model.js";
import productRoutes from "./routes/products.routes.js";
import { USER_ROLES } from "./utils/constants.js";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("ShipNow API v1 - Corriendo");
});

const startServer = async () => {
    await connectDB();

    const adminExists = await UserModel.findOne({ email: "admin@shipnow.com" });

    if (!adminExists) {
        await UserModel.create({
            first_name: "Admin",
            last_name: "Principal",
            email: "admin@shipnow.com",
            password: "adminpassword",
            role: USER_ROLES.ADMIN
        });
        console.log("Usuario Admin creado - prueba");
    }

    app.listen(config.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${config.PORT}`);
    });
};

startServer();