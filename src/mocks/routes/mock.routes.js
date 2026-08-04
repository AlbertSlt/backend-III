import express from 'express';
import MockController from '../controllers/mock.controller.js';
import { validateMockDataBody, validateMockProductsBody, validateMockCountQuery } from '../middlewares/mock.middleware.js';

const router = express.Router();

// datos sin guardar
router.get('/mocking-users', validateMockCountQuery, MockController.mockingUsers);

router.get('/mocking-couriers', validateMockCountQuery, MockController.mockingCouriers);
router.get('/mocking-orders', validateMockCountQuery, MockController.mockingOrders);
router.get('/mocking-deliveries', validateMockCountQuery, MockController.mockingDeliveries);


// insertar en mongo si saveToDatabase = true, sino solo generar y devolver
router.post('/generate-products', validateMockProductsBody, MockController.generateProducts);

//inserta usuarios repartidores pedidos y entregas relacionados entre sí 
router.post('/generate-data', validateMockDataBody, MockController.generateAndInsert);

export default router;