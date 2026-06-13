import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Calendar, Clock, ShieldAlert, Award, FileText, 
  HelpCircle, MessageSquare, Plus, ArrowRight, BookOpen, AlertTriangle, Users 
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const profile = user?.profile || {};

  const todayClasses = [
    { time: "09:30 AM - 10:30 AM", subject: "Operating Systems", room: "L-302", professor: "Dr. Sarah Connor" },
    { time: "11:00 AM - 12:00 PM", subject: "Database Management Systems", room: "L-104", professor: "Prof. Davis" },
    { time: "01:30 PM - 03:00 PM", subject: "Web Technology Lab", room: "Lab-4", professor: "Mrs. Watson" }
  ];

  const exams = [
    { subject: "Operating Systems", date: "June 18, 2026", time: "10:00 AM", type: "Internal Assessment 2" },
    { subject: "Database Systems", date: "June 20, 2026", time: "10:00 AM", type: "Internal Assessment 2" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Card */}
      <div className="glass-panel p-6 rounded-3xl border border-card-border relative overflow-hidden bg-gradient-to-r from-primary-light via-transparent to-transparent">
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 text-primary" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
            Student Academic Console
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text">
            Welcome back, {profile.full_name || 'Student'}!
          </h2>
          <p className="text-xs text-text-muted max-w-lg leading-relaxed">
            Monitor your class timetable, coordinate in study workspace rooms, report hostel or transport logs, and view circular alerts.
          </p>
        </div>
      </div>

      {/* Grid Dashboard Layout widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Classes Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
          <div className="border-b border-card-border pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Today's Schedule
            </h3>
            <span className="text-[10px] text-text-muted font-bold">Sem-6</span>
          </div>

          <div className="space-y-3.5 flex-1">
            {todayClasses.map((cls, idx) => (
              <div key={idx} className="p-3 bg-background-alt rounded-xl border border-card-border hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-text">{cls.subject}</span>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{cls.room}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-text-muted">
                  <span>{cls.professor}</span>
                  <span>{cls.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
          <div className="border-b border-card-border pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Exam Notifications
            </h3>
            <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">2 warnings</span>
          </div>

          <div className="space-y-3.5 flex-1">
            {exams.map((ex, idx) => (
              <div key={idx} className="p-3 bg-background-alt rounded-xl border border-card-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex flex-col items-center justify-center font-bold font-display text-xs">
                  <span>{ex.date.split(' ')[1].replace(',', '')}</span>
                  <span className="text-[9px] uppercase">{ex.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-text leading-tight">{ex.subject}</div>
                  <div className="text-[10px] text-text-muted flex justify-between mt-1">
                    <span>{ex.type}</span>
                    <span>{ex.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Shortcut links */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
          <div className="border-b border-card-border pb-3 mb-4">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <Award size={16} className="text-primary" /> Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <button
              onClick={() => navigate('/dashboard/student/complaints')}
              className="p-3 rounded-xl border border-card-border bg-background-alt hover:bg-primary-light hover:border-primary/30 transition-all text-left flex flex-col justify-between"
            >
              <FileText size={18} className="text-primary mb-3" />
              <div>
                <div className="text-xs font-bold text-text">File Log</div>
                <div className="text-[9px] text-text-muted">Register complaint</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/student/study-workspace')}
              className="p-3 rounded-xl border border-card-border bg-background-alt hover:bg-primary-light hover:border-primary/30 transition-all text-left flex flex-col justify-between"
            >
              <BookOpen size={18} className="text-primary mb-3" />
              <div>
                <div className="text-xs font-bold text-text">Workspace</div>
                <div className="text-[9px] text-text-muted">Launch study room</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/student/collaboration')}
              className="p-3 rounded-xl border border-card-border bg-background-alt hover:bg-primary-light hover:border-primary/30 transition-all text-left flex flex-col justify-between"
            >
              <Users size={18} className="text-primary mb-3" />
              <div>
                <div className="text-xs font-bold text-text">Join Teams</div>
                <div className="text-[9px] text-text-muted">Hackathon matching</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/student/marketplace')}
              className="p-3 rounded-xl border border-card-border bg-background-alt hover:bg-primary-light hover:border-primary/30 transition-all text-left flex flex-col justify-between"
            >
              <Award size={18} className="text-primary mb-3" />
              <div>
                <div className="text-xs font-bold text-text">Marketplace</div>
                <div className="text-[9px] text-text-muted">Buy/Sell items</div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Dashboard widgets: active poll and notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Poll banner */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3">
            <HelpCircle size={16} />
            <span>Active Student Poll Indicator</span>
          </div>
          <h4 className="text-sm font-bold text-text mb-4">
            Should we extend the computer lab hours to 10:00 PM during exams?
          </h4>
          <button 
            onClick={() => navigate('/dashboard/student/polls')}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            Go Vote Now <ArrowRight size={12} />
          </button>
        </div>

        {/* Complaint timeline shortcut info status */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs mb-3">
            <AlertTriangle size={16} />
            <span>My Complaint Logs Status</span>
          </div>
          <div className="p-3.5 bg-background-alt rounded-xl border border-card-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-text truncate max-w-xs">WiFi Connection Failure in Block 3</div>
              <div className="text-[10px] text-text-muted">Alpha Block Room 302 &bull; High Priority</div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded">
              Pending
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard/student/complaints')}
            className="text-xs text-primary font-bold mt-4 text-center hover:underline self-center"
          >
            Track Status Timeline Logs
          </button>
        </div>

      </div>

    </div>
  );
}
