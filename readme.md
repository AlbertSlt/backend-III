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



## Módulo 2 - Mocking y carga de datos de prueba

Genera datos de prueba (usuarios, repartidores, pedidos y entregas) sin cargarlos a mano.

### Instalación

```bash
npm install @faker-js/faker
```

### Endpoints que solo devuelven datos (no se guardan en la base)

- `GET /api/mocks/mocking-users?count=10`
- `GET /api/mocks/mocking-couriers?count=5`
- `GET /api/mocks/mocking-orders?count=10`
- `GET /api/mocks/mocking-deliveries?count=10`

`count` es opcional (por defecto 10, máximo 1000).

### Endpoints que insertan datos en MongoDB

**Productos:**
```bash
POST /api/mocks/generate-products
Body: { "count": 10, "saveToDatabase": true }
```

**Usuarios, repartidores, pedidos y entregas (relacionados entre sí):**
```bash
POST /api/mocks/generate-data
Body: { "users": 5, "couriers": 3, "orders": 5, "deliveries": 5 }
```

Todos los campos del body son opcionales. Este endpoint crea primero los usuarios y repartidores, después los pedidos (asociados a esos usuarios) y por último las entregas (asociadas a esos pedidos y repartidores).

### Nota

Estos endpoints solo deberían estar disponibles fuera de producción (`NODE_ENV !== "production"`).