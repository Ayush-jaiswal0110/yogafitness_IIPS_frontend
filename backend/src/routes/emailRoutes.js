import express from 'express';
import {
  getEmailHistory,
  getUserEmailHistory,
  getEmailById,
} from '../controllers/emailController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getEmailHistory);

router.get('/my-emails', authenticateToken, getUserEmailHistory);

router.get('/:id', authenticateToken, getEmailById);

export default router;
