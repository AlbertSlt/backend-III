import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";

const TEST_EMAIL_DOMAIN = "@shipPOW-test.com";

function buildUserPayload(overrides = {}) {
    return {
        first_name: "Test",
        last_name: "User",
        email: `user-${Date.now()}-${Math.floor(Math.random() * 10000)}${TEST_EMAIL_DOMAIN}`,
        password: "pass123",
        ...overrides
    };
}

describe("Users API", function () {

    after(async function () {
        // limpieza: borra solo los usuarios generados
        await UserModel.deleteMany({
            email: new RegExp(`${TEST_EMAIL_DOMAIN.replace(".", "\\.")}$`)
        });
    });

    describe("GET /api/users", function () {
        it("responde 200 con un array de usuarios en el payload", async function () {
            const response = await request(app).get("/api/users");

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("status", "success");
            expect(response.body).to.have.property("payload").that.is.an("array");
        });
    });

    describe("POST /api/users", function () {
        it("crea un usuario con datos válidos y responde 201", async function () {
            const payload = buildUserPayload();
            const response = await request(app).post("/api/users").send(payload);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("_id");
            expect(response.body.payload.email).to.equal(payload.email);
            expect(response.body.payload).to.not.have.property("password");
        });

        it("responde 400 VALIDATION_ERROR si faltan campos obligatorios", async function () {
            const response = await request(app)
                .post("/api/users")
                .send({ first_name: "Solo Nombre" });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("VALIDATION_ERROR");
            expect(response.body).to.have.property("message");
        });

        it("responde 409 DUPLICATE_KEY si el email ya existe", async function () {
            const payload = buildUserPayload();
            await request(app).post("/api/users").send(payload);

            const response = await request(app).post("/api/users").send(payload);

            expect(response.status).to.equal(409);
            expect(response.body.error).to.equal("DUPLICATE_KEY");
        });
    });

    describe("GET /api/users/:id", function () {
        let existingUserId;

        before(async function () {
            const response = await request(app).post("/api/users").send(buildUserPayload());
            existingUserId = response.body.payload._id;
        });

        it("responde 200 con el usuario cuando el id existe", async function () {
            const response = await request(app).get(`/api/users/${existingUserId}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property("_id", existingUserId);
        });

        it("responde 404 USER_NOT_FOUND si el id tiene formato válido pero no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5"; // ObjectId válido, no asignado
            const response = await request(app).get(`/api/users/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app).get("/api/users/abc123");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });

    describe("PUT /api/users/:id", function () {
        let userId;

        beforeEach(async function () {
            const response = await request(app).post("/api/users").send(buildUserPayload());
            userId = response.body.payload._id;
        });

        it("actualiza un usuario y responde 200", async function () {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send({ first_name: "Actualizado" });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload.first_name).to.equal("Actualizado");
        });

        it("responde 400 VALIDATION_ERROR si no se envía ningún campo", async function () {
            const response = await request(app).put(`/api/users/${userId}`).send({});

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("VALIDATION_ERROR");
        });
    });

    describe("DELETE /api/users/:id", function () {
        it("elimina un usuario existente y responde 200", async function () {
            const created = await request(app).post("/api/users").send(buildUserPayload());
            const userId = created.body.payload._id;

            const response = await request(app).delete(`/api/users/${userId}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
        });

        it("responde 404 USER_NOT_FOUND si el usuario no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";
            const response = await request(app).delete(`/api/users/${nonExistentId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");
        });
    });
});