import { supabase } from '../config/database.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, student_id, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ users, count: users.length });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, student_id, role, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, name, email, phone, student_id, role, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const { data: users } = await supabase.from('users').select('id');

    const { data: bookings } = await supabase.from('bookings').select('id');

    const { data: events } = await supabase.from('events').select('id');

    const stats = {
      totalUsers: users?.length || 0,
      totalBookings: bookings?.length || 0,
      totalEvents: events?.length || 0,
    };

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};
