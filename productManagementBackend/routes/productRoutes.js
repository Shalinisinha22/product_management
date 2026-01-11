import express from 'express';
import {
  getProducts,
  getProduct,
  getTrendingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getProducts);
router.get('/trending', getTrendingProducts);
router.get('/:id', getProduct);

// Protected routes (authentication required)
router.use(protect);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;


