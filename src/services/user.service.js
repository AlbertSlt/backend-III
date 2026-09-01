import UserRepository from "../repositories/user.repository.js";
import { AppError, ERROR_CODES } from "../errors/index.js";
import logger from "../config/logger.js";

class UserService {
    async getAllUsers(query) {
        return await UserRepository.find(query);
    }

    async getUserById(id) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new AppError(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }

    async createUser(userData) {
        return await UserRepository.create(userData);
    }

    async updateUser(id, updateData) {
        const user = await UserRepository.update(id, updateData);
        if (!user) {
            throw new AppError(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }

    async deleteUser(id) {
        const user = await UserRepository.delete(id);
        if (!user) {
            throw new AppError(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }

    async addDocument(id, file, type) {
        if (!file) {
            throw new AppError(ERROR_CODES.FILE_REQUIRED);
        }

        const existingUser = await UserRepository.getById(id);
        if (!existingUser) {
            throw new AppError(ERROR_CODES.USER_NOT_FOUND);
        }

        const documentData = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            type
        };

        const updatedUser = await UserRepository.addDocument(id, documentData);

        logger.info(`Documento '${type}' cargado para el usuario ${id}: ${file.originalname}`);

        return updatedUser;
    }
}

export default new UserService();