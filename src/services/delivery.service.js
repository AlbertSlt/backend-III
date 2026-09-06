import DeliveryRepository from '../repositories/delivery.repository.js';
import { DELIVERY_STATUS } from '../utils/constants.js';
import { AppError, ERROR_CODES } from '../errors/index.js';
import { parsePagination, buildPaginationMeta } from '../utils/pagination.js';

class DeliveryService {
    async getAllDeliveries(query) {
        const { page, limit, filters } = parsePagination(query);

        const { data, total } = await DeliveryRepository.findPaginated(filters, { page, limit });

        return {
            data,
            meta: buildPaginationMeta({ page, limit, total })
        };
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