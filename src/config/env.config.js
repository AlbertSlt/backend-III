import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];
REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

export const config = {
    PORT: process.env.PORT, //|| 3000,
    MONGODB_URI: process.env.MONGODB_URI, // || "mongodb://localhost:27017/mydatabase",
    NODE_ENV: process.env.NODE_ENV, // || "development",
};