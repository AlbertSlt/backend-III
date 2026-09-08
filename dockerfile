# ---------------------------------------------------------------------------
# Ship-POW! API - Dockerfile (multi-stage)
# ---------------------------------------------------------------------------

# --- Stage 1: deps ----------------------------------------------------------
# Instala unicamente las dependencias de produccion en una etapa separada.
# Esta capa se cachea de forma independiente del codigo fuente: mientras no
# cambien package.json / package-lock.json, Docker reutiliza esta etapa
# entera aunque el codigo cambie constantemente.
FROM node:22-alpine AS deps

WORKDIR /shippow

COPY package.json package-lock.json ./

# npm ci instala exactamente lo que dice package-lock.json (build reproducible).
# --omit=dev excluye devDependencies (mocha, chai, supertest): no hacen falta
# para correr la API en produccion.
RUN npm ci --omit=dev


# --- Stage 2: runtime ---------------------------------------------------
# Imagen final: liviana, sin cache de npm ni devDependencies, solo lo
# necesario para ejecutar la API.
FROM node:22-alpine AS runtime

WORKDIR /shippow

# Copiamos SOLO el node_modules ya resuelto de la etapa "deps", no
# arrastramos el cache de npm ni herramientas de instalacion a la imagen final.
COPY --from=deps /shippow/node_modules ./node_modules

# Copiamos el codigo fuente. Lo que no deba entrar (node_modules propio,
# .env*, logs, uploads locales, etc) queda filtrado por .dockerignore.
COPY . .

# Puerto en el que escucha la app (definido por PORT en env.config.js).
EXPOSE 3000

# Entrypoint de produccion (script "start" en package.json).
CMD ["npm", "start"]