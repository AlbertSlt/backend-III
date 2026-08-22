# Ship-POW API

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

## Módulo 3 - Manejo profesional de errores

Todos los errores pasan por el middleware global y responden siempre con la misma estructura:

```json
{
  "status": "error",
  "error": "CODIGO_DE_ERROR",
  "message": "Mensaje legible para el cliente"
}
```

Las rutas y controllers ya no arman respuestas de error a mano: los `services` y `middlewares` de validación lanzan un `AppError` (`src/errors/`), y el middleware global lo traduce a la respuesta HTTP.

### Probar casos inválidos (con Postman)

- `GET http://localhost:3000/api/users/000000000000000000000000` → recurso inexistente → `404 USER_NOT_FOUND`
- `GET http://localhost:3000/api/mocks/mocking-users?count=-5` → dato inválido → `400 INVALID_MOCK_AMOUNT`
- `GET http://localhost:3000/api/no-existe` → ruta inexistente → `404 ROUTE_NOT_FOUND`

## Módulo 4 - Logging y monitoreo básico

Reemplaza el uso de `console.log()` por un logger centralizado con Winston, con distintos niveles de importancia y persistencia de errores en archivos.

### Niveles de log

De mayor a menor gravedad:

- `fatal` - falla crítica que impide que la app siga funcionando (ej. no se pudo conectar a la base de datos al iniciar)
- `error` - error inesperado del servidor
- `warning` - error esperado o de negocio (recurso no encontrado, dato inválido, etc.)
- `info` - eventos normales importantes (servidor iniciado, conexión a la base establecida, datos insertados)
- `http` - peticiones HTTP
- `debug` - información detallada para desarrollo

### Comportamiento según el entorno

El nivel mínimo de log depende de `NODE_ENV`:

- **Desarrollo**: se muestran todos los niveles, incluido `debug`.
- **Producción**: solo se muestran desde `info` en adelante (se ocultan `debug` y `http`).

### Persistencia y rotación de archivos

Los niveles `error` y `fatal` se guardan además en archivos dentro de la carpeta `logs/` (ignorada por Git). Los archivos rotan diariamente y se conservan los últimos 14 días.

### Endpoint de prueba del logger

Disponible solo fuera de producción (mismo criterio que `/api/mocks`):

```bash
GET http://localhost:3000/api/logger-test
```

Genera un log de cada nivel (`debug`, `http`, `info`, `warning`, `error`, `fatal`), tanto en consola como en el archivo de errores rotado (para `error` y `fatal`).

## Módulo 5 - Documentación de API con Swagger

La API expone documentación interactiva (OpenAPI 3.0), generada con `swagger-jsdoc` + `swagger-ui-express`.

### Cómo acceder

Con el servidor corriendo:

```
http://localhost:3000/api/docs
```

Desde ahí se puede ver cada endpoint, su body esperado, sus respuestas posibles, y probarlo directo con el botón "Try it out" (no hace falta Postman para esto, aunque también se puede seguir usando).

### Qué se agregó en este módulo

Además de documentar lo que ya existía, se sumaron endpoints de solo lectura + actualización de estado para **Orders** y **Deliveries**, que hasta ahora solo existían como modelos y como datos de mocks, pero nunca habían tenido rutas propias:

- `GET /api/orders` (admite filtro por `?status=`)
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status` — body `{ "status": "..." }`, valida contra los estados de `ORDER_STATUS`
- `GET /api/deliveries` (admite filtro por `?status=`)
- `GET /api/deliveries/:id`
- `PATCH /api/deliveries/:id/status` — body `{ "status": "..." }`, valida contra los estados de `DELIVERY_STATUS`

No se agregó `create` ni `delete` para estas dos entidades: la única forma de generarlas hoy sigue siendo vía `/api/mocks`.

### Módulos documentados

La documentación está organizada en 6 tags:

| Tag | Contenido |
|---|---|
| **Users** | CRUD completo |
| **Products** | CRUD completo (el listado filtra solo `status: available`) |
| **Orders** | Lectura + actualización de estado |
| **Deliveries** | Lectura + actualización de estado |
| **Mocks** | Los 6 endpoints de datos de prueba (ver Módulo 2) |
| **Logger** | El endpoint de prueba del logger (ver Módulo 4), aclarado ahí mismo como herramienta interna, no como funcionalidad de negocio |

Todos los errores usan la misma estructura documentada en el Módulo 3 (`ErrorResponse`), y los códigos que aparecen en Swagger (`VALIDATION_ERROR`, `USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `DELIVERY_NOT_FOUND`, `INVALID_ID`, `DUPLICATE_KEY`, `INVALID_MOCK_AMOUNT`, `INVALID_ORDER_STATUS`, `INVALID_DELIVERY_STATUS`) son los mismos definidos en `src/errors/error-codes.js`.

### Aclaración para probar Orders/Deliveries desde Swagger

