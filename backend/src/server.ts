import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authenticate, requireRole, AuthRequest } from './middleware/auth';
import { 
  User, Student, Staff, Admin, Announcement, Complaint, 
  Poll, StudyRoom, Message, UserRole 
} from './models/types';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

// Security and utility Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for easy development loading
}));
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// ==========================================
// IN-MEMORY DATABASE FALLBACK STATE
// ==========================================
let mockUsers: User[] = [
  { id: '11111111-1111-1111-1111-111111111111', role: 'student' },
  { id: '22222222-2222-2222-2222-222222222222', role: 'staff' },
  { id: '33333333-3333-3333-3333-333333333333', role: 'admin' }
];

let mockStudents: Student[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Alex Mercer',
    email: 'alex.mercer@university.edu',
    phone: '+15550199',
    gender: 'Male',
    dob: '2004-05-15',
    roll_number: 'CS2042',
    register_number: 'REG9920112',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    section: 'B',
    student_type: 'hosteller',
    hostel_block: 'Alpha Block',
    room_number: '302',
    floor_number: 3,
    bed_number: 'Bed-A',
    username: 'alex_cs'
  }
];

let mockStaffs: Staff[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    staff_name: 'Dr. Sarah Connor',
    staff_id: 'STF9021',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    email: 'sarah.connor@university.edu',
    phone: '+15550299',
    username: 'sarah_prof'
  }
];

let mockAdmins: Admin[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    admin_name: 'Executive Admin Chief',
    email: 'admin.chief@university.edu',
    phone: '+15550999',
    username: 'admin_chief'
  }
];

let mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    creator_id: '22222222-2222-2222-2222-222222222222',
    title: 'Model Semester Exams Timetable Released',
    content: 'All 3rd-year CS students are requested to download the timetable. Examinations start next Monday at 9:30 AM.',
    category: 'exam_notice',
    department_filter: 'Computer Science & Engineering',
    date: '2026-06-12'
  },
  {
    id: 'a2',
    creator_id: '33333333-3333-3333-3333-333333333333',
    title: 'UniSync Campus Hackathon 2026 Registration Open',
    content: 'Unleash your innovation. Grand prize of $5000. Registration link is active in the hackathon widget.',
    category: 'hackathon',
    date: '2026-06-11'
  }
];

let mockComplaints: Complaint[] = [
  {
    id: 'c1',
    student_id: '11111111-1111-1111-1111-111111111111',
    title: 'WiFi Connection Failure in Block 3 Room 302',
    description: 'The primary access point has been blinking red since yesterday afternoon. Cannot load resources.',
    category: 'WiFi',
    type: 'hostel',
    priority: 'high',
    location: 'Alpha Block, Room 302',
    status: 'pending',
    images: [],
    created_at: new Date('2026-06-12T10:00:00Z'),
    updated_at: new Date('2026-06-12T10:00:00Z')
  }
];

let mockComplaintLogs: any[] = [
  {
    id: 'log1',
    complaint_id: 'c1',
    status: 'pending',
    comment: 'Complaint registered by Alex Mercer.',
    actor_id: '11111111-1111-1111-1111-111111111111',
    created_at: new Date('2026-06-12T10:00:00Z')
  }
];

let mockPolls: Poll[] = [
  {
    id: 'p1',
    creator_id: '22222222-2222-2222-2222-222222222222',
    question: 'Should we extend the computer lab hours to 10:00 PM during exams?',
    options: ['Yes, absolutely needed', 'No, 8:00 PM is sufficient', 'Neutral / Undecided'],
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    votes: { 0: 42, 1: 12, 2: 5 }
  }
];

let mockPollVotes: any[] = [];

let mockStudyRooms: StudyRoom[] = [
  {
    id: 'room1',
    name: 'CS302 Project Discussion Group',
    code: 'SYNC-902',
    creator_id: '11111111-1111-1111-1111-111111111111'
  }
];

