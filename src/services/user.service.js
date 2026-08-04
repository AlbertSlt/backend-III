import UserRepository from "../repositories/user.repository.js";
import { AppError, ERROR_CODES } from "../errors/index.js";

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
}

export default new UserService();