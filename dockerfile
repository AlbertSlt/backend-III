# ---------------------------------------------------------------------------
# Ship-POW! API - Dockerfile
# ---------------------------------------------------------------------------

# Imagen base: Node 22 sobre Alpine (liviana). Mongoose 9.x requiere Node >= 20.19.
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /shippow

# Copiamos primero los archivos de dependencias (package.json + package-lock.json)
COPY package.json package-lock.json ./

# npm ci instala exactamente lo que dice package-lock.json (build reproducible).
# --omit=dev excluye devDependencies (mocha, chai, supertest, faker): no hacen
# falta para correr la API en produccion.
RUN npm ci --omit=dev

# Copiamos el resto del codigo fuente. Lo que no deba entrar (node_modules,.env, logs, uploads locales, etc) queda filtrado por .dockerignore.
COPY . .

# Puerto en el que escucha la app (definido por PORT en env.config.js).

EXPOSE 3000

# Entrypoint de produccion (agregado como script "start" en package.json).
CMD ["npm", "start"]