let mockRoomMembers: any[] = [
  { id: 'm1', room_id: 'room1', student_id: '11111111-1111-1111-1111-111111111111', joined_at: new Date() }
];

let mockMessages: Message[] = [
  {
    id: 'msg1',
    room_id: 'room1',
    sender_id: '11111111-1111-1111-1111-111111111111',
    content: 'Welcome everyone! Uploading the main slides for our presentation here.',
    created_at: new Date()
  }
];

let mockFiles: any[] = [
  {
    id: 'f1',
    room_id: 'room1',
    uploader_id: '11111111-1111-1111-1111-111111111111',
    name: 'Project_Outline.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    size: 1048576, // 1MB
    version: 1,
    created_at: new Date()
  }
];

let mockNotes: any[] = [
  {
    id: 'n1',
    uploader_id: '11111111-1111-1111-1111-111111111111',
    title: 'Operating Systems Sem-6 Notes',
    description: 'Complete syllabus review of Process Scheduling and Semaphore architectures.',
    url: '#',
    department: 'Computer Science & Engineering',
    subject: 'Operating Systems',
    semester: 6,
    created_at: new Date()
  }
];

let mockLostFound: any[] = [
  {
    id: 'lf1',
    reporter_id: '11111111-1111-1111-1111-111111111111',
    title: 'Calculus Workbook',
    description: 'Found a Calculus workbook on desk 12 in the main library block.',
    image_url: '',
    status: 'found',
    type: 'found',
    location: 'Main Library, Block B',
    date: '2026-06-12',
    created_at: new Date()
  }
];

let mockMarketplace: any[] = [
  {
    id: 'mp1',
    seller_id: '11111111-1111-1111-1111-111111111111',
    title: 'Casio Scientific Calculator FX-991EX',
    description: 'Almost new condition. Exchanged since I upgraded.',
    price: 15.00,
    category: 'calculators',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400',
    created_at: new Date()
  }
];

let mockEvents: any[] = [
  {
    id: 'ev1',
    title: 'Grand Tech Expo 2026',
    description: 'Annual flagship symposium showcasing AI, Robotics, and VR projects.',
    category: 'symposium',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Campus Main Auditorium',
    qr_required: true
  }
];

let mockRegistrations: any[] = [];

let mockAuditLogs: any[] = [
  {
    id: 'audit1',
    actor_id: '33333333-3333-3333-3333-333333333333',
    action: 'System Bootup',
    details: { message: 'UniSync backend loaded with database mock engine' },
    created_at: new Date()
  }
];

// ==========================================
// API ROUTES
// ==========================================

