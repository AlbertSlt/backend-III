import UserModel from '../models/user.model.js';

const DEFAULT_PROJECTION = '-__v';

class UserRepository {
    async findPaginated(filters = {}, { page, limit } = {}) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            UserModel.find(filters).select(DEFAULT_PROJECTION).skip(skip).limit(limit),
            UserModel.countDocuments(filters)
        ]);

        return { data, total };
    }

    async getById(id) {
        return await UserModel.findById(id).select(DEFAULT_PROJECTION);
    }

    async create(userData) {
        const created = await UserModel.create(userData);
        return await UserModel.findById(created._id).select(DEFAULT_PROJECTION);
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

    async addDocument(id, documentData) {
        return await UserModel.findByIdAndUpdate(
            id,
            { $push: { documents: documentData } },
            { new: true, runValidators: true }
        ).select(DEFAULT_PROJECTION);
    }
}

export default new UserRepository();