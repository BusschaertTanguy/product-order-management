import express from 'express';
import orderController from '../controllers/order-controller';

const router = express.Router();

router.get('', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('', orderController.createOrder);
router.delete('/:orderId/item/:id', orderController.removeOrderItem);
router.post('/accept', orderController.acceptOrder);
router.post('/refuse', orderController.refuseOrder);
router.post('/item', orderController.createOrderItem);
router.post('/item/update-amount', orderController.updateOrderItemAmount);

export default router;
