import { supabase } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, studentId, password } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const passwordHash = await hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        phone,
        student_id: studentId,
        password_hash: passwordHash,
        role: 'student',
      })
      .select('id, name, email, phone, student_id, role, created_at')
      .single();

    if (error) {
      throw error;
    }

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, student_id, password_hash, role')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, student_id, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) {
      throw error;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ name, phone, updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select('id, name, email, phone, student_id, role, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single();

    if (error) {
      throw error;
    }

    const isValidPassword = await comparePassword(currentPassword, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
      .eq('id', req.user.id);

    if (updateError) {
      throw updateError;
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