// Auth/Register Route Handler
app.post('/api/auth/register', (req, res) => {
  const { role, email, password, username, ...details } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: 'Email and Username are required' });
  }

  const newUserId = `user-${Math.random().toString(36).substr(2, 9)}`;
  const newUser: User = { id: newUserId, role: role || 'student' };
  mockUsers.push(newUser);

  if (role === 'student') {
    const newStudent: Student = {
      id: newUserId,
      full_name: details.full_name || username,
      email,
      phone: details.phone,
      gender: details.gender,
      dob: details.dob,
      roll_number: details.roll_number || `ROLL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      register_number: details.register_number || `REG-${Math.random().toString().substr(2, 8)}`,
      department: details.department || 'Computer Science & Engineering',
      year: parseInt(details.year) || 1,
      semester: parseInt(details.semester) || 1,
      section: details.section || 'A',
      student_type: details.student_type || 'day_scholar',
      hostel_block: details.hostel_block,
      room_number: details.room_number,
      floor_number: parseInt(details.floor_number),
      bed_number: details.bed_number,
      bus_number: details.bus_number,
      boarding_point: details.boarding_point,
      transport_type: details.transport_type,
      parking_details: details.parking_details,
      username
    };
    mockStudents.push(newStudent);
    return res.status(201).json({ user: newUser, profile: newStudent, token: `mock-token-${role}` });
  } else if (role === 'staff') {
    const newStaff: Staff = {
      id: newUserId,
      staff_name: details.staff_name || username,
      staff_id: details.staff_id || `STF-${Math.random().toString().substr(2, 4)}`,
      department: details.department || 'Computer Science & Engineering',
      designation: details.designation || 'Lecturer',
      email,
      phone: details.phone,
      username
    };
    mockStaffs.push(newStaff);
    return res.status(201).json({ user: newUser, profile: newStaff, token: `mock-token-${role}` });
  } else {
    const newAdmin: Admin = {
      id: newUserId,
      admin_name: details.admin_name || username,
      email,
      phone: details.phone,
      username
    };
    mockAdmins.push(newAdmin);
    return res.status(201).json({ user: newUser, profile: newAdmin, token: `mock-token-${role}` });
  }
});

// Login Handler
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Demo logs bypass
  if (email === 'student@university.edu' || email === 'alex.mercer@university.edu') {
    return res.json({
      user: mockUsers[0],
      profile: mockStudents[0],
      token: 'mock-token-student'
    });
  }
  if (email === 'staff@university.edu' || email === 'sarah.connor@university.edu') {
    return res.json({
      user: mockUsers[1],
      profile: mockStaffs[0],
      token: 'mock-token-staff'
    });
  }
  if (email === 'admin@university.edu' || email === 'admin.chief@university.edu') {
    return res.json({
      user: mockUsers[2],
      profile: mockAdmins[0],
      token: 'mock-token-admin'
    });
  }

  // Check matching lists
  const matchedStudent = mockStudents.find(s => s.email === email);
  if (matchedStudent) {
    const usr = mockUsers.find(u => u.id === matchedStudent.id);
    return res.json({ user: usr, profile: matchedStudent, token: 'mock-token-student' });
  }

  const matchedStaff = mockStaffs.find(s => s.email === email);
  if (matchedStaff) {
    const usr = mockUsers.find(u => u.id === matchedStaff.id);
    return res.json({ user: usr, profile: matchedStaff, token: 'mock-token-staff' });
  }

  const matchedAdmin = mockAdmins.find(a => a.email === email);
  if (matchedAdmin) {
    const usr = mockUsers.find(u => u.id === matchedAdmin.id);
    return res.json({ user: usr, profile: matchedAdmin, token: 'mock-token-admin' });
  }

  return res.status(401).json({ error: 'Invalid email/credentials or unregistered role' });
});

// Announcements Routes
app.get('/api/announcements', authenticate, (req: AuthRequest, res) => {
  const { category, department } = req.query;
  let filtered = [...mockAnnouncements];

  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }
  if (department) {
    filtered = filtered.filter(a => !a.department_filter || a.department_filter === department);
  }

  res.json(filtered);
});

app.post('/api/announcements', authenticate, requireRole(['staff', 'admin']), (req: AuthRequest, res) => {
  const { title, content, category, department_filter } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required' });
  }

  const newAnn: Announcement = {
    id: `ann-${Math.random().toString(36).substr(2, 9)}`,
    creator_id: req.user!.id,
    title,
    content,
    category: category || 'general_notice',
    department_filter,
    date: new Date().toISOString().split('T')[0]
  };

  mockAnnouncements.unshift(newAnn);
  io.emit('new-announcement', newAnn);

  res.status(201).json(newAnn);
});

// Complaints Routes
app.get('/api/complaints', authenticate, (req: AuthRequest, res) => {
  if (req.user!.role === 'student') {
    const list = mockComplaints.filter(c => c.student_id === req.user!.id);
    return res.json(list);
  }
  // Staff / Admin can view all
  res.json(mockComplaints);
});

app.post('/api/complaints', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { title, description, category, type, priority, location, images } = req.body;
  if (!title || !description || !category || !type) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const newComp: Complaint = {
    id: `comp-${Math.random().toString(36).substr(2, 9)}`,
    student_id: req.user!.id,
    title,
    description,
    category,
    type,
    priority: priority || 'medium',
    location,
    status: 'pending',
    images: images || [],
    created_at: new Date(),
    updated_at: new Date()
  };

  mockComplaints.unshift(newComp);

  mockComplaintLogs.push({
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    complaint_id: newComp.id,
    status: 'pending',
    comment: 'Complaint created.',
    actor_id: req.user!.id,
    created_at: new Date()
  });

  io.emit('complaint-updated', newComp);

  res.status(201).json(newComp);
});

app.get('/api/complaints/:id/logs', authenticate, (req, res) => {
  const logs = mockComplaintLogs.filter(l => l.complaint_id === req.params.id);
  res.json(logs);
});

app.put('/api/complaints/:id/status', authenticate, requireRole(['staff', 'admin']), (req: AuthRequest, res) => {
  const { status, comment } = req.body;
  const complaint = mockComplaints.find(c => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.status = status;
  complaint.updated_at = new Date();

  const log = {
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    complaint_id: complaint.id,
    status,
    comment: comment || `Status updated to ${status}.`,
    actor_id: req.user!.id,
    created_at: new Date()
  };

  mockComplaintLogs.push(log);
  io.emit('complaint-updated', complaint);

  res.json({ complaint, log });
});

// Polls Routes
app.get('/api/polls', authenticate, (req, res) => {
  res.json(mockPolls);
});

app.post('/api/polls', authenticate, requireRole(['staff', 'admin']), (req: AuthRequest, res) => {
  const { question, options, duration_days } = req.body;
  if (!question || !options || !Array.isArray(options)) {
    return res.status(400).json({ error: 'Question and Options array are required' });
  }

  const initialVotes: Record<number, number> = {};
  options.forEach((_, idx) => { initialVotes[idx] = 0; });

  const newPoll: Poll = {
    id: `poll-${Math.random().toString(36).substr(2, 9)}`,
    creator_id: req.user!.id,
    question,
    options,
    expires_at: new Date(Date.now() + (duration_days || 3) * 24 * 60 * 60 * 1000).toISOString(),
    votes: initialVotes
  };

  mockPolls.unshift(newPoll);
  io.emit('new-poll', newPoll);

  res.status(201).json(newPoll);
});

app.post('/api/polls/:id/vote', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { optionIndex } = req.body;
  const poll = mockPolls.find(p => p.id === req.params.id);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  const existingVote = mockPollVotes.find(v => v.poll_id === poll.id && v.student_id === req.user!.id);
  if (existingVote) {
    return res.status(400).json({ error: 'You have already voted on this poll' });
  }

  mockPollVotes.push({
    id: `vote-${Math.random().toString(36).substr(2, 9)}`,
    poll_id: poll.id,
    student_id: req.user!.id,
    option_index: optionIndex,
    created_at: new Date()
  });

  if (!poll.votes) poll.votes = {};
  poll.votes[optionIndex] = (poll.votes[optionIndex] || 0) + 1;

  io.emit('poll-votes-updated', poll);
  res.json(poll);
});

// Study Rooms Workspace & Files Routes
app.get('/api/study-rooms', authenticate, (req: AuthRequest, res) => {
  const list = mockStudyRooms.filter(r => 
    mockRoomMembers.some(m => m.room_id === r.id && m.student_id === req.user!.id)
  );
  res.json(list);
});

app.post('/api/study-rooms', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  const code = `SYNC-${Math.floor(100 + Math.random() * 900)}`;
  const newRoom: StudyRoom = {
    id: `room-${Math.random().toString(36).substr(2, 9)}`,
    name,
    code,
    creator_id: req.user!.id
  };

  mockStudyRooms.push(newRoom);
  mockRoomMembers.push({
    id: `rm-${Math.random().toString(36).substr(2, 9)}`,
    room_id: newRoom.id,
    student_id: req.user!.id,
    joined_at: new Date()
  });

  res.status(201).json(newRoom);
});

app.post('/api/study-rooms/join', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { code } = req.body;
  const room = mockStudyRooms.find(r => r.code === code);
  if (!room) {
    return res.status(404).json({ error: 'Room code not found' });
  }

  const isMember = mockRoomMembers.some(m => m.room_id === room.id && m.student_id === req.user!.id);
  if (isMember) {
    return res.json(room); // Already joined
  }

  mockRoomMembers.push({
    id: `rm-${Math.random().toString(36).substr(2, 9)}`,
    room_id: room.id,
    student_id: req.user!.id,
    joined_at: new Date()
  });

  res.json(room);
});

app.get('/api/study-rooms/:id/messages', authenticate, (req, res) => {
  const msgs = mockMessages.filter(m => m.room_id === req.params.id);
  res.json(msgs);
});

app.get('/api/study-rooms/:id/files', authenticate, (req, res) => {
  const fls = mockFiles.filter(f => f.room_id === req.params.id);
  res.json(fls);
});

app.post('/api/study-rooms/:id/files', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { name, url, type, size } = req.body;
  if (!name || !url || !type) {
    return res.status(400).json({ error: 'File details missing' });
  }

  const newFile = {
    id: `file-${Math.random().toString(36).substr(2, 9)}`,
    room_id: req.params.id,
    uploader_id: req.user!.id,
    name,
    url,
    type,
    size: size || 1024,
    version: 1,
    created_at: new Date()
  };

  mockFiles.push(newFile);
  
  // Socket broadcast file add event
  io.to(req.params.id).emit('file-uploaded', newFile);
  res.status(201).json(newFile);
});

// Digital Notes Hub (General)
app.get('/api/notes', authenticate, (req, res) => {
  const { department, subject, semester } = req.query;
  let list = [...mockNotes];
  if (department) list = list.filter(n => n.department === department);
  if (subject) list = list.filter(n => n.subject === subject);
  if (semester) list = list.filter(n => n.semester === parseInt(semester as string));
  res.json(list);
});

app.post('/api/notes', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { title, description, url, department, subject, semester } = req.body;
  const note = {
    id: `note-${Math.random().toString(36).substr(2, 9)}`,
    uploader_id: req.user!.id,
    title,
    description,
    url: url || '#',
    department,
    subject,
    semester: parseInt(semester) || 1,
    created_at: new Date()
  };
  mockNotes.push(note);
  res.status(201).json(note);
});

// Lost and Found Routes
app.get('/api/lost-found', authenticate, (req, res) => {
  res.json(mockLostFound);
});

app.post('/api/lost-found', authenticate, (req: AuthRequest, res) => {
  const { title, description, image_url, type, location, date } = req.body;
  const item = {
    id: `lf-${Math.random().toString(36).substr(2, 9)}`,
    reporter_id: req.user!.id,
    title,
    description,
    image_url,
    status: 'lost',
    type,
    location,
    date: date || new Date().toISOString().split('T')[0],
    created_at: new Date()
  };
  mockLostFound.unshift(item);
  io.emit('lost-found-update', item);
  res.status(201).json(item);
});

app.put('/api/lost-found/:id/resolve', authenticate, (req, res) => {
  const item = mockLostFound.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.status = 'resolved';
  res.json(item);
});

// Campus Marketplace
app.get('/api/marketplace', authenticate, (req, res) => {
  res.json(mockMarketplace);
});

app.post('/api/marketplace', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const { title, description, price, category, image_url } = req.body;
  const newItem = {
    id: `mp-${Math.random().toString(36).substr(2, 9)}`,
    seller_id: req.user!.id,
    title,
    description,
    price: parseFloat(price) || 0.00,
    category,
    status: 'available',
    image_url: image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    created_at: new Date()
  };
  mockMarketplace.unshift(newItem);
  res.status(201).json(newItem);
});

// Events & Registrations
app.get('/api/events', authenticate, (req, res) => {
  res.json(mockEvents);
});

app.post('/api/events', authenticate, requireRole(['staff', 'admin']), (req, res) => {
  const { title, description, category, date, venue, qr_required } = req.body;
  const newEv = {
    id: `ev-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    category,
    date: date || new Date(Date.now() + 5*24*60*60*1000).toISOString(),
    venue,
    qr_required: qr_required !== false
  };
  mockEvents.push(newEv);
  res.status(201).json(newEv);
});

