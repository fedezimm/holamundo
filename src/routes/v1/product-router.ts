import { Router} from 'express';

import * as productsController from '../../controllers/v1/products-controller';
import { checkAuth} from '../../middlewares/auth-middleware';
import { handleRequestErrors } from '../../middlewares/validator-middleware';
import { validateDelete, validateNewProductBody, validateProductAndNotify } from '../../validators/products-validator';


const router = Router();

router.get('', checkAuth, productsController.getProducts);
router.get('/:productId', checkAuth, productsController.getProductById);
router.post(
  '/create', 
  checkAuth, 
  validateNewProductBody,
  handleRequestErrors, 
  productsController.createProduct
);
router.put('/:productId', checkAuth, productsController.updateProduct);
router.patch(
  '/:productId',
  checkAuth,
  productsController.partialUpdateProduct
);
router.post(
  '/:productId/notify-client',
  checkAuth,
  validateProductAndNotify,
  handleRequestErrors,
  productsController.updateProductAndNotify
);
router.delete(
  '/:productId',
  checkAuth,
  validateDelete,
  handleRequestErrors,
  productsController.deleteProductById
);

export default router;