Como estas dos entidades no tienen un endpoint de creación propio, para probar `GET /api/orders/:id` o `PATCH /api/orders/:id/status` primero hay que generar datos reales:

1. `POST /api/mocks/generate-data` con body `{}` (usa los valores por defecto) o con las cantidades que prefieras.
2. `GET /api/orders` (o `/api/deliveries`) y copiar un `_id` real de la respuesta.
3. Usar ese `_id` en los demás endpoints.

Los endpoints `mocking-orders` y `mocking-deliveries` **no** sirven para este paso: devuelven datos que nunca se guardan en la base, con ids inventados por Faker.

### Config separada de las rutas

Toda la configuración de Swagger (info general, schemas, responses y parameters reutilizables) vive en `src/config/swagger.config.js`. Los archivos en `src/docs/*.yaml` (uno por tag: `users`, `products`, `orders`, `deliveries`, `mocks`, `logger`) contienen solo los `paths`, referenciando esa configuración con `$ref` — no hay definiciones repetidas entre archivos.

## Módulo 6 - Testing funcional con Mocha, Chai y Supertest

Suite de tests automatizados que valida el comportamiento real de la API: endpoints principales, casos exitosos y errores esperados.

### Herramientas

- **Mocha**: organiza y ejecuta los tests (`describe` / `it`).
- **Chai**: aserciones (`expect`).
- **Supertest**: hace peticiones HTTP reales contra la app de Express, sin necesidad de levantar el servidor en un puerto.

### Separación de entorno

Los tests corren contra una base de datos y una configuración completamente separadas del entorno de desarrollo:

- `src/app.js` exporta la app de Express sola, sin conectar a la base ni levantar el servidor (eso lo hace `src/server.js`).
- `src/config/env.config.js` carga `.env.test` en vez de `.env` cuando `NODE_ENV=test`.
- `test/setup.js` conecta a la base de test antes de correr toda la suite, y cierra la conexión al final (usando root hooks de Mocha).

### Variables de entorno necesarias

Copiar `.env.test.example` a `.env.test` y completar:

PORT=3001
MONGODB_URI=mongodb://localhost:27017/shipnow-test
NODE_ENV=test
SEED_ADMIN=false
ADMIN_EMAIL=admin@ship-POW.com
ADMIN_PASSWORD=pass123


**Importante:** usar una base de datos distinta a la de desarrollo (ej. `shipnow-test` en vez de `shipnow`). Los tests insertan y borran datos reales; nunca deben correr contra la base de desarrollo o producción.

### Cómo ejecutar los tests

```bash
npm test
```

Esto corre `cross-env NODE_ENV=test mocha`, que fuerza el entorno de testing antes de invocar Mocha (funciona igual en Windows, Mac y Linux).

### Módulos cubiertos

| Archivo | Cubre |
|---|---|
| `test/routes/users.routes.test.js` | CRUD completo de usuarios: listado, creación (éxito/validación/duplicado), lectura por id (éxito/404/400 id inválido), actualización, eliminación |
| `test/routes/orders.routes.test.js` | Listado, lectura por id (éxito/404/400), creación real de pedidos vía `/api/mocks/generate-data`, actualización de estado (éxito/estado inválido/404) |
| `test/routes/mocks.routes.test.js` | `mocking-users` (éxito, valor por defecto, cantidad inválida, cantidad excesiva), `generate-data` (inserción real, valores por defecto, cantidades inválidas) |
| `test/routes/logger.routes.test.js` | Endpoint de prueba del logger |
| `test/routes/swagger.routes.test.js` | Disponibilidad de la documentación en `/api/docs` |
| `test/routes/notFound.routes.test.js` | Rutas inexistentes → 404 `ROUTE_NOT_FOUND` |
| `test/services/product.service.test.js` | CRUD de `ProductService` a nivel de servicio (sin pasar por HTTP) |

### Nota sobre la creación de pedidos

No existe un endpoint `POST /api/orders` (ver Módulo 5): la única forma de generar pedidos reales en la base es a través de `/api/mocks/generate-data`. El test de "creación de pedido con datos válidos" ejercita ese flujo real, en vez de un endpoint que no existe en el proyecto.

### Limpieza de datos

Cada suite es responsable de limpiar los datos que genera:

- `users.routes.test.js` y `orders.routes.test.js` crean usuarios con emails bajo el dominio `@shipPOW-test.com` y los borran en un `after()` al final de la suite.
- `mocks.routes.test.js` limpia las colecciones de usuarios, pedidos y entregas al final de su bloque de `generate-data` (ese endpoint no devuelve los ids de lo insertado, por lo que la limpieza es total en vez de selectiva — aceptable porque corre contra una base de test dedicada).
- `product.service.test.js` crea y elimina sus propios productos, con una red de seguridad en `after()` por si algún test falla antes de llegar al `delete`.

Ningún test depende de datos cargados manualmente ni del orden de ejecución de otros archivos.