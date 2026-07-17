import UserRepository from "../repositories/user.repository.js";

class UserService {
    async getAll(query) {
        return await UserRepository.find(query);
    }

    async getById(id) {
        return await UserRepository.getById(id);
    }

    async create(userData) {
        return await UserRepository.create(userData);
    }

    async update(id, updateData) {
        return await UserRepository.update(id, updateData);
    }

    async delete(id) {
        return await UserRepository.delete(id);
    }
}

export default new UserService();
