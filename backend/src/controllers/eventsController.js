import { supabase } from '../config/database.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: events, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      maxParticipants,
      price,
      image,
      type,
      instructor,
    } = req.body;

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        date,
        time,
        location,
        max_participants: maxParticipants,
        current_participants: 0,
        price,
        image,
        type,
        instructor,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      maxParticipants,
      price,
      image,
      type,
      instructor,
    } = req.body;

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        date,
        time,
        location,
        max_participants: maxParticipants,
        price,
        image,
        type,
        instructor,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('type', 'upcoming')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ events });
  } catch (error) {
    next(error);
  }
};

export const getPreviousEvents = async (req, res, next) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('type', 'previous')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ events });
  } catch (error) {
    next(error);
  }
};
