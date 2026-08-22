import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";
import mongoose from "mongoose";
import { ORDER_STATUS } from "../../src/utils/constants.js";

const TEST_EMAIL_DOMAIN = "@shipPOW-test.com";

async function createTestUser() {
    const user = await UserModel.create({
        first_name: "Order",
        last_name: "Tester",
        email: `order-owner-${Date.now()}-${Math.floor(Math.random() * 10000)}${TEST_EMAIL_DOMAIN}`,
        password: "pass123"
    });
    return user;
}

async function createTestOrder(userId, overrides = {}) {
    const order = await OrderModel.create({
        user: userId,
        items: [{
            product: new mongoose.Types.ObjectId(),
            quantity: 2
        }],
        address: "Calle de Prueba 123",
        ...overrides
    });
    return order;
}

describe("Orders API", function () {
    let testUser;
    let testOrder;

    before(async function () {
        testUser = await createTestUser();
        testOrder = await createTestOrder(testUser._id);
    });

    after(async function () {
        await OrderModel.deleteMany({ user: testUser._id });
        await UserModel.deleteMany({
            email: new RegExp(`${TEST_EMAIL_DOMAIN.replace(".", "\\.")}$`)
        });
    });

    describe("GET /api/orders", function () {
        it("responde 200 con un array de pedidos en el payload", async function () {
            const response = await request(app).get("/api/orders");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("Creación de pedidos vía POST /api/mocks/generate-data", function () {
        // No existe POST /api/orders: la única vía de creación real de pedidos es mocks
        it("crea un pedido real en la base con datos válidos y responde 201", async function () {
            const response = await request(app)
                .post("/api/mocks/generate-data")
                .send({ users: 1, couriers: 0, orders: 1, deliveries: 0 });

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("orders", 1);
            expect(response.body.payload).to.have.property("users", 1);
        });
    });

    describe("GET /api/orders/:id", function () {
        it("responde 200 con el pedido cuando el id existe", async function () {
            const response = await request(app).get(`/api/orders/${testOrder._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property("_id", testOrder._id.toString());
            expect(response.body.payload).to.have.property("address", "Calle de Prueba 123");
        });

        it("responde 404 ORDER_NOT_FOUND si el id tiene formato válido pero no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app).get(`/api/orders/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app).get("/api/orders/no-es-un-id");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });

    describe("PATCH /api/orders/:id/status", function () {
        let orderToUpdate;

        beforeEach(async function () {
            orderToUpdate = await createTestOrder(testUser._id);
        });

        it("actualiza el estado del pedido y responde 200", async function () {
            const response = await request(app)
                .patch(`/api/orders/${orderToUpdate._id}/status`)
                .send({ status: ORDER_STATUS.IN_PROGRESS });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload.status).to.equal(ORDER_STATUS.IN_PROGRESS);
        });

        it("responde 400 INVALID_ORDER_STATUS si el estado no es válido", async function () {
            const response = await request(app)
                .patch(`/api/orders/${orderToUpdate._id}/status`)
                .send({ status: "en_camino_al_espacio" });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ORDER_STATUS");
        });
        

        it("responde 404 ORDER_NOT_FOUND si el pedido no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app)
                .patch(`/api/orders/${nonExistentId}/status`)
                .send({ status: ORDER_STATUS.DELIVERED });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        });
    });
});