app.post('/api/events/:id/register', authenticate, requireRole(['student']), (req: AuthRequest, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  
  const registered = mockRegistrations.find(r => r.event_id === event.id && r.student_id === req.user!.id);
  if (registered) return res.json(registered); // Already registered

  const code = `QR-${event.id.substr(0,4)}-${req.user!.id.substr(0,4)}`;
  const reg = {
    id: `reg-${Math.random().toString(36).substr(2, 9)}`,
    event_id: event.id,
    student_id: req.user!.id,
    qr_code: code,
    attended: false,
    created_at: new Date()
  };
  mockRegistrations.push(reg);
  res.status(201).json(reg);
});

// Admin User Management Routes
app.get('/api/users', authenticate, requireRole(['admin']), (req, res) => {
  res.json({
    students: mockStudents,
    staffs: mockStaffs,
    admins: mockAdmins
  });
});

app.delete('/api/users/:id', authenticate, requireRole(['admin']), (req, res) => {
  mockStudents = mockStudents.filter(s => s.id !== req.params.id);
  mockStaffs = mockStaffs.filter(s => s.id !== req.params.id);
  mockAdmins = mockAdmins.filter(s => s.id !== req.params.id);
  mockUsers = mockUsers.filter(u => u.id !== req.params.id);
  res.json({ success: true });
});

