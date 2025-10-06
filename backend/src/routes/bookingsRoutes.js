import express from 'express';
import { body } from 'express-validator';
import {
  getAllBookings,
  getUserBookings,
  getBookingById,
  createBooking,
  initiateBookingPayment,
  verifyBookingPayment,
  cancelBooking,
} from '../controllers/bookingsController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/all', authenticateToken, authorizeAdmin, getAllBookings);

router.get('/my-bookings', authenticateToken, getUserBookings);

router.get('/:id', authenticateToken, getBookingById);

router.post(
  '/',
  authenticateToken,
  [body('eventId').notEmpty().withMessage('Event ID is required'), validate],
  createBooking
);

router.post('/:bookingId/initiate-payment', authenticateToken, initiateBookingPayment);

router.post(
  '/:bookingId/verify-payment',
  authenticateToken,
  [
    body('paymentId').notEmpty().withMessage('Payment ID is required'),
    body('orderId').notEmpty().withMessage('Order ID is required'),
    validate,
  ],
  verifyBookingPayment
);

router.delete('/:id', authenticateToken, cancelBooking);

export default router;
