import DeliveryService from "../services/delivery.service.js";

class DeliveryController {
    static async getAllDeliveries(req, res, next) {
        try {
            const { data, meta } = await DeliveryService.getAllDeliveries(req.query);
            res.status(200).json({ status: "success", payload: data, ...meta });
        } catch (error) {
            next(error);
        }
    }

    static async getDeliveryById(req, res, next) {
        try {
            const { id } = req.params;
            const delivery = await DeliveryService.getDeliveryById(id);
            res.status(200).json({ status: "success", payload: delivery });
        } catch (error) {
            next(error);
        }
    }

    static async updateDeliveryStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const delivery = await DeliveryService.updateDeliveryStatus(id, status);
            res.status(200).json({ status: "success", payload: delivery });
        } catch (error) {
            next(error);
        }
    }
}

export default DeliveryController;