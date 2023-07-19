import express from 'express';
import productController from '../controllers/product-controller';

const router = express.Router();

router.get('', productController.getProducts);
router.post('', productController.createProduct);
router.put('', productController.updateProduct);
router.post('/restock', productController.restockProduct);

export default router;
