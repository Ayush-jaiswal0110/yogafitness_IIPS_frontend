import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
} from '../controllers/usersController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getAllUsers);

router.get('/stats', authenticateToken, authorizeAdmin, getUserStats);

router.get('/:id', authenticateToken, authorizeAdmin, getUserById);

router.put(
  '/:id/role',
  authenticateToken,
  authorizeAdmin,
  [
    body('role').isIn(['student', 'admin']).withMessage('Role must be student or admin'),
    validate,
  ],
  updateUserRole
);

router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

export default router;
