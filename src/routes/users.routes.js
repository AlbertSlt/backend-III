import express from "express";
import UserController from "../controllers/user.controller.js";
import { validateUser, validateUserUpdate } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", validateUser, UserController.createUser);
router.put("/:id", validateUserUpdate, UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;