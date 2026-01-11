import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (authentication required)
router.use(protect);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;


