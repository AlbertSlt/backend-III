import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Logger API", function () {

    describe("GET /api/logger-test", function () {
        it("responde 200 y confirma que los logs se generaron correctamente", async function () {
            const response = await request(app).get("/api/logger-test");

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("status", "success");
            expect(response.body).to.have.property("message", "Logs generados correctamente");
        });
    });
});