import DeliveryRepository from '../repositories/delivery.repository.js';
import { DELIVERY_STATUS } from '../utils/constants.js';
import { AppError, ERROR_CODES } from '../errors/index.js';

class DeliveryService {
    async getAllDeliveries(query) {
        return await DeliveryRepository.getAll(query);
    }

    async getDeliveryById(id) {
        const delivery = await DeliveryRepository.getById(id);
        if (!delivery) {
            throw new AppError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }
        return delivery;
    }

    async updateDeliveryStatus(id, status) {
        if (!Object.values(DELIVERY_STATUS).includes(status)) {
            throw new AppError(
                ERROR_CODES.INVALID_DELIVERY_STATUS,
                `El estado '${status}' no es válido. Estados permitidos: ${Object.values(DELIVERY_STATUS).join(', ')}`
            );
        }

        const delivery = await DeliveryRepository.updateStatus(id, status);
        if (!delivery) {
            throw new AppError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }
        return delivery;
    }
}

export default new DeliveryService();