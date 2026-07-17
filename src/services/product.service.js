import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../utils/constants.js';

class ProductService {
    async getAllProducts() {
        const filter = { status: PRODUCT_STATUS.AVAILABLE };
        return await ProductRepository.getAll(filter);
    }

    async getProductById(id) {
        return await ProductRepository.getById(id);
    }

    async createProduct(productData) {
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, updateData) {
        return await ProductRepository.update(id, updateData);
    }

    async deleteProduct(id) {
        return await ProductRepository.delete(id);
    }
}

export default new ProductService();