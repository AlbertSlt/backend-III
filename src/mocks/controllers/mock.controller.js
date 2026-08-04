import MockService from '../services/mock.service.js';
import { USER_ROLES } from '../../utils/constants.js';

class MockController {
    static async mockingUsers(req, res, next) {
        try {
            const users = MockService.generateMockUsers(req.mockCount, USER_ROLES.USER);
            res.status(200).json({ status: "success", payload: users });
        } catch (error) {
            next(error);
        }
    }

    static async mockingCouriers(req, res, next) {
        try {
            const couriers = MockService.generateMockUsers(req.mockCount, USER_ROLES.COURIER);
            res.status(200).json({ status: "success", payload: couriers });
        } catch (error) {
            next(error);
        }
    }

    static async mockingOrders(req, res, next) {
        try {
            const orders = MockService.generateMockOrders(req.mockCount);
            res.status(200).json({ status: "success", payload: orders });
        } catch (error) {
            next(error);
        }
    }

    static async mockingDeliveries(req, res, next) {
        try {
            const deliveries = MockService.generateMockDeliveries(req.mockCount);
            res.status(200).json({ status: "success", payload: deliveries });
        } catch (error) {
            next(error);
        }
    }

    static async generateProducts(req, res, next) {
        try {
            const { count, saveToDatabase } = req.body;
            const products = MockService.generateMockProducts(count);

            if (saveToDatabase) {
                const saved = await MockService.saveMockProducts(products);
                return res.status(201).json({
                    status: "success",
                    message: 'Productos guardados en la base de datos',
                    payload: saved
                });
            }

            res.status(200).json({
                status: "success",
                message: 'Productos generados exitosamente',
                payload: products
            });
        } catch (error) {
            next(error);
        }
    }

    static async generateAndInsert(req, res, next) {
        try {
            const { users, couriers, orders, deliveries } = req.body;

            const counts = {
                users: users ?? 5,
                couriers: couriers ?? 3,
                orders: orders ?? 5,
                deliveries: deliveries ?? 5,
            };

            const result = await MockService.insertMockData(counts);
            res.status(201).json({
                status: "success",
                message: 'Datos de prueba insertados correctamente',
                payload: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default MockController;