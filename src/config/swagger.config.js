import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './env.config.js';
import {
    USER_ROLES,
    PRODUCT_STATUS,
    ORDER_STATUS,
    ORDER_PRIORITY,
    DELIVERY_STATUS,
} from '../utils/constants.js';
import { ERROR_CODES } from '../errors/error-codes.js';

// =====================================================================
//                      :) ESTE ARCHIVO TIENE AYUDIN :)
// =====================================================================

// Helpers para no repetir la estructura { status, message, payload }
// y { status, error, message, details } en cada response.

const successResponse = (description, payloadSchema, messageExample) => {
    const overrideProps = { payload: payloadSchema };
    if (messageExample) {
        overrideProps.message = { type: 'string', example: messageExample };
    }
    return {
        description,
        content: {
            'application/json': {
                schema: {
                    allOf: [
                        { $ref: '#/components/schemas/SuccessResponse' },
                        { type: 'object', properties: overrideProps },
                    ],
                },
            },
        },
    };
};

const messageOnlyResponse = (description, messageExample) => ({
    description,
    content: {
        'application/json': {
            schema: {
                allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                        type: 'object',
                        properties: { message: { type: 'string', example: messageExample } },
                    },
                ],
            },
        },
    },
});

const errorResponse = (description, errorCode, messageExample) => ({
    description,
    content: {
        'application/json': {
            schema: {
                allOf: [
                    { $ref: '#/components/schemas/ErrorResponse' },
                    {
                        type: 'object',
                        properties: {
                            error: { type: 'string', example: errorCode },
                            message: { type: 'string', example: messageExample },
                        },
                    },
                ],
            },
        },
    },
});

// SCHEMAS

