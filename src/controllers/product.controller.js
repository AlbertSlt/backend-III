import ProductService from '../services/product.service.js';

class ProductController {
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Error interno del servidor"
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ statusCode: 404, message: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error("Error al obtener producto:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Error interno del servidor"
            });
        }
    }

    static async createProduct(req, res) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Error interno del servidor"
            });
        }
    }

    static async updateProduct(req, res) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ statusCode: 404, message: 'Producto no encontrado' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Error interno del servidor"
            });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ statusCode: 404, message: 'Producto no encontrado' });
            }
            res.status(200).json({
                statusCode: 200,
                message: 'Producto eliminado correctamente'
            });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Error interno del servidor"
            });
        }
    }
}

export default ProductController;