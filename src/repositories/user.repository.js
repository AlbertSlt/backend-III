import UserModel from '../models/user.model.js';

class UserRepository{
    static async find() { 
        return await UserModel.find();
        
    }
}

export default UserRepository;