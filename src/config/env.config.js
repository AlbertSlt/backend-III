import dotenv from 'dotenv';

// Si NODE_ENV=test cargamos .env.test en vez de .env. El entorno de testing queda separado del de desarrollo (Mongo propia, sin seed de admin, etc).
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];
REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    SEED_ADMIN: process.env.SEED_ADMIN === 'true',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};