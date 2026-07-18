import UserModel from '../models/user.model.js';

const DEFAULT_PROJECTION = '-__v';

class UserRepository {
    async find(filters = {}) {
        return await UserModel.find(filters).select(DEFAULT_PROJECTION);
    }

    async getById(id) {
        return await UserModel.findById(id).select(DEFAULT_PROJECTION);
    }

    async create(userData) {
        return await UserModel.create(userData);
    }

    async update(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select(DEFAULT_PROJECTION);
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default new UserRepository();