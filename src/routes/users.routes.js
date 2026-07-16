import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

//Querys para traer segun nombre, role (agregar)
router.get("/", UserController.getAll);

router.get("/", (req, res) => {
    res.send("Ruta de usuarios");
});

//HASTA ACA CLASE 1

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Usuario con ID: ${id}`);
});

router.post("/", (req, res) => {
    const { name, email } = req.body;
    res.send(`Usuario creado: ${name} - ${email}`);
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    res.send(`Usuario con ID: ${id} actualizado a: ${name} - ${email}`);
});

router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    res.send(`Usuario con ID: ${id} parcialmente actualizado a: ${name} - ${email}`);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Usuario con ID: ${id} eliminado`);
});

export default router;