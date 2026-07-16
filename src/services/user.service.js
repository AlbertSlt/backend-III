import UserRepository from '../repositories/user.repository.js';

class UserService {
    static async getAll() {
            return await UserRepository.find();
        }
    }

    export default UserService;