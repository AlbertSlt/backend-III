import UserService from "../services/user.service.js";

class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserService.getAll(req.query);
            res.status(200).json(users);
        }
        catch (error) {
            console.warn("Error al obtener los usuarios", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.warn("Error al obtener el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async create(req, res) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            console.warn("Error al crear el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.update(id, req.body);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.warn("Error al actualizar el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.delete(id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ message: "Usuario eliminado" });
        } catch (error) {
            console.warn("Error al eliminar el usuario", error);
            res.status(500).json({ statusCode: 500, message: "Error interno del servidor" });
        }
    }

}

export default UserController;
