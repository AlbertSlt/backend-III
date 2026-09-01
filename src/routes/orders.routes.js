import express from "express";
import OrderController from "../controllers/order.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/status", OrderController.updateOrderStatus);
router.post("/:id/proof", upload.single("proof"), OrderController.uploadProof);

export default router;