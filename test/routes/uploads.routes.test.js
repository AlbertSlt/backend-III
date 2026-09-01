import { expect } from "chai";
import request from "supertest";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import mongoose from "mongoose";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";
import { DOCUMENT_TYPES } from "../../src/utils/constants.js";

const TEST_EMAIL_DOMAIN = "@shipPOW-test.com";

// IMPORTANTE: usamos Buffer en memoria en vez de pasarle la ruta del archivo
// a .attach(). Pasar una ruta hace que superagent cree un fs.ReadStream, y en
// Windows esa combinación (ReadStream + DelayedStream + CombinedStream de
// form-data) puede abortar la petición espuriamente ("Error: Aborted"),
// incluso en casos exitosos. Attachear un Buffer evita ese pipeline.
const VALID_FIXTURE_PATH = path.resolve(process.cwd(), "test/fixtures/document.pdf");
const INVALID_FIXTURE_PATH = path.resolve(process.cwd(), "test/fixtures/invalid.txt");
const VALID_FIXTURE_BUFFER = fsSync.readFileSync(VALID_FIXTURE_PATH);
const INVALID_FIXTURE_BUFFER = fsSync.readFileSync(INVALID_FIXTURE_PATH);

// Compara el listado de una carpeta antes/después de correr toda la suite
// para detectar archivos "huérfanos": Multer los escribe en disco tan pronto
// pasa su fileFilter, ANTES de que corran nuestras validaciones posteriores
// (tipo de documento inválido, id inválido, entidad inexistente). Cualquiera
// de esos casos puede terminar en un error 400/404 dejando el archivo ya
// guardado y sin asociar a nada. Es una limitación conocida (mencionada en
// el material del curso como mejora fuera de alcance de esta pre-entrega);
// acá comparamos el estado de la carpeta antes/después de TODA la suite
// para detectar y borrar cualquier archivo nuevo, sin importar qué test
// específico lo generó.
async function listFiles(folder) {
    try {
        return await fs.readdir(path.resolve(process.cwd(), folder));
    } catch {
        return [];
    }
}

function findNewFiles(folder, before, after) {
    return after.filter((file) => !before.includes(file)).map((file) => path.join(folder, file));
}

async function createTestUser() {
    return await UserModel.create({
        first_name: "Upload",
        last_name: "Tester",
        email: `upload-owner-${Date.now()}-${Math.floor(Math.random() * 10000)}${TEST_EMAIL_DOMAIN}`,
        password: "pass123"
    });
}

async function createTestOrder(userId) {
    return await OrderModel.create({
        user: userId,
        items: [{
            product: new mongoose.Types.ObjectId(),
            quantity: 1
        }],
        address: "Calle de Prueba 456"
    });
}

