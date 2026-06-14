import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import {
  Announcements, Complaints, StudyWorkspace, LostFound,
  Polls, Marketplace, Achievements, EventRegistration,
  Notifications, ProfilePage
} from './pages/FeaturePages';
import OpportunityHub from './pages/OpportunityHub';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Gate Routes */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Dashboard Layout Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Student Specific Sub-routes */}
          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/announcements" element={<Announcements />} />
          <Route path="student/opportunity-hub" element={<OpportunityHub />} />
          <Route path="student/complaints" element={<Complaints />} />
          <Route path="student/lost-found" element={<LostFound />} />
          <Route path="student/collaboration" element={<StudyWorkspace />} />
          <Route path="student/study-workspace" element={<StudyWorkspace />} />
          <Route path="student/polls" element={<Polls />} />
          <Route path="student/marketplace" element={<Marketplace />} />
          <Route path="student/achievements" element={<Achievements />} />
          <Route path="student/notifications" element={<Notifications />} />
          <Route path="student/profile" element={<ProfilePage />} />

          {/* Staff Specific Sub-routes */}
          <Route path="staff" element={<StaffDashboard />} />
          <Route path="staff/exams" element={<StaffDashboard />} />
          <Route path="staff/timetable" element={<StaffDashboard />} />
          <Route path="staff/announcements" element={<Announcements />} />
          <Route path="staff/polls" element={<StaffDashboard />} />
          <Route path="staff/collaborations" element={<StudyWorkspace />} />
          <Route path="staff/analytics" element={<Notifications />} />
          <Route path="staff/notifications" element={<Notifications />} />
          <Route path="staff/profile" element={<ProfilePage />} />

          {/* Admin Specific Sub-routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminDashboard />} />
          <Route path="admin/complaints" element={<AdminDashboard />} />
          <Route path="admin/announcements" element={<Announcements />} />
          <Route path="admin/lost-found" element={<AdminDashboard />} />
          <Route path="admin/analytics" element={<AdminDashboard />} />
          <Route path="admin/audit-logs" element={<AdminDashboard />} />
          <Route path="admin/notifications" element={<Notifications />} />
          <Route path="admin/profile" element={<ProfilePage />} />

          {/* Default fallback redirects */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>

        {/* Global Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
