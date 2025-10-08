-- IIPS Yoga and Fitness Club Database Setup
-- Execute this SQL in your Supabase SQL Editor

-- Create users table with 3 roles: student, other, admin
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  student_id text NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('student', 'other', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  max_participants integer DEFAULT 50,
  current_participants integer DEFAULT 0,
  price numeric(10, 2) DEFAULT 0,
  image text,
  type text DEFAULT 'upcoming' CHECK (type IN ('previous', 'upcoming')),
  instructor text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  booking_date timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_id text,
  amount numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Create email history table
CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON email_history(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert events"
  ON events FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for email history
CREATE POLICY "Users can view own email history"
  ON email_history FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all email history"
  ON email_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "System can insert email history"
  ON email_history FOR INSERT TO authenticated WITH CHECK (true);

-- Insert admin user (yogafitness@gmail.com with password: Yoga@2024)
-- Password hash for "Yoga@2024" using bcrypt
INSERT INTO users (name, email, phone, student_id, password_hash, role)
VALUES (
  'Admin User',
  'yogafitness@gmail.com',
  '9876543210',
  'ADMIN001',
  '$2a$10$YourHashedPasswordHere',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample student user
INSERT INTO users (name, email, phone, student_id, password_hash, role)
VALUES (
  'Rahul Sharma',
  'rahul.sharma@iips.edu',
  '9123456789',
  'IIPS2024001',
  '$2a$10$YourHashedPasswordHere',
  'student'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample events with Pexels images
INSERT INTO events (title, description, date, time, location, max_participants, current_participants, price, image, type, instructor)
VALUES
  ('Morning Yoga Session', 'Start your day with energizing yoga poses and breathing exercises designed to boost your energy and mental clarity.', '2024-08-15', '07:00:00', 'IIPS Yoga Hall', 50, 45, 0, 'https://images.pexels.com/photos/3822647/pexels-photo-3822647.jpeg', 'previous', 'Mrs. Manju Suchdeo'),
  ('Fitness Boot Camp', 'High-intensity workout session for building strength and endurance. Perfect for all fitness levels.', '2024-08-20', '17:00:00', 'IIPS Sports Ground', 30, 28, 100, 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'previous', 'Dr. Surendra Malviya'),
  ('Meditation Workshop', 'Learn mindfulness and meditation techniques for stress relief and mental wellness.', '2025-01-15', '16:00:00', 'IIPS Meditation Center', 40, 5, 50, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'upcoming', 'Mrs. Manju Suchdeo'),
  ('Advanced Yoga Workshop', 'Advanced yoga poses and techniques for experienced practitioners. Take your practice to the next level.', '2025-01-25', '08:00:00', 'IIPS Yoga Hall', 25, 3, 150, 'https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg', 'upcoming', 'Mrs. Manju Suchdeo'),
  ('Power Yoga Session', 'Dynamic and powerful yoga session focusing on strength building and flexibility.', '2025-02-05', '18:00:00', 'IIPS Yoga Hall', 35, 0, 75, 'https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg', 'upcoming', 'Mrs. Manju Suchdeo'),
  ('Sunset Meditation', 'Experience tranquility with guided meditation during the golden hour.', '2025-02-10', '17:30:00', 'IIPS Terrace Garden', 50, 0, 0, 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg', 'upcoming', 'Dr. Surendra Malviya')
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
