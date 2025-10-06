import express from 'express';
import { body } from 'express-validator';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getPreviousEvents,
} from '../controllers/eventsController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getAllEvents);

router.get('/upcoming', getUpcomingEvents);

router.get('/previous', getPreviousEvents);

router.get('/:id', getEventById);

router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').isDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be positive'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('instructor').trim().notEmpty().withMessage('Instructor is required'),
    body('type').isIn(['upcoming', 'previous']).withMessage('Type must be upcoming or previous'),
    validate,
  ],
  createEvent
);

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').isDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be positive'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('instructor').trim().notEmpty().withMessage('Instructor is required'),
    body('type').isIn(['upcoming', 'previous']).withMessage('Type must be upcoming or previous'),
    validate,
  ],
  updateEvent
);

router.delete('/:id', authenticateToken, authorizeAdmin, deleteEvent);

export default router;
