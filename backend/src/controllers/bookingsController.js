import { supabase } from '../config/database.js';
import { initiatePayment, verifyPayment } from '../services/paymentService.js';
import { sendBookingConfirmation, sendPaymentSuccess } from '../services/emailService.js';

export const getAllBookings = async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users:user_id (name, email, phone, student_id),
        events:event_id (title, date, time, location, instructor)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events:event_id (title, date, time, location, instructor, image)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users:user_id (name, email, phone, student_id),
        events:event_id (title, date, time, location, instructor, image)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ error: 'Event is fully booked' });
    }

    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked this event' });
    }

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        event_id: eventId,
        amount: event.price,
        payment_status: event.price > 0 ? 'pending' : 'completed',
      })
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    const { error: updateError } = await supabase
      .from('events')
      .update({
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId);

    if (updateError) {
      throw updateError;
    }

    if (event.price === 0) {
      const { data: user } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .single();

      await sendBookingConfirmation(user, event, newBooking);
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking,
      requiresPayment: event.price > 0,
    });
  } catch (error) {
    next(error);
  }
};

export const initiateBookingPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        users:user_id (name, email, phone),
        events:event_id (title, date)
      `)
      .eq('id', bookingId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.payment_status === 'completed') {
      return res.status(400).json({ error: 'Payment already completed' });
    }

    const paymentResult = await initiatePayment(
      booking.amount,
      booking.users,
      booking.events
    );

    res.json({
      message: 'Payment initiated',
      ...paymentResult,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyBookingPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { paymentId, orderId } = req.body;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        users:user_id (id, name, email, phone),
        events:event_id (title, date, time, location, instructor)
      `)
      .eq('id', bookingId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const verificationResult = await verifyPayment(paymentId, orderId);

    if (!verificationResult.success) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      throw updateError;
    }

    await sendPaymentSuccess(booking.users, booking.events, booking, paymentId);
    await sendBookingConfirmation(booking.users, booking.events, booking);

    res.json({
      message: 'Payment verified successfully',
      booking: {
        ...booking,
        payment_status: 'completed',
        payment_id: paymentId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, events:event_id (id, current_participants)')
      .eq('id', id)
      .maybeSingle();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    const { error: updateError } = await supabase
      .from('events')
      .update({
        current_participants: Math.max(0, booking.events.current_participants - 1),
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.event_id);

    if (updateError) {
      throw updateError;
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
