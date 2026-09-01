import OrderRepository from '../repositories/order.repository.js';
import { ORDER_STATUS, DOCUMENT_TYPES } from '../utils/constants.js';
import { AppError, ERROR_CODES } from '../errors/index.js';
import logger from '../config/logger.js';

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

    async addProof(id, file) {
        if (!file) {
            throw new AppError(ERROR_CODES.FILE_REQUIRED);
        }

        const existingOrder = await OrderRepository.getById(id);
        if (!existingOrder) {
            throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
        }

        const proofData = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            type: DOCUMENT_TYPES.DELIVERY_PROOF
        };

        const updatedOrder = await OrderRepository.setProof(id, proofData);

        logger.info(`Comprobante cargado para el pedido ${id}: ${file.originalname}`);

        return updatedOrder;
    }
}

export default new OrderService();