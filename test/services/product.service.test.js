import { expect } from 'chai';
import ProductService from '../../src/services/product.service.js';
import { PRODUCT_STATUS } from '../../src/utils/constants.js';

describe('test unitario sobre ProductService', function () {

    let productId;

    before(async function () {
        const created = await ProductService.createProduct({
            name: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            code: `TEST-${Date.now()}`,
            stock: 10,
            status: PRODUCT_STATUS.AVAILABLE
        });
        productId = created._id.toString();
    });

    after(async function () {
        // si el test de "eliminar" no llego a correr esto evita dejar basura
        await ProductService.deleteProduct(productId).catch(() => {});
    });

        //test obtener todos
    it('Se deben obtener todos los productos paginados, con su metadata', async function () {
        const result = await ProductService.getAllProducts();

        expect(result).to.have.property('data').that.is.an('array');
        expect(result).to.have.property('meta');
        expect(result.meta).to.have.property('page', 1);
        expect(result.meta).to.have.property('limit', 10);
        expect(result.meta).to.have.property('total').that.is.a('number');
        expect(result.meta).to.have.property('totalPages').that.is.a('number');
    });

    it('Se debe obtener un producto por su id', async function () {
        const product = await ProductService.getProductById(productId);
        expect(product).to.be.an('object').and.to.have.property('_id');
        expect(product._id.toString()).to.equal(productId);
    });

    it('Se debe crear un nuevo producto en la base de datos', async function () {
        const newProductData = {
            name: 'Otro producto de prueba',
            description: 'Descripcion 2',
            price: 200,
            code: `TEST-${Date.now()}-2`,
            stock: 5,
            status: PRODUCT_STATUS.AVAILABLE
        };
        const createdProduct = await ProductService.createProduct(newProductData);
        expect(createdProduct).to.be.an('object');
        expect(createdProduct).to.have.property('_id');

        // limpieza inmediata: este producto no se reutiliza en otros tests
        await ProductService.deleteProduct(createdProduct._id);
    });

    it('Se debe actualizar un producto', async function () {
        const updated = await ProductService.updateProduct(productId, { name: 'Producto actualizado' });
        expect(updated).to.be.an('object');
        expect(updated.name).to.equal('Producto actualizado');
    });

    it('Se debe eliminar un producto', async function () {
        const deleted = await ProductService.deleteProduct(productId);
        expect(deleted).to.be.an('object');

        const error = await ProductService.getProductById(productId).catch((err) => err);
        expect(error).to.have.property('code', 'PRODUCT_NOT_FOUND');
    });

    
});