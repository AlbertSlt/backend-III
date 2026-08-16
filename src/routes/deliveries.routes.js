import express from "express";
import DeliveryController from "../controllers/delivery.controller.js";

const router = express.Router();

router.get("/", DeliveryController.getAllDeliveries);
router.get("/:id", DeliveryController.getDeliveryById);
router.patch("/:id/status", DeliveryController.updateDeliveryStatus);

export default router;