import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import ProductModel from "../../src/models/product.model.js";

function uniqueCode(prefix = "TEST-PROD") {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function buildProductPayload(overrides = {}) {
    return {
        name: "Producto de prueba",
        description: "Producto creado por el test funcional de products.routes",
        price: 1500,
        code: uniqueCode(),
        stock: 10,
        ...overrides
    };
}

describe("Products API", function () {
    const createdProductIds = [];
    let testProduct;

    before(async function () {
        testProduct = await ProductModel.create(buildProductPayload({ name: "Producto Base" }));
        createdProductIds.push(testProduct._id);
    });

    after(async function () {
        await ProductModel.deleteMany({ _id: { $in: createdProductIds } });
    });

    describe("GET /api/products", function () {
        it("responde 200 con un array de productos disponibles en el payload", async function () {
            const response = await request(app).get("/api/products");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/products/:id", function () {
        it("responde 200 con el producto cuando el id existe", async function () {
            const response = await request(app).get(`/api/products/${testProduct._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property("_id", testProduct._id.toString());
            expect(response.body.payload).to.have.property("code", testProduct.code);
        });

        it("responde 404 PRODUCT_NOT_FOUND si el id tiene formato válido pero no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app).get(`/api/products/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app).get("/api/products/no-es-un-id");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });

    describe("POST /api/products", function () {
        it("crea un producto con datos válidos y responde 201", async function () {
            const payload = buildProductPayload();

            const response = await request(app).post("/api/products").send(payload);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("code", payload.code);
            expect(response.body.payload).to.have.property("price", payload.price);

            createdProductIds.push(response.body.payload._id);
        });

        it("responde 400 VALIDATION_ERROR si falta un campo obligatorio", async function () {
            const payload = buildProductPayload();
            delete payload.price;

            const response = await request(app).post("/api/products").send(payload);

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("VALIDATION_ERROR");
        });

        it("responde 409 DUPLICATE_KEY si el code ya existe", async function () {
            const response = await request(app)
                .post("/api/products")
                .send(buildProductPayload({ code: testProduct.code }));

            expect(response.status).to.equal(409);
            expect(response.body.error).to.equal("DUPLICATE_KEY");
        });
    });

    describe("PUT /api/products/:id", function () {
        it("actualiza el producto y responde 200", async function () {
            const response = await request(app)
                .put(`/api/products/${testProduct._id}`)
                .send({ stock: 42 });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("stock", 42);
        });

        it("responde 404 PRODUCT_NOT_FOUND si el producto no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app)
                .put(`/api/products/${nonExistentId}`)
                .send({ stock: 5 });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });
    });

    describe("DELETE /api/products/:id", function () {
        it("elimina el producto y responde 200", async function () {
            const productToDelete = await ProductModel.create(buildProductPayload({ name: "Para borrar" }));

            const response = await request(app).delete(`/api/products/${productToDelete._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");

            const stillExists = await ProductModel.findById(productToDelete._id);
            expect(stillExists).to.be.null;
        });

        it("responde 404 PRODUCT_NOT_FOUND si el producto ya no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app).delete(`/api/products/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });
    });
});