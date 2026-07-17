import UserModel from '../models/user.model.js';

class UserRepository {
    async find(filters = {}) {
        return await UserModel.find(filters);
    }

    async getById(id) {
        return await UserModel.findById(id);
    }

    async create(userData) {
        return await UserModel.create(userData);
    }

    async update(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default new UserRepository;