const schemas = {
    // ---------- Genéricos ----------
    ErrorResponse: {
        type: 'object',
        description: 'Estructura estándar de toda respuesta de error del middleware global.',
        properties: {
            status: { type: 'string', example: 'error' },
            error: {
                type: 'string',
                enum: Object.values(ERROR_CODES),
                example: ERROR_CODES.VALIDATION_ERROR,
            },
            message: { type: 'string', example: 'Los datos enviados no son validos' },
            details: {
                description:
                    'Solo presente fuera de produccion y solo en algunos errores (ej. validaciones de Mongoose devuelven un array, otros un string).',
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
            },
        },
    },

    SuccessResponse: {
        type: 'object',
        description:
            'Estructura base de toda respuesta exitosa. "message" y "payload" son opcionales: no todos los endpoints usan ambos (ej. los DELETE solo devuelven message).',
        properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            payload: { description: 'Contenido especifico de la respuesta, definido en cada endpoint' },
        },
    },

    // ---------- Users ----------
    User: {
        type: 'object',
        description: 'El campo password nunca se incluye en las respuestas (select: false en el modelo).',
        properties: {
            _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i0' },
            first_name: { type: 'string', example: 'Laura' },
            last_name: { type: 'string', example: 'Gomez' },
            email: { type: 'string', format: 'email', example: 'laura.gomez@example.com' },
            role: { type: 'string', enum: Object.values(USER_ROLES), example: USER_ROLES.USER },
        },
    },
    UserCreateRequest: {
        type: 'object',
        required: ['first_name', 'last_name', 'email', 'password'],
        properties: {
            first_name: { type: 'string', example: 'Laura' },
            last_name: { type: 'string', example: 'Gomez' },
            email: { type: 'string', format: 'email', example: 'laura.gomez@example.com' },
            password: { type: 'string', format: 'password', example: 'MiPassword123' },
            role: {
                type: 'string',
                enum: Object.values(USER_ROLES),
                example: USER_ROLES.USER,
                description: 'Opcional. Por defecto "user".',
            },
        },
    },
    UserUpdateRequest: {
        type: 'object',
        description: 'Se debe enviar al menos uno de estos campos.',
        properties: {
            first_name: { type: 'string', example: 'Laura' },
            last_name: { type: 'string', example: 'Gomez' },
            email: { type: 'string', format: 'email', example: 'laura.gomez@example.com' },
            password: { type: 'string', format: 'password', example: 'MiPassword123' },
        },
    },

    // ---------- Products ----------
    Product: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i1' },
            name: { type: 'string', example: 'Caja de carton mediana' },
            description: { type: 'string', example: 'Caja reforzada para envios de hasta 10kg' },
            price: { type: 'number', example: 1500 },
            code: { type: 'string', example: 'CAJA-MED-01' },
            stock: { type: 'integer', example: 25 },
            status: { type: 'string', enum: Object.values(PRODUCT_STATUS), example: PRODUCT_STATUS.AVAILABLE },
            thumbnail: { type: 'array', items: { type: 'string' }, example: ['https://picsum.photos/200'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    ProductCreateRequest: {
        type: 'object',
        required: ['name', 'description', 'price', 'code', 'stock'],
        properties: {
            name: { type: 'string', example: 'Caja de carton mediana' },
            description: { type: 'string', example: 'Caja reforzada para envios de hasta 10kg' },
            price: { type: 'number', minimum: 0, example: 1500 },
            code: { type: 'string', description: 'Debe ser unico', example: 'CAJA-MED-01' },
            stock: { type: 'integer', minimum: 0, example: 25 },
            status: {
                type: 'string',
                enum: Object.values(PRODUCT_STATUS),
                example: PRODUCT_STATUS.AVAILABLE,
                description: 'Opcional. Por defecto "available".',
            },
            thumbnail: { type: 'array', items: { type: 'string' } },
        },
    },
    ProductUpdateRequest: {
        type: 'object',
        description: 'Todos los campos son opcionales, se actualizan solo los enviados.',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            code: { type: 'string' },
            stock: { type: 'integer', minimum: 0 },
            status: { type: 'string', enum: Object.values(PRODUCT_STATUS) },
            thumbnail: { type: 'array', items: { type: 'string' } },
        },
    },

    // ---------- Orders ----------
    OrderItem: {
        type: 'object',
        properties: {
            product: {
                type: 'string',
                description: 'ObjectId del producto',
                example: '64a1f2e5c3b4d5e6f7g8h9i1',
            },
            quantity: { type: 'integer', minimum: 1, example: 2 },
        },
    },
    Order: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i2' },
            user: {
                type: 'string',
                description: 'ObjectId del usuario que hizo el pedido',
                example: '64a1f2e5c3b4d5e6f7g8h9i0',
            },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            address: { type: 'string', example: 'Av. Siempre Viva 742' },
            status: { type: 'string', enum: Object.values(ORDER_STATUS), example: ORDER_STATUS.PENDING },
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY), example: ORDER_PRIORITY.MEDIUM },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    OrderStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
            status: { type: 'string', enum: Object.values(ORDER_STATUS), example: ORDER_STATUS.DELIVERED },
        },
    },

    // ---------- Deliveries ----------
    Delivery: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i3' },
            order: {
                type: 'string',
                description: 'ObjectId del pedido asociado',
                example: '64a1f2e5c3b4d5e6f7g8h9i2',
            },
            courier: {
                type: 'string',
                nullable: true,
                description: 'ObjectId del repartidor asignado. null si todavia no tiene uno.',
                example: '64a1f2e5c3b4d5e6f7g8h9i4',
            },
            status: { type: 'string', enum: Object.values(DELIVERY_STATUS), example: DELIVERY_STATUS.ASSIGNED },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    DeliveryStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string',
                enum: Object.values(DELIVERY_STATUS),
                example: DELIVERY_STATUS.IN_TRANSIT,
            },
        },
    },

    // ---------- Mocks (formas distintas a las entidades reales) ----------
    MockUser: {
        type: 'object',
        description: 'Usuario simulado, no guardado en la base. No tiene _id y el password viaja en texto plano.',
        properties: {
            first_name: { type: 'string', example: 'Laura' },
            last_name: { type: 'string', example: 'Gomez' },
            email: { type: 'string', format: 'email', example: 'laura.gomez@example.com' },
            password: { type: 'string', example: 'Xk29fPqz1a' },
            role: { type: 'string', enum: Object.values(USER_ROLES) },
        },
    },
    MockOrder: {
        type: 'object',
        description: 'Pedido simulado, no guardado en la base. No tiene _id.',
        properties: {
            user: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i0' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            address: { type: 'string', example: 'Av. Siempre Viva 742' },
            status: { type: 'string', enum: Object.values(ORDER_STATUS) },
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY) },
        },
    },
    MockDelivery: {
        type: 'object',
        description: 'Entrega simulada, no guardada en la base. No tiene _id.',
        properties: {
            order: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i2' },
            courier: { type: 'string', nullable: true, example: null },
            status: { type: 'string', enum: Object.values(DELIVERY_STATUS) },
        },
    },
    MockProduct: {
        type: 'object',
        description: 'Producto simulado (cuando saveToDatabase=false, no tiene _id).',
        properties: {
            name: { type: 'string', example: 'Sleek Wooden Chair' },
            description: { type: 'string' },
            price: { type: 'number', example: 45.99 },
            code: { type: 'string' },
            stock: { type: 'integer', example: 10 },
            status: { type: 'string', enum: Object.values(PRODUCT_STATUS) },
            thumbnail: { type: 'array', items: { type: 'string' } },
        },
    },
    GenerateProductsRequest: {
        type: 'object',
        required: ['count'],
        properties: {
            count: { type: 'integer', minimum: 1, maximum: 1000, example: 10 },
            saveToDatabase: {
                type: 'boolean',
                default: false,
                description: 'Si es true, inserta los productos generados en MongoDB.',
                example: true,
            },
        },
    },
    GenerateDataRequest: {
        type: 'object',
        description: 'Todos los campos son opcionales. Default: users=5, couriers=3, orders=5, deliveries=5.',
        properties: {
            users: { type: 'integer', minimum: 0, maximum: 1000, example: 5 },
            couriers: { type: 'integer', minimum: 0, maximum: 1000, example: 3 },
            orders: { type: 'integer', minimum: 0, maximum: 1000, example: 5 },
            deliveries: { type: 'integer', minimum: 0, maximum: 1000, example: 5 },
        },
    },
    MockDataSummary: {
        type: 'object',
        description: 'Cantidad de documentos insertados por generate-data (no devuelve los documentos, solo el conteo).',
        properties: {
            users: { type: 'integer', example: 5 },
            couriers: { type: 'integer', example: 3 },
            orders: { type: 'integer', example: 5 },
            deliveries: { type: 'integer', example: 5 },
        },
    },
};

