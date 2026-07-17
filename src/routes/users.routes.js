import express from "express";
import UserController from "../controllers/user.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const router = express.Router();

//Querys para traer segun nombre, role 
router.get("/", UserController.getAll);

//HASTA ACA CLASE 1

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Usuario con ID: ${id}`);
});

router.post("/", validateUser, (req, res) => {
    const { name, email } = req.body;
    res.send(`Usuario creado: ${name} - ${email}`);
});

router.put("/:id", validateUser, (req, res) => {
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