import { supabase } from '../config/database.js';

export const getEmailHistory = async (req, res, next) => {
  try {
    const { data: emails, error } = await supabase
      .from('email_history')
      .select(`
        *,
        users:user_id (name, email),
        bookings:booking_id (id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ emails });
  } catch (error) {
    next(error);
  }
};

export const getUserEmailHistory = async (req, res, next) => {
  try {
    const { data: emails, error } = await supabase
      .from('email_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ emails });
  } catch (error) {
    next(error);
  }
};

export const getEmailById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: email, error } = await supabase
      .from('email_history')
      .select(`
        *,
        users:user_id (name, email),
        bookings:booking_id (id)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    if (email.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ email });
  } catch (error) {
    next(error);
  }
};
