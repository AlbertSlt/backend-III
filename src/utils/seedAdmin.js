import UserService from "../services/user.service.js";
import { USER_ROLES } from "./constants.js";
import { config } from "../config/env.config.js";
import logger from "../config/logger.js";

export async function seedAdmin() {

    if (!config.SEED_ADMIN) {
        return;
    }

    if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
        logger.warning(
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
            logger.info(`Usuario Admin creado: ${config.ADMIN_EMAIL}`);
        } else {
            logger.info(`El usuario Admin (${config.ADMIN_EMAIL}) ya existe, no se crea de nuevo.`);
        }
    } catch (error) {
        logger.error(`Error al crear el usuario admin: ${error.message}`);
    }
}