// RESPONSES

const responses = {
    // ---------- Users ----------
    UserListResponse: successResponse('Lista de usuarios', {
        type: 'array',
        items: { $ref: '#/components/schemas/User' },
    }),
    UserDetailResponse: successResponse('Usuario encontrado', { $ref: '#/components/schemas/User' }),
    UserCreatedResponse: successResponse('Usuario creado correctamente', { $ref: '#/components/schemas/User' }),
    UserUpdatedResponse: successResponse('Usuario actualizado correctamente', { $ref: '#/components/schemas/User' }),
    UserDeletedResponse: messageOnlyResponse('Usuario eliminado correctamente', 'Usuario eliminado'),
    UserNotFoundResponse: errorResponse(
        'El usuario no existe',
        ERROR_CODES.USER_NOT_FOUND,
        'El usuario no fue encontrado'
    ),

    // ---------- Products ----------
    ProductListResponse: successResponse('Lista de productos', {
        type: 'array',
        items: { $ref: '#/components/schemas/Product' },
    }),
    ProductDetailResponse: successResponse('Producto encontrado', { $ref: '#/components/schemas/Product' }),
    ProductCreatedResponse: successResponse('Producto creado correctamente', {
        $ref: '#/components/schemas/Product',
    }),
    ProductUpdatedResponse: successResponse('Producto actualizado correctamente', {
        $ref: '#/components/schemas/Product',
    }),
    ProductDeletedResponse: messageOnlyResponse('Producto eliminado correctamente', 'Producto eliminado correctamente'),
    ProductNotFoundResponse: errorResponse(
        'El producto no existe',
        ERROR_CODES.PRODUCT_NOT_FOUND,
        'Producto no encontrado'
    ),

    // ---------- Orders ----------
    OrderListResponse: successResponse('Lista de pedidos', {
        type: 'array',
        items: { $ref: '#/components/schemas/Order' },
    }),
    OrderDetailResponse: successResponse('Pedido encontrado', { $ref: '#/components/schemas/Order' }),
    OrderStatusUpdatedResponse: successResponse('Estado del pedido actualizado', {
        $ref: '#/components/schemas/Order',
    }),
    OrderNotFoundResponse: errorResponse(
        'El pedido no existe',
        ERROR_CODES.ORDER_NOT_FOUND,
        'La orden no fue encontrada'
    ),
    InvalidOrderStatusResponse: errorResponse(
        'El estado enviado no es un estado valido para un pedido',
        ERROR_CODES.INVALID_ORDER_STATUS,
        "El estado 'entregado' no es válido. Estados permitidos: pending, in_progress, delivered, cancelled"
    ),

    // ---------- Deliveries ----------
    DeliveryListResponse: successResponse('Lista de entregas', {
        type: 'array',
        items: { $ref: '#/components/schemas/Delivery' },
    }),
    DeliveryDetailResponse: successResponse('Entrega encontrada', { $ref: '#/components/schemas/Delivery' }),
    DeliveryStatusUpdatedResponse: successResponse('Estado de la entrega actualizado', {
        $ref: '#/components/schemas/Delivery',
    }),
    DeliveryNotFoundResponse: errorResponse(
        'La entrega no existe',
        ERROR_CODES.DELIVERY_NOT_FOUND,
        'La entrega no fue encontrada'
    ),
    InvalidDeliveryStatusResponse: errorResponse(
        'El estado enviado no es un estado valido para una entrega',
        ERROR_CODES.INVALID_DELIVERY_STATUS,
        "El estado 'en_camino' no es válido. Estados permitidos: assigned, in_transit, completed, failed"
    ),

    // ---------- Mocks ----------
    MockUsersResponse: successResponse('Usuarios simulados generados (no se guardan en la base)', {
        type: 'array',
        items: { $ref: '#/components/schemas/MockUser' },
    }),
    MockCouriersResponse: successResponse('Repartidores simulados generados (no se guardan en la base)', {
        type: 'array',
        items: { $ref: '#/components/schemas/MockUser' },
    }),
    MockOrdersResponse: successResponse('Pedidos simulados generados (no se guardan en la base)', {
        type: 'array',
        items: { $ref: '#/components/schemas/MockOrder' },
    }),
    MockDeliveriesResponse: successResponse('Entregas simuladas generadas (no se guardan en la base)', {
        type: 'array',
        items: { $ref: '#/components/schemas/MockDelivery' },
    }),
    ProductsGeneratedResponse: successResponse(
        'Productos generados en memoria, sin guardar (saveToDatabase=false)',
        { type: 'array', items: { $ref: '#/components/schemas/MockProduct' } },
        'Productos generados exitosamente'
    ),
    ProductsSavedResponse: successResponse(
        'Productos generados y guardados en MongoDB (saveToDatabase=true)',
        { type: 'array', items: { $ref: '#/components/schemas/Product' } },
        'Productos guardados en la base de datos'
    ),
    MockDataInsertedResponse: successResponse(
        'Usuarios, repartidores, pedidos y entregas insertados y relacionados entre si',
        { $ref: '#/components/schemas/MockDataSummary' },
        'Datos de prueba insertados correctamente'
    ),

    // ---------- Logger ----------
    LoggerTestResponse: messageOnlyResponse(
        'Se generaron logs de prueba en todos los niveles (consola + archivo rotado para error/fatal)',
        'Logs generados correctamente'
    ),

    // ---------- Errores genéricos, reutilizados en varios endpoints ----------
    ValidationErrorResponse: errorResponse(
        'Los datos enviados no son validos',
        ERROR_CODES.VALIDATION_ERROR,
        'Los datos enviados no son validos'
    ),
    InvalidIdResponse: errorResponse(
        'El id enviado en la URL no tiene formato valido de Mongo ObjectId',
        ERROR_CODES.INVALID_ID,
        'El id proporcionado no tiene un formato valido'
    ),
    DuplicateKeyResponse: errorResponse(
        'Ya existe un registro con ese valor unico (ej. email o code repetido)',
        ERROR_CODES.DUPLICATE_KEY,
        'Ya existe un registro con ese email'
    ),
    InvalidMockAmountResponse: errorResponse(
        'La cantidad solicitada no es un numero entero valido',
        ERROR_CODES.INVALID_MOCK_AMOUNT,
        "El parametro 'count' debe ser un numero entero entre 1 y 1000"
    ),
    MockGenerationErrorResponse: errorResponse(
        'Error al generar o guardar los datos de prueba',
        ERROR_CODES.MOCK_GENERATION_ERROR,
        'Ocurrio un error al generar o insertar los datos de prueba'
    ),
    InternalServerErrorResponse: errorResponse(
        'Error inesperado del servidor',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error interno del servidor'
    ),
};

