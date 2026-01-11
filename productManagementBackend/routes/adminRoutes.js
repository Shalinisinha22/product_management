import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  isAdmin,
} from '../controllers/adminController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);

export default router;


