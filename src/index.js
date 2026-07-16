// mongoose es un: ODM -> Object document mapper (MONGODB NOSQL)
//ORM -> Object relational mapper (SQL)


import express from "express";

import { config } from "./config/config.js";
import {connectDB} from "./config/db.js";

import userRoutes from "./routes/users.routes.js";


const app = express();

app.use(express.json());
app.use("api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("ShipNow API v1 - Corriendo");
});

app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}`);
})