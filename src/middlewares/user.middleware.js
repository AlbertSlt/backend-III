export const validateUser = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "El nombre y el email son obligatorios" });
    }
    next();
};