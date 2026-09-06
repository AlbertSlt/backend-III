import Order from '../models/order.model.js';

const DEFAULT_PROJECTION = '-__v';

class OrderRepository {
    async findPaginated(filters = {}, { page, limit } = {}) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Order.find(filters).select(DEFAULT_PROJECTION).skip(skip).limit(limit),
            Order.countDocuments(filters)
        ]);

        return { data, total };
    }

    async getById(id) {
        return await Order.findById(id).select(DEFAULT_PROJECTION);
    }

    async updateStatus(id, status) {
        return await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select(DEFAULT_PROJECTION);
    }

    async setProof(id, proofData) {
        return await Order.findByIdAndUpdate(
            id,
            { proof: proofData },
            { new: true, runValidators: true }
        ).select(DEFAULT_PROJECTION);
    }
}

export default new OrderRepository();