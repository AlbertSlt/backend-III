import OrderRepository from '../repositories/order.repository.js';
import { ORDER_STATUS } from '../utils/constants.js';
import { AppError, ERROR_CODES } from '../errors/index.js';

class OrderService {
    async getAllOrders(query) {
        return await OrderRepository.getAll(query);
    }

    async getOrderById(id) {
        const order = await OrderRepository.getById(id);
        if (!order) {
            throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        return order;
    }

    async updateOrderStatus(id, status) {
        if (!Object.values(ORDER_STATUS).includes(status)) {
            throw new AppError(
                ERROR_CODES.INVALID_ORDER_STATUS,
                `El estado '${status}' no es válido. Estados permitidos: ${Object.values(ORDER_STATUS).join(', ')}`
            );
        }

        const order = await OrderRepository.updateStatus(id, status);
        if (!order) {
            throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        return order;
    }
}

export default new OrderService();