// PARAMETERS

const parameters = {
    IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'ObjectId de Mongo del recurso.',
        example: '64a1f2e5c3b4d5e6f7g8h9i0',
    },
    CountQueryParam: {
        name: 'count',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1, maximum: 1000, default: 10 },
        description: 'Cantidad de registros a generar. Opcional, entre 1 y 1000. Por defecto 10.',
    },
};

// DEFINICIÓN GENERAL

const swaggerSpecs = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ship-POW API',
            version: '1.0.0',
            description:
                'API REST para la gestion logistica de Ship-POW: usuarios, productos, pedidos y entregas. ' +
                'Incluye un modulo de mocks para generar datos de prueba y un endpoint de validacion del logger.',
        },
        servers: [
            {
                url: `http://localhost:${config.PORT}`,
                description: 'Servidor local de desarrollo',
            },
        ],
        tags: [
            { name: 'Users', description: 'Gestion de usuarios (CRUD completo)' },
            { name: 'Products', description: 'Gestion de productos (CRUD completo)' },
            { name: 'Orders', description: 'Consulta de pedidos y actualizacion de su estado' },
            { name: 'Deliveries', description: 'Consulta de entregas y actualizacion de su estado' },
            {
                name: 'Mocks',
                description:
                    'Generacion de datos de prueba (usuarios, repartidores, pedidos, entregas y productos). No disponible en produccion.',
            },
            {
                name: 'Logger',
                description:
                    'Endpoint de validacion del logger. No es una funcionalidad de negocio, solo sirve para verificar que Winston esta configurado correctamente. No disponible en produccion.',
            },
        ],
        components: {
            schemas,
            responses,
            parameters,
        },
    },
    apis: ['./src/docs/**/*.yaml'],
});

export default swaggerSpecs;