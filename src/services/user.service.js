import UserRepository from "../repositories/user.repository.js";

class UserService {
    async getAllUsers(query) {
        return await UserRepository.find(query);
    }

    async getUserById(id) {
        return await UserRepository.getById(id);
    }

    async createUser(userData) {
        return await UserRepository.create(userData);
    }

    async updateUser(id, updateData) {
        return await UserRepository.update(id, updateData);
    }

    async deleteUser(id) {
        return await UserRepository.delete(id);
    }
}

export default new UserService();
