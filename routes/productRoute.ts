import express from 'express'
import { authenticatedUser } from '../middleware/authMiddleware';
import { multerMiddleware } from '../config/cloudnaryConfig';
import * as ProductController from '../controllers/productController'

const router=express.Router();

router.post('/',authenticatedUser,multerMiddleware,ProductController.createProduct)

export default router;