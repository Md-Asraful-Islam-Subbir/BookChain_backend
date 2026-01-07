import express from 'express'
import { authenticatedUser } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController'

const router=express.Router();

router.put('/create-or-update',authenticatedUser,userController.updateUserProfile)


export default router;