describe("Uploads API (Multer)", function () {
    let testUser;
    let testOrder;
    let documentsBefore;
    let proofsBefore;

    before(async function () {
        testUser = await createTestUser();
        testOrder = await createTestOrder(testUser._id);
        documentsBefore = await listFiles("uploads/documents");
        proofsBefore = await listFiles("uploads/proofs");
    });

    after(async function () {
        await OrderModel.deleteMany({ user: testUser._id });
        await UserModel.deleteMany({
            email: new RegExp(`${TEST_EMAIL_DOMAIN.replace(".", "\\.")}$`)
        });

        // Cualquier archivo que haya aparecido en cualquiera de las dos
        // carpetas durante la suite (con éxito o con error) se considera
        // generado por los tests y se borra, para no ensuciar uploads/.
        const documentsAfter = await listFiles("uploads/documents");
        const proofsAfter = await listFiles("uploads/proofs");

        const filesToDelete = [
            ...findNewFiles("uploads/documents", documentsBefore, documentsAfter),
            ...findNewFiles("uploads/proofs", proofsBefore, proofsAfter)
        ];

        await Promise.all(
            filesToDelete.map((filePath) =>
                fs.unlink(path.resolve(process.cwd(), filePath)).catch(() => {})
            )
        );
    });

    describe("POST /api/users/:id/documents", function () {
        it("carga un documento válido y lo asocia al usuario, respondiendo 200", async function () {
            const response = await request(app)
                .post(`/api/users/${testUser._id}/documents`)
                .field("type", DOCUMENT_TYPES.USER_DOCUMENT)
                .attach("document", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("documents").that.is.an("array");

            const lastDocument = response.body.payload.documents.at(-1);
            expect(lastDocument).to.include({
                originalName: "document.pdf",
                mimeType: "application/pdf",
                type: DOCUMENT_TYPES.USER_DOCUMENT
            });
            expect(lastDocument).to.have.property("path");
        });

        it("responde 400 FILE_REQUIRED si no se adjunta ningún archivo", async function () {
            const response = await request(app)
                .post(`/api/users/${testUser._id}/documents`)
                .field("type", DOCUMENT_TYPES.USER_DOCUMENT);

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("FILE_REQUIRED");
        });

        it("responde 400 INVALID_DOCUMENT_TYPE si el tipo de documento no es válido", async function () {
            const response = await request(app)
                .post(`/api/users/${testUser._id}/documents`)
                .field("type", "tipo_inventado")
                .attach("document", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_DOCUMENT_TYPE");
        });

        it("responde 400 INVALID_FILE_TYPE si el archivo no es de un tipo permitido", async function () {
            const response = await request(app)
                .post(`/api/users/${testUser._id}/documents`)
                .field("type", DOCUMENT_TYPES.USER_DOCUMENT)
                .attach("document", INVALID_FIXTURE_BUFFER, "invalid.txt");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_FILE_TYPE");
        });

        it("responde 404 USER_NOT_FOUND si el usuario no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";

            const response = await request(app)
                .post(`/api/users/${nonExistentId}/documents`)
                .field("type", DOCUMENT_TYPES.USER_DOCUMENT)
                .attach("document", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");

            // Multer ya guardó el archivo en disco antes de que el service
            // detecte que el usuario no existe. Ese huérfano lo limpia el
            // after() global de la suite (ver findNewFiles/listFiles arriba).
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app)
                .post("/api/users/no-es-un-id/documents")
                .field("type", DOCUMENT_TYPES.USER_DOCUMENT)
                .attach("document", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });

    describe("POST /api/orders/:id/proof", function () {
        it("carga un comprobante válido y lo asocia al pedido, respondiendo 200", async function () {
            const response = await request(app)
                .post(`/api/orders/${testOrder._id}/proof`)
                .attach("proof", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("proof");
            expect(response.body.payload.proof).to.include({
                originalName: "document.pdf",
                mimeType: "application/pdf",
                type: DOCUMENT_TYPES.DELIVERY_PROOF
            });
        });

        it("responde 400 FILE_REQUIRED si no se adjunta ningún archivo", async function () {
            const response = await request(app).post(`/api/orders/${testOrder._id}/proof`);

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("FILE_REQUIRED");
        });

        it("responde 400 INVALID_FILE_TYPE si el archivo no es de un tipo permitido", async function () {
            const response = await request(app)
                .post(`/api/orders/${testOrder._id}/proof`)
                .attach("proof", INVALID_FIXTURE_BUFFER, "invalid.txt");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_FILE_TYPE");
        });

        it("responde 404 ORDER_NOT_FOUND si el pedido no existe", async function () {
            const nonExistentId = "64b8f1e2c9e1f5a1b2c3d4e5";

            const response = await request(app)
                .post(`/api/orders/${nonExistentId}/proof`)
                .attach("proof", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        });

        it("responde 400 INVALID_ID si el id no tiene formato de ObjectId", async function () {
            const response = await request(app)
                .post("/api/orders/no-es-un-id/proof")
                .attach("proof", VALID_FIXTURE_BUFFER, "document.pdf");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });
});