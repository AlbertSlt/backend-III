# ShipNow API

API para gestión de productos y usuarios - Backend III

## Instalación y ejecución

1. Clonar el repositorio y entrar a la carpeta:
```bash
   git clone https://github.com/AlbertSlt/backend-III.git
   cd backend-III
```

2. Instalar dependencias:
```bash
   npm install
```

3. Copiar `.env.example` a `.env` y completar los valores:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development

4. Levantar el servidor:
```bash
   npm run dev
```

5. Abrir `http://localhost:3000` para verificar que responde.

## Arquitectura (Service vs Repository)

- **Repository**: solo habla con Mongoose/MongoDB. No sabe nada de reglas de negocio.
- **Service**: contiene la lógica de negocio. Por ejemplo, `ProductService` filtra para devolver solo productos con `status: AVAILABLE`.
- **Controller**: recibe la petición HTTP, llama al Service y devuelve la respuesta. Nunca toca Mongoose directamente.

`UserService` hoy es más simple que `ProductService` porque todavía no tiene reglas de negocio propias (no hay hash de contraseña ni filtros especiales) — eso va a cambiar en próximas clases.