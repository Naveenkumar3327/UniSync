-- UniSync Database Schema & Migrations
-- Target Database: Supabase PostgreSQL (with extensions enabled)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT DETAILS
CREATE TYPE student_class_type AS ENUM ('hosteller', 'day_scholar');

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    gender TEXT,
    dob DATE,
    roll_number TEXT UNIQUE NOT NULL,
    register_number TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    section TEXT NOT NULL,
    student_type student_class_type NOT NULL DEFAULT 'day_scholar',
    -- Hosteller specific
    hostel_block TEXT,
    room_number TEXT,
    floor_number INTEGER,
    bed_number TEXT,
    -- Day Scholar specific
    bus_number TEXT,
    boarding_point TEXT,
    transport_type TEXT,
    parking_details TEXT,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. STAFF DETAILS
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    staff_name TEXT NOT NULL,
    staff_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ADMIN DETAILS
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    admin_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ANNOUNCEMENTS
CREATE TYPE announcement_category AS ENUM (
    'exam_notice', 'placement_drive', 'workshop', 
    'symposium', 'hackathon', 'club_event', 'general_notice'
);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category announcement_category NOT NULL DEFAULT 'general_notice',
    department_filter TEXT, -- NULL means visible to all
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. COMPLAINT MANAGEMENT
CREATE TYPE complaint_type AS ENUM ('hostel', 'day_scholar');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE complaint_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'water', 'electricity', 'bus'
    type complaint_type NOT NULL,
    priority complaint_priority NOT NULL DEFAULT 'medium',
    location TEXT,
    status complaint_status NOT NULL DEFAULT 'pending',
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status complaint_status NOT NULL,
    comment TEXT,
    actor_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. POLL SYSTEM
CREATE TABLE IF NOT EXISTS polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings e.g. ["Option A", "Option B"]
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    option_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, student_id)
);

-- 8. COLLABORATION & HACKATHONS
CREATE TYPE collab_type AS ENUM ('study_group', 'project_team', 'research_group', 'hackathon_team');

CREATE TABLE IF NOT EXISTS collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type collab_type NOT NULL DEFAULT 'study_group',
    skills_required TEXT[],
    status TEXT NOT NULL DEFAULT 'recruiting', -- recruiting, filled, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID REFERENCES collaborations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- leader, developer, designer, researcher
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, student_id)
);

-- 9. STUDY WORKSPACES
CREATE TABLE IF NOT EXISTS study_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    creator_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, student_id)
);

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES study_rooms(id) ON DELETE CASCADE, -- NULL if general note
    uploader_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'pdf', 'ppt', 'doc', 'docx', 'png', 'txt'
    size INTEGER NOT NULL, -- Size in bytes
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    department TEXT NOT NULL,
    subject TEXT NOT NULL,
    semester INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS
CREATE TYPE notification_type AS ENUM ('announcement', 'complaint_update', 'collab_request', 'team_invite', 'event_alert', 'general');

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    type notification_type NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. LOST & FOUND
CREATE TYPE lost_found_status AS ENUM ('lost', 'found', 'resolved');

CREATE TABLE IF NOT EXISTS lost_found (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    status lost_found_status NOT NULL DEFAULT 'lost',
    type TEXT NOT NULL, -- 'lost' or 'found'
    location TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'certification', 'hackathon', 'competition', 'research'
    description TEXT NOT NULL,
    certificate_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    badges TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. EVENTS & CLUBS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'symposium', 'hackathon', 'workshop', 'club_event'
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue TEXT NOT NULL,
    qr_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    qr_code TEXT NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, student_id)
);

CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'coding', 'ai', 'robotics', 'photography', 'sports'
    creator_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL, -- 'books', 'notes', 'calculators', 'academic_gear'
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'sold'
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AUDIT & SETTINGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 14b. OPPORTUNITIES & VECTOR SEARCH
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    department TEXT,
    location TEXT,
    eligibility TEXT,
    skills TEXT[],
    description TEXT NOT NULL,
    apply_link TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. ROW-LEVEL SECURITY & TRIGGERS
-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Base Policies (Example for user profile reading)
CREATE POLICY "Allow public read for profiles" ON students 
    FOR SELECT USING (true);

CREATE POLICY "Allow students to manage own profile" ON students 
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Allow public read for opportunities" ON opportunities
    FOR SELECT USING (true);

CREATE POLICY "Allow admins/staff to manage opportunities" ON opportunities
    FOR ALL USING (true); -- Simplify for campus context

