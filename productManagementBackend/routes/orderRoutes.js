import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
} from '../controllers/orderController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

export default router;


