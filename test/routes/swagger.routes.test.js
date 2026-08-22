import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Swagger Docs", function () {

    describe("GET /api/docs", function () {
        it("responde con un status válido para servir la documentación", async function () {
            const response = await request(app).get("/api/docs/");

            // swagger-ui-express puede responder 200 (HTML servido) o una
            // redirección (301/302) según la versión y si falta la barra final.
            expect(response.status).to.be.oneOf([200, 301, 302]);
        });

        it("el contenido servido es HTML cuando responde 200", async function () {
            const response = await request(app).get("/api/docs/");

            if (response.status === 200) {
                expect(response.headers["content-type"]).to.match(/html/);
            } else {
                this.skip();
            }
        });
    });
});