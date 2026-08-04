import ProductService from '../services/product.service.js';

class ProductController {
    static async getAllProducts(req, res, next) {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json({ status: "success", payload: products });
        } catch (error) {
            next(error);
        }
    }

    static async getProductById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            next(error);
        }
    }

    static async createProduct(req, res, next) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json({ status: "success", payload: newProduct });
        } catch (error) {
            next(error);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json({ status: "success", payload: updatedProduct });
        } catch (error) {
            next(error);
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ status: "success", message: "Producto eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;