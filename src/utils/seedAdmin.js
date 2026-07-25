import UserService from "../services/user.service.js";
import { USER_ROLES } from "./constants.js";
import { config } from "../config/env.config.js";

export async function seedAdmin() {

    if (!config.SEED_ADMIN) {
        return;
    }

    if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
        console.warn(
            "SEED_ADMIN está activado, pero falta ADMIN_EMAIL o ADMIN_PASSWORD en el .env. Se omite el seed."
        );
        return;
    }

    try {
        const adminExists = await UserService.getAllUsers({ email: config.ADMIN_EMAIL });
        if (!adminExists.length) {
            await UserService.createUser({
                first_name: "Admin",
                last_name: "Principal",
                email: config.ADMIN_EMAIL,
                password: config.ADMIN_PASSWORD,
                role: USER_ROLES.ADMIN,
            });
            console.log(`Usuario Admin creado: ${config.ADMIN_EMAIL}`);
        } else {
            console.log(`El usuario Admin (${config.ADMIN_EMAIL}) ya existe, no se crea de nuevo.`);
        }
    } catch (error) {
        console.error("Error al crear el usuario admin:", error);
    }
}