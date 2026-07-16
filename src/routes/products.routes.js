import express from "express";

const app = express();

app.use(express.json());   

app.get("health", (req, res) => {
    res.send("ShipNow API v1 - Corriendo");
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
})