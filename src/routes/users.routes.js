import express from "express";
import UserController from "../controllers/user.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.post("/", validateUser, UserController.create);
router.put("/:id", validateUser, UserController.update);
router.delete("/:id", UserController.delete);

export default router;