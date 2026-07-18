import UserService from "../services/user.service.js";

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers(req.query);
            res.status(200).json(users);
        }
        catch (error) {
            console.warn("Error al obtener los usuarios", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.warn("Error al obtener el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            console.warn("Error al crear el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.updateUser(id, req.body);
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.warn("Error al actualizar el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.deleteUser(id);
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: "Usuario no encontrado" });
            }
            res.status(200).json({ statusCode: 200, message: "Usuario eliminado" });
        } catch (error) {
            console.warn("Error al eliminar el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

}

export default UserController;
