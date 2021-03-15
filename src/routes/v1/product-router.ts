import { Router } from 'express';
import * as productsController from '../../controllers/v1/products-controller';

const router = Router();

router.get('', productsController.getProducts);
router.get('/:productId', productsController.getProductById);
router.post('/create', productsController.createProduct);
router.put('/:productId', productsController.updateProduct);
router.patch(
  '/:productId',
  productsController.partialUpdateProduct
);
router.post(
  '/:productId/notify-client',
  productsController.updateProductAndNotify
);
router.delete(
  '/:productId',
  productsController.deleteProductById
);

export default router;
