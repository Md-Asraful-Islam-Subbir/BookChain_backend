import express from 'express'
import { authenticatedUser } from '../middleware/authMiddleware';
import { multerMiddleware } from '../config/cloudnaryConfig';
import * as ProductController from '../controllers/productController'

const router=express.Router();

router.post('/',authenticatedUser,multerMiddleware,ProductController.createProduct)
router.get('/',authenticatedUser,ProductController.getAllProducts);
router.get('/:id',authenticatedUser,ProductController.getProductById);
router.delete('/seller/:productId',authenticatedUser,ProductController.deleteProduct)
router.get('/seller/:sellerId',authenticatedUser,ProductController.getProductBySellerId);

export default router;