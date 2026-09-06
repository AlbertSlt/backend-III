import Delivery from '../models/delivery.model.js';

const DEFAULT_PROJECTION = '-__v';

class DeliveryRepository {
    async findPaginated(filters = {}, { page, limit } = {}) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Delivery.find(filters).select(DEFAULT_PROJECTION).skip(skip).limit(limit),
            Delivery.countDocuments(filters)
        ]);

        return { data, total };
    }

    async getById(id) {
        return await Delivery.findById(id).select(DEFAULT_PROJECTION);
    }

    async updateStatus(id, status) {
        return await Delivery.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select(DEFAULT_PROJECTION);
    }
}

export default new DeliveryRepository();