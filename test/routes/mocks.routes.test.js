import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";
import DeliveryModel from "../../src/models/delivery.model.js";

describe("Mocks API", function () {

    describe("GET /api/mocks/mocking-users", function () {
        it("responde 200 con un array de usuarios simulados (sin guardarlos en la base)", async function () {
            const response = await request(app).get("/api/mocks/mocking-users?count=5");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array").with.lengthOf(5);
            expect(response.body.payload[0]).to.have.property("email");
            expect(response.body.payload[0]).to.have.property("role", "user");
        });

        it("usa 10 como valor por defecto si no se envía count", async function () {
            const response = await request(app).get("/api/mocks/mocking-users");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.lengthOf(10);
        });

        it("responde 400 INVALID_MOCK_AMOUNT si count es inválido", async function () {
            const response = await request(app).get("/api/mocks/mocking-users?count=-5");

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("INVALID_MOCK_AMOUNT");
        });

        it("responde 400 INVALID_MOCK_AMOUNT si count supera el máximo permitido", async function () {
            const response = await request(app).get("/api/mocks/mocking-users?count=5000");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_MOCK_AMOUNT");
        });
    });

    describe("POST /api/mocks/generate-data", function () {

        after(async function () {
            //limpiamos las 3 colecciones por completo al terminar
            await Promise.all([
                UserModel.deleteMany({}),
                OrderModel.deleteMany({}),
                DeliveryModel.deleteMany({})
            ]);
        });

        it("inserta datos reales en la base y responde 201 con el resumen", async function () {
            const response = await request(app)
                .post("/api/mocks/generate-data")
                .send({ users: 2, couriers: 1, orders: 2, deliveries: 1 });

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.deep.equal({
                users: 2,
                couriers: 1,
                orders: 2,
                deliveries: 1
            });
        });

        it("responde con body vacío usando los valores por defecto del controller", async function () {
            const response = await request(app).post("/api/mocks/generate-data").send({});

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.deep.equal({
                users: 5,
                couriers: 3,
                orders: 5,
                deliveries: 5
            });
        });

        it("responde 400 INVALID_MOCK_AMOUNT si un campo es negativo", async function () {
            const response = await request(app)
                .post("/api/mocks/generate-data")
                .send({ users: -3 });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_MOCK_AMOUNT");
        });

        it("responde 400 INVALID_MOCK_AMOUNT si un campo no es entero", async function () {
            const response = await request(app)
                .post("/api/mocks/generate-data")
                .send({ orders: 2.5 });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_MOCK_AMOUNT");
        });
    });
});