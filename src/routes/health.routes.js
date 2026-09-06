import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

export default router;