import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";
import DeliveryModel from "../../src/models/delivery.model.js";
import mongoose from "mongoose";
import { DELIVERY_STATUS } from "../../src/utils/constants.js";

const TEST_EMAIL_DOMAIN = "@deliveryPOW-test.com";

async function createTestUser() {
    const user = await UserModel.create({
        first_name: "Delivery",
        last_name: "Tester",
        email: `delivery-owner-${Date.now()}-${Math.floor(Math.random() * 10000)}${TEST_EMAIL_DOMAIN}`,
        password: "pass123"
    });
    return user;
}

async function createTestOrder(userId) {
    const order = await OrderModel.create({
        user: userId,
        items: [{
            product: new mongoose.Types.ObjectId(),
            quantity: 1
        }],
        address: "Calle de Prueba 456"
    });
    return order;
}

async function createTestDelivery(orderId, overrides = {}) {
    const delivery = await DeliveryModel.create({
        order: orderId,
        ...overrides
    });
    return delivery;
}

describe("Deliveries API", function () {
    let testUser;
    let testOrder;
    let testDelivery;

    before(async function () {
        testUser = await createTestUser();
        testOrder = await createTestOrder(testUser._id);
        testDelivery = await createTestDelivery(testOrder._id);
    });

    after(async function () {
        await DeliveryModel.deleteMany({ order: testOrder._id });
        await OrderModel.deleteMany({ user: testUser._id });
        await UserModel.deleteMany({
            email: new RegExp(`${TEST_EMAIL_DOMAIN.replace(".", "\\.")}$`)
        });
    });

    describe("GET /api/deliveries", function () {
        it("responde 200 con un array de entregas en el payload", async function () {
            const response = await request(app).get("/api/deliveries");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/deliveries/:id", function () {
        it("responde 200 con la entrega cuando el id existe", async function () {
            const response = await request(app).get(`/api/deliveries/${testDelivery._id}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property("_id", testDelivery._id.toString());
            expect(response.body.payload).to.have.property("order", testOrder._id.toString());
            expect(response.body.payload).to.have.property("status", DELIVERY_STATUS.ASSIGNED);
        });

        it("responde 404 DELIVERY_NOT_FOUND si el id tiene formato válido pero no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app).get(`/api/deliveries/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app).get("/api/deliveries/no-es-un-id");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });

    describe("PATCH /api/deliveries/:id/status", function () {
        let deliveryToUpdate;

        beforeEach(async function () {
            deliveryToUpdate = await createTestDelivery(testOrder._id);
        });

        it("actualiza el estado de la entrega y responde 200", async function () {
            const response = await request(app)
                .patch(`/api/deliveries/${deliveryToUpdate._id}/status`)
                .send({ status: DELIVERY_STATUS.IN_TRANSIT });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload.status).to.equal(DELIVERY_STATUS.IN_TRANSIT);
        });

        it("responde 400 INVALID_DELIVERY_STATUS si el estado no es válido", async function () {
            const response = await request(app)
                .patch(`/api/deliveries/${deliveryToUpdate._id}/status`)
                .send({ status: "en_camino_a_marte" });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_DELIVERY_STATUS");
        });

        it("responde 404 DELIVERY_NOT_FOUND si la entrega no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app)
                .patch(`/api/deliveries/${nonExistentId}/status`)
                .send({ status: DELIVERY_STATUS.COMPLETED });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        });
    });
});