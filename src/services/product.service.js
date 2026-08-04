import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../utils/constants.js';
import { AppError, ERROR_CODES } from '../errors/index.js';

class ProductService {
    async getAllProducts() {
        const filter = { status: PRODUCT_STATUS.AVAILABLE };
        return await ProductRepository.getAll(filter);
    }

    async getProductById(id) {
        const product = await ProductRepository.getById(id);
        if (!product) {
            throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
        }
        return product;
    }

    async createProduct(productData) {
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, updateData) {
        const product = await ProductRepository.update(id, updateData);
        if (!product) {
            throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
        }
        return product;
    }

    async deleteProduct(id) {
        const product = await ProductRepository.delete(id);
        if (!product) {
            throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
        }
        return product;
    }
}

export default new ProductService();