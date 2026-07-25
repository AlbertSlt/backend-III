import MockService from '../services/mock.service.js';
import { USER_ROLES } from '../../utils/constants.js';

class MockController {
    static async mockingUsers(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? parseInt(rawCount) : 10;

            if (isNaN(count) || count <= 0 || count > 1000) {
                return res.status(400).json({ statusCode: 400, message: "counrt debe ser un número positivo menor a 1000" });
            }

            const users = MockService.generateMockUsers(count, USER_ROLES.USER);
            res.status(200).json(users);
        } catch (error) {
            console.warn('Error generando mock users:', error);
            res.status(500).json({ statusCode: 500, message: 'Error generando mock users' });
        }
    }

    static async mockingCouriers(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? parseInt(rawCount) : 10;

            if (isNaN(count) || count <= 0 || count > 1000) {
                return res.status(400).json({ statusCode: 400, message: "count debe ser un número positivo menor a 1000" });
            }

            const couriers = MockService.generateMockUsers(count, USER_ROLES.COURIER);
            res.status(200).json(couriers);
        } catch (error) {
            console.warn('Error generando mock couriers:', error);
            res.status(500).json({ statusCode: 500, message: 'Error generando mock couriers' });
        }
    }

    static async mockingOrders(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? parseInt(rawCount) : 10;

            if (isNaN(count) || count <= 0 || count > 1000) {
                return res.status(400).json({ statusCode: 400, message: "Count debe ser un numero positivo menor a 1000" });
            }

            const orders = MockService.generateMockOrders(count);
            res.status(200).json(orders);
        } catch (error) {
            console.warn('Error generando mock orders:', error);
            res.status(500).json({ statusCode: 500, message: 'Error generando mock orders' });
        }
    }

    static async mockingDeliveries(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? parseInt(rawCount) : 10;

            if (isNaN(count) || count <= 0 || count > 1000) {
                return res.status(400).json({ statusCode: 400, message: "Count debe ser un numero positivo menor a 1000" });
            }

            const deliveries = MockService.generateMockDeliveries(count);
            res.status(200).json(deliveries);
        } catch (error) {
            console.warn('Error generando mock deliveries:', error);
            res.status(500).json({ statusCode: 500, message: 'Error generando mock deliveries' });
        }
    }

    static async generateProducts(req, res) {
        try {
            const { count, saveToDatabase } = req.body;
            const products = MockService.generateMockProducts(count);

            if (saveToDatabase) {
                await MockService.saveMockProducts(products);
                return res.status(201).json({ statusCode: 201, message: 'Productos guardados en la base de datos', products }); 
            }

            res.status(200).json({ statusCode: 200, message: 'Productos generados exitosamente', products });
        } catch (error) {
            console.warn('Error generando mock products:', error);
            res.status(500).json({ statusCode: 500, message: 'Error generando mock products' });
        }
    }

    static async generateAndInsert(req, res) {
        try {
            const { users, couriers, orders, deliveries } = req.body;

            const counts = {
                users: users !== undefined ? parseInt(users) : 5,
                couriers: couriers !== undefined ? parseInt(couriers) : 3,
                orders: orders !== undefined ? parseInt(orders) : 5,
                deliveries: deliveries !== undefined ? parseInt(deliveries) : 5,
            };

            const invalid = Object.entries(counts).some(
                ([, value]) => isNaN(value) || value < 0 || value > 1000
            );
            if (invalid) {
                return res.status(400).json({ statusCode: 400, message: 'Todos los valores deben ser números entre 0 y 1000' });
            }

            const result = await MockService.insertMockData(counts);
            res.status(201).json({ statusCode: 201, message: 'Datos de prueba insertados correctamente', inserted: result });
        } catch (error) {
            console.warn('Error al insertar datos de prueba', error);
            res.status(500).json({ statusCode: 500, message: 'Error interno del servidor' });
        }
    }
}

export default MockController;