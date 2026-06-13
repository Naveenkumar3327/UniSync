import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { 
  CalendarDays, Plus, HelpCircle, FileText, Megaphone, 
  BarChart2, BookOpen, Clock, Activity, CheckCircle2 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const profile = user?.profile || {};

  // Exam state
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examVenue, setExamVenue] = useState('Auditorium Block');
  const [examDept, setExamDept] = useState('Computer Science & Engineering');
  const [examsList, setExamsList] = useState<any[]>([
    { subject: 'Operating Systems', date: '2026-06-18', time: '10:00 AM', venue: 'Auditorium Block-C', department: 'Computer Science & Engineering' }
  ]);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState('');
  const [pollDuration, setPollDuration] = useState('3');
  const [pollsList, setPollsList] = useState<any[]>([
    { question: 'Lab Extension Hours', options: ['Yes', 'No'], votes: { 0: 42, 1: 12 } }
  ]);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject || !examDate || !examTime) return;
    const newExam = {
      subject: examSubject,
      date: examDate,
      time: examTime,
      venue: examVenue,
      department: examDept
    };
    setExamsList([...examsList, newExam]);
    setExamSubject('');
    setExamDate('');
    setExamTime('');
    alert('Exam notification published successfully!');
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion || !pollOptions) return;
    const optionsArray = pollOptions.split(',').map(o => o.trim()).filter(Boolean);
    if (optionsArray.length < 2) {
      alert('Please provide at least 2 comma-separated options.');
      return;
    }

    try {
      const token = user?.token;
      await axios.post(
        `${API_URL}/api/polls`,
        { question: pollQuestion, options: optionsArray, duration_days: parseInt(pollDuration) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Live Poll published to students!');
    } catch (err) {
      // Offline fallback
      const initialVotes: any = {};
      optionsArray.forEach((_, i) => { initialVotes[i] = 0; });
      const newPoll = {
        question: pollQuestion,
        options: optionsArray,
        votes: initialVotes
      };
      setPollsList([...pollsList, newPoll]);
      alert('Mock Poll published successfully (Local Cache Mode)!');
    }
    setPollQuestion('');
    setPollOptions('');
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Card */}
      <div className="glass-panel p-6 rounded-3xl border border-card-border relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-transparent to-transparent">
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-10 pointer-events-none">
          <CalendarDays className="w-64 h-64 text-purple-500" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">
            Faculty Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text">
            Welcome back, {profile.staff_name || 'Dr. Sarah Connor'}!
          </h2>
          <p className="text-xs text-text-muted max-w-lg leading-relaxed">
            Configure examination schedules, moderate study rooms activities, edit timetables, and compile interactive student polls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Exam Planner widget */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border">
          <div className="border-b border-card-border pb-3 mb-6">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" /> Publish Exam Schedule
            </h3>
          </div>

          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Subject</label>
                <input type="text" required value={examSubject} onChange={e => setExamSubject(e.target.value)} placeholder="Operating Systems" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Venue</label>
                <input type="text" value={examVenue} onChange={e => setExamVenue(e.target.value)} placeholder="Auditorium Block-C" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Exam Date</label>
                <input type="date" required value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Exam Time</label>
                <input type="text" required value={examTime} onChange={e => setExamTime(e.target.value)} placeholder="10:00 AM - 01:00 PM" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-premium">
              <Plus size={14} /> Publish Exam Notification
            </button>
          </form>

          {/* Local published exams list summary */}
          <div className="mt-6 space-y-2">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Active Published Schedules</h4>
            {examsList.map((ex, idx) => (
              <div key={idx} className="p-3 bg-background-alt rounded-xl border border-card-border flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-text">{ex.subject}</div>
                  <div className="text-[10px] text-text-muted">{ex.venue} &bull; {ex.time}</div>
                </div>
                <div className="text-[10px] font-semibold text-primary">{ex.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Poll Launcher widget */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border">
          <div className="border-b border-card-border pb-3 mb-6">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <HelpCircle size={18} className="text-primary" /> Create Realtime Student Poll
            </h3>
          </div>

          <form onSubmit={handleCreatePoll} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Poll Question</label>
              <input type="text" required value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="Should we extend lab hours to 10:00 PM?" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Options (comma-separated)</label>
              <input type="text" required value={pollOptions} onChange={e => setPollOptions(e.target.value)} placeholder="Yes, No, Neutral" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary text-text" />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-premium">
              <Plus size={14} /> Launch Live Poll
            </button>
          </form>

          {/* Local published polls summary */}
          <div className="mt-6 space-y-2">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Active Published Polls</h4>
            {pollsList.map((pl, idx) => (
              <div key={idx} className="p-3 bg-background-alt rounded-xl border border-card-border text-xs">
                <div className="font-bold text-text mb-2">{pl.question}</div>
                <div className="flex gap-2">
                  {pl.options.map((opt: string, oIdx: number) => (
                    <span key={oIdx} className="bg-card border border-card-border px-2.5 py-1 rounded text-[10px] font-semibold text-text-muted">
                      {opt} ({(pl.votes?.[oIdx] || 0)} votes)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