// Analytics Route
app.get('/api/analytics', authenticate, (req, res) => {
  // Aggregate mock calculations
  res.json({
    userGrowth: [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 240 },
      { month: 'Mar', count: 350 },
      { month: 'Apr', count: 580 },
      { month: 'May', count: 890 },
      { month: 'Jun', count: 1240 }
    ],
    complaintTrends: [
      { category: 'Water', open: 12, resolved: 85 },
      { category: 'Electricity', open: 5, resolved: 90 },
      { category: 'WiFi', open: 18, resolved: 40 },
      { category: 'Transport', open: 2, resolved: 30 }
    ],
    departmentActivity: [
      { name: 'CSE', projects: 45, events: 12 },
      { name: 'ECE', projects: 22, events: 8 },
      { name: 'MECH', projects: 15, events: 5 },
      { name: 'CIVIL', projects: 8, events: 2 }
    ],
    generalStats: {
      totalStudents: mockStudents.length + 1200,
      totalStaff: mockStaffs.length + 85,
      resolvedComplaintsCount: 312,
      activeRooms: mockStudyRooms.length + 38
    }
  });
});

app.get('/api/audit-logs', authenticate, requireRole(['admin']), (req, res) => {
  res.json(mockAuditLogs);
});

// ==========================================
// SOCKET.IO LOGIC HANDLER
// ==========================================
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join workspace chat room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined study room: ${roomId}`);
  });

  // Handle chat message sending
  socket.on('send-message', (data) => {
    const { roomId, senderId, content } = data;
    const msg: Message = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      room_id: roomId,
      sender_id: senderId,
      content,
      created_at: new Date()
    };
    mockMessages.push(msg);

    // Broadcast message to room
    io.to(roomId).emit('receive-message', msg);
  });

  // Handle live notifications
  socket.on('push-notification', (data) => {
    // Alert specific user or role
    io.emit('new-notification', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`UniSync Core Engine running on port: ${PORT}`);
  console.log(`Real-time WebSockets configured & bound.`);
  console.log(`RBAC Authorization checks active.`);
  console.log(`Ready for Student, Staff, and Admin integrations.`);
  console.log(`=======================================================`);
});
