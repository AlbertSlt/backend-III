export const validateUser = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            statusCode: 400,
            message: "first_name, last_name, email y password son obligatorios",
        });
    }
    next();
};