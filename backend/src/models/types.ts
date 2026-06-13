export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}

export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  roll_number: string;
  register_number: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  student_type: 'hosteller' | 'day_scholar';
  hostel_block?: string;
  room_number?: string;
  floor_number?: number;
  bed_number?: string;
  bus_number?: string;
  boarding_point?: string;
  transport_type?: string;
  parking_details?: string;
  username: string;
}

export interface Staff {
  id: string;
  staff_name: string;
  staff_id: string;
  department: string;
  designation: string;
  email: string;
  phone?: string;
  username: string;
}

export interface Admin {
  id: string;
  admin_name: string;
  email: string;
  phone?: string;
  username: string;
}

export interface Announcement {
  id: string;
  creator_id: string;
  title: string;
  content: string;
  category: 'exam_notice' | 'placement_drive' | 'workshop' | 'symposium' | 'hackathon' | 'club_event' | 'general_notice';
  department_filter?: string;
  date: string;
  created_at?: Date;
}

export interface Complaint {
  id: string;
  student_id: string;
  title: string;
  description: string;
  category: string;
  type: 'hostel' | 'day_scholar';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  images?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Poll {
  id: string;
  creator_id: string;
  question: string;
  options: string[];
  expires_at: string;
  created_at?: Date;
  votes?: Record<number, number>; // Calculated options index mapping
}

export interface StudyRoom {
  id: string;
  name: string;
  code: string;
  creator_id: string;
  created_at?: Date;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at?: Date;
}
