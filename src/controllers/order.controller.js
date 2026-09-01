import OrderService from "../services/order.service.js";

class OrderController {
    static async getAllOrders(req, res, next) {
        try {
            const orders = await OrderService.getAllOrders(req.query);
            res.status(200).json({ status: "success", payload: orders });
        } catch (error) {
            next(error);
        }
    }

    static async getOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.getOrderById(id);
            res.status(200).json({ status: "success", payload: order });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await OrderService.updateOrderStatus(id, status);
            res.status(200).json({ status: "success", payload: order });
        } catch (error) {
            next(error);
        }
    }

    static async uploadProof(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.addProof(id, req.file);
            res.status(200).json({ status: "success", payload: order });
        } catch (error) {
            next(error);
        }
    }
}

export default OrderController;