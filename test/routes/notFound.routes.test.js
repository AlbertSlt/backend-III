import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Rutas inexistentes", function () {

    describe("GET a una ruta que no existe", function () {
        it("responde 404 ROUTE_NOT_FOUND con el formato de error estándar", async function () {
            const response = await request(app).get("/api/no-existe");

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property("status", "error");
            expect(response.body).to.have.property("error", "ROUTE_NOT_FOUND");
            expect(response.body).to.have.property("message");
        });
    });

    describe("POST a una ruta que no existe", function () {
        it("también responde 404 ROUTE_NOT_FOUND sin importar el método HTTP", async function () {
            const response = await request(app).post("/api/tampoco-existe");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ROUTE_NOT_FOUND");
        });
    });
});