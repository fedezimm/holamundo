import { Router } from 'express';
import * as productsController from '../../controllers/v1/products-controller';
import { checkAuth} from '../../middlewares/auth-middleware';

const router = Router();

router.get('', checkAuth, productsController.getProducts);
router.get('/:productId', checkAuth, productsController.getProductById);
router.post('/create', checkAuth, productsController.createProduct);
router.put('/:productId', checkAuth, productsController.updateProduct);
router.patch(
  '/:productId',
  checkAuth,
  productsController.partialUpdateProduct
);
router.post(
  '/:productId/notify-client',
  checkAuth,
  productsController.updateProductAndNotify
);
router.delete(
  '/:productId',
  checkAuth,
  productsController.deleteProductById
);

export default router;
