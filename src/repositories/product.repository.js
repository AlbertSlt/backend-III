import Product from '../models/product.model.js';

class ProductRepository {
    async getAll(filter = {}) {
        return await Product.find(filter).select('-__v');
    }

    async getById(id) {
        return await Product.findById(id).select('-__v');
    }

    async create(productData) {
        return await Product.create(productData);
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductRepository();