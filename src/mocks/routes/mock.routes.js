import express from 'express';
import MockController from '../controllers/mock.controller.js';

const router = express.Router();

// datos sin guardar
router.get('/mocking-users', MockController.mockingUsers);

router.get('/mocking-couriers', MockController.mockingCouriers);
router.get('/mocking-orders', MockController.mockingOrders);
router.get('/mocking-deliveries', MockController.mockingDeliveries);

// insertar en mongo si saveToDatabase = true, sino solo generar y devolver
router.post('/generate-products', MockController.generateProducts);

//inserta usuarios repartidores pedidos y entregas relacionados entre sí 
router.post('/generate-data', MockController.generateAndInsert);

export default router;