import UserService from "../services/user.service.js";

class UserController {
    static async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers(req.query);
            res.status(200).json({ status: "success", payload: users });
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            res.status(200).json({ status: "success", payload: user });
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req, res, next) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({ status: "success", payload: user });
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.updateUser(id, req.body);
            res.status(200).json({ status: "success", payload: user });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.status(200).json({ status: "success", message: "Usuario eliminado" });
        } catch (error) {
            next(error);
        }
    }

    static async uploadDocument(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            const user = await UserService.addDocument(id, req.file, type);
            res.status(200).json({ status: "success", payload: user });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;