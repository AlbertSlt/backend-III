import Product from '../models/product.model.js';

const DEFAULT_PROJECTION = '-__v';

class ProductRepository {
    async findPaginated(filters = {}, { page, limit } = {}) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Product.find(filters).select(DEFAULT_PROJECTION).skip(skip).limit(limit),
            Product.countDocuments(filters)
        ]);

        return { data, total };
    }

    async getById(id) {
        return await Product.findById(id).select(DEFAULT_PROJECTION);
    }

    async create(productData) {
        return await Product.create(productData);
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true }).select(DEFAULT_PROJECTION);
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductRepository();