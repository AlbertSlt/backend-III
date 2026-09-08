import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Health API", function () {
    describe("GET /health", function () {
        it("responde 200 con el estado de la API", async function () {
            const response = await request(app).get("/health");

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("status", "success");
            expect(response.body).to.have.property("environment");
            expect(response.body).to.have.property("uptime");
            expect(response.body.uptime).to.be.a("number");
            expect(response.body).to.have.property("timestamp");
        });

        it("no expone informacion sensible (uri de base de datos, credenciales, etc)", async function () {
            const response = await request(app).get("/health");

            const bodyAsText = JSON.stringify(response.body);
            expect(bodyAsText).to.not.include("mongodb://");
            expect(bodyAsText).to.not.include("ADMIN_PASSWORD");
        });
    });
});