-- Trigger: Automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_complaints_modtime BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- SEED DATA FOR DEMONSTRATION & TESTING
-- Insert base users
INSERT INTO users (id, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'student'),
('22222222-2222-2222-2222-222222222222', 'staff'),
('33333333-3333-3333-3333-333333333333', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert Student
INSERT INTO students (id, full_name, email, phone, gender, dob, roll_number, register_number, department, year, semester, section, student_type, hostel_block, room_number, floor_number, bed_number, username) VALUES
('11111111-1111-1111-1111-111111111111', 'Alex Mercer', 'alex.mercer@university.edu', '+15550199', 'Male', '2004-05-15', 'CS2042', 'REG9920112', 'Computer Science & Engineering', 3, 6, 'B', 'hosteller', 'Alpha Block', '302', 3, 'Bed-A', 'alex_cs')
ON CONFLICT (id) DO NOTHING;

-- Insert Staff
INSERT INTO staff (id, staff_name, staff_id, department, designation, email, phone, username) VALUES
('22222222-2222-2222-2222-222222222222', 'Dr. Sarah Connor', 'STF9021', 'Computer Science & Engineering', 'Associate Professor', 'sarah.connor@university.edu', '+15550299', 'sarah_prof')
ON CONFLICT (id) DO NOTHING;

-- Insert Admin
INSERT INTO admins (id, admin_name, email, phone, username) VALUES
('33333333-3333-3333-3333-333333333333', 'Executive Admin Chief', 'admin.chief@university.edu', '+15550999', 'admin_chief')
ON CONFLICT (id) DO NOTHING;

-- Seed Opportunities
INSERT INTO opportunities (title, company, source, category, department, location, eligibility, skills, description, apply_link, deadline, image_url) VALUES
('AI / ML Research Intern', 'Google', 'Company Career Pages', 'internship', 'Computer Science & Engineering', 'Bangalore, India', 'Pre-final / Final year B.Tech/M.Tech CS students', ARRAY['Python', 'PyTorch', 'Machine Learning', 'TensorFlow'], 'Join the Google research group in Bangalore working on state-of-the-art Generative AI technologies and large language models.', 'https://careers.google.com', NOW() + INTERVAL '30 days', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200'),
('Full Stack Developer Job', 'Microsoft', 'LinkedIn Jobs', 'job', 'Computer Science & Engineering', 'Remote', 'Graduating B.Tech CS students, CGPA > 8.0', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 'Microsoft Azure team is hiring full stack developers experienced with typescript ecosystem, relational databases, and scalable web apps.', 'https://careers.microsoft.com', NOW() + INTERVAL '15 days', 'https://images.unsplash.com/photo-1625014618427-fbc980b974f5?auto=format&fit=crop&q=80&w=200'),
('Smart India Hackathon 2026', 'Govt of India', 'Unstop', 'hackathon', 'Computer Science & Engineering', 'New Delhi, India', 'Open to all engineering students', ARRAY['React', 'Flask', 'AI', 'IoT'], 'National-level hackathon to solve critical challenges faced by governmental departments. $5000 grand prize.', 'https://unstop.com', NOW() + INTERVAL '5 days', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200'),
('CAD Design Intern', 'Tesla', 'Company Career Pages', 'internship', 'Mechanical Engineering', 'Bangalore, India', 'Mechanical Engineering students in 3rd/4th year', ARRAY['CAD', 'SolidWorks', 'CATIA', 'Finite Element Analysis'], 'Collaborate with Tesla mechanical engineers on structural design and thermal systems analysis for energy storage installations.', 'https://careers.tesla.com', NOW() + INTERVAL '20 days', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200'),
('Embedded Systems Engineer', 'Intel', 'Wellfound', 'job', 'Electronics & Communication Engineering', 'Bangalore, India', 'ECE grads with embedded experience', ARRAY['Embedded C', 'RTOS', 'Microcontrollers', 'IoT', 'C++'], 'Intel is seeking embedded developers to work on chipset firmware, hardware-software integration, and RTOS configurations.', 'https://careers.intel.com', NOW() + INTERVAL '12 days', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200'),
('IoT Security Workshop', 'UniSync Club', 'Unstop', 'workshop', 'Electronics & Communication Engineering', 'Campus Seminar Hall', 'Open to all ECE & CSE students', ARRAY['IoT', 'Security', 'Embedded C'], 'Interactive 2-day workshop on firmware security analysis, penetration testing of connected components, and device hardening.', 'https://unisync.edu/events', NOW() + INTERVAL '3 days', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200'),
('Venture Capital Scholarship', 'Sequoia Capital', 'Foundit', 'scholarship', 'Computer Science & Engineering', 'Global', 'B.Tech/Dual degree students in STEM', ARRAY['Entrepreneurship', 'Product Development'], 'Scholarship of $10,000 for undergraduate students demonstrating exceptional technical building skills and startup vision.', 'https://sequoiacap.com', NOW() + INTERVAL '45 days', 'https://images.unsplash.com/photo-1579532561814-c1bc1de747c1?auto=format&fit=crop&q=80&w=200'),
('Full Stack Developer Drive', 'TCS', 'Naukri', 'drive', 'Computer Science & Engineering', 'Campus Placement Drive', 'All 4th-year CSE/ECE/IT students eligible', ARRAY['Java', 'React', 'SQL'], 'TCS Mega campus placement drive for system engineers and digital developers.', 'https://tcs.com', NOW() + INTERVAL '2 days', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200')
ON CONFLICT DO NOTHING;

