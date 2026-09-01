import Order from '../models/order.model.js';

const DEFAULT_PROJECTION = '-__v';

class OrderRepository {
    async getAll(filter = {}) {
        return await Order.find(filter).select(DEFAULT_PROJECTION);
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