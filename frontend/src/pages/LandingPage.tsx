import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampusScene from '../components/CampusScene';
import { 
  ArrowRight, ShieldCheck, Zap, Sparkles, BookOpen, 
  MessageSquare, PieChart, Users, CheckCircle2, ChevronDown 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is UniSync?",
      a: "UniSync is an all-in-one digital operating system built for modern universities. It unites academic resources, real-time collaboration study workspaces, hostel/transport complaints, circular alerts, and executive analytics into one secure dashboard."
    },
    {
      q: "Does it support custom themes for students and staff?",
      a: "Yes! UniSync implements role-based visual experiences. Students receive an academic-blue look, staff get a faculty-purple style, and administrators manage the platform through an executive-orange command console."
    },
    {
      q: "How does the Realtime Study Workspace function?",
      a: "Students can create private project groups or study rooms, invite members via usernames, share documents, notes, view revision histories, and collaborate in real-time using Socket.io chat feeds."
    },
    {
      q: "Can transport and hostel complaints be submitted?",
      a: "Absolutely. Students can submit complaints detailing priority, block details, bus routes, upload image screenshots, and monitor the timeline logs (Pending -> Assigned -> In Progress -> Resolved -> Closed)."
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-text overflow-x-hidden selection:bg-primary selection:text-white">
      {/* 3D campus background scene wrapper */}
      <div className="absolute inset-0 h-[800px] w-full z-0">
        <CampusScene />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Nav bar header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl animate-float">
            U
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            UniSync
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-semibold text-text hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth?register=true')}
            className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-hover shadow-premium transition-all hover:scale-105 flex items-center gap-1.5"
          >
            Register Profile <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light dark:bg-slate-800/80 border border-primary/20 text-primary mb-6 animate-pulse">
          <Sparkles size={14} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Next-Gen University Operating System</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-text leading-tight mb-6">
          One Campus. One Platform.<br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Infinite Connections.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-2xl mb-10 leading-relaxed">
          UniSync unifies Students, Staff, Administrators, Hostel logs, Transport tracking, Academic files, Events, and Collaboration workspaces into a single intelligent portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-hover shadow-premium transition-all hover:scale-105 flex items-center gap-2 text-sm"
          >
            Launch Workspace <ArrowRight size={16} />
          </button>
          <a
            href="#features"
            className="px-6 py-3.5 rounded-xl text-sm font-bold border border-card-border glass-panel hover:bg-background-alt transition-colors"
          >
            Explore Ecosystem
          </a>
        </div>

        {/* Dynamic Statistics counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-24">
          {[
            { value: "10k+", label: "Active Students" },
            { value: "450+", label: "Faculty Members" },
            { value: "98.4%", label: "Complaints Solved" },
            { value: "120+", label: "Project Teams" }
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-card-border">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary font-display mb-1">{stat.value}</div>
              <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-card-border">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Complete Digital Architecture</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Engineered to streamline all divisions, operational assets, and community communication vectors of a modern university.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Study Workspace Rooms",
              desc: "Create rooms to chat, share lecture materials (PDF, DOCX, PPT), review revision history logs, and write comments collectively."
            },
            {
              icon: MessageSquare,
              title: "Complaint Resolution Engine",
              desc: "Hostel & Day-Scholar complaint boards showing status tracking timeline (Pending -> Assigned -> In Progress -> Resolved -> Closed)."
            },
            {
              icon: PieChart,
              title: "Analytics Command",
              desc: "Deep reporting telemetry using animated charts. Track student growth metrics, circular notices, and resolution times."
            },
            {
              icon: Users,
              title: "Collaborations & Hackathons",
              desc: "Recruit developers, photographers, and researchers. Build groups to represent the university in global symposiums."
            },
            {
              icon: Zap,
              title: "Realtime Updates",
              desc: "Receive instant notifications of circular notices, student join requests, workspace chats, and live poll updates."
            },
            {
              icon: ShieldCheck,
              title: "Role-Based Control (RBAC)",
              desc: "Dedicated user structures for Student, Staff, and Admins. Protected routes and token authorizations guarantee absolute security."
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-card-border transition-all duration-300 hover:scale-103 group hover:shadow-premium">
                <div className="w-10 h-10 rounded-lg bg-primary-light dark:bg-slate-800/80 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2 font-display text-text">{feat.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROLE BENEFITS */}
      <section className="relative z-10 bg-background-alt/50 py-24 border-y border-card-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">Tailored Visual Experiences</h2>
            <p className="text-text-muted text-sm">Each division receives custom features and custom design system themes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student card */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">Student Dashboard</span>
                <h3 className="text-xl font-bold font-display mt-4 mb-3">Academic Blue Accent</h3>
                <ul className="space-y-2.5 text-xs text-text-muted mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Share Digital Notes Hub assets</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Buy/Sell items on Marketplace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Get events registration pass QR codes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Hosteller & Day-Scholar complaints</li>
                </ul>
              </div>
              <button onClick={() => navigate('/auth')} className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:gap-2 transition-all">
                Try Student view <ArrowRight size={14} />
              </button>
            </div>

            {/* Staff card */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">Faculty Dashboard</span>
                <h3 className="text-xl font-bold font-display mt-4 mb-3">Professional Purple Accent</h3>
                <ul className="space-y-2.5 text-xs text-text-muted mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Upload internal exams schedules</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Edit department class timetables</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Launch real-time student polls</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Oversee student collaborations</li>
                </ul>
              </div>
              <button onClick={() => navigate('/auth')} className="text-xs font-bold text-purple-500 flex items-center gap-1 hover:gap-2 transition-all">
                Try Faculty view <ArrowRight size={14} />
              </button>
            </div>

            {/* Admin card */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">Admin Dashboard</span>
                <h3 className="text-xl font-bold font-display mt-4 mb-3">Executive Orange Accent</h3>
                <ul className="space-y-2.5 text-xs text-text-muted mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Create, edit, suspend users</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Moderate marketplace listings</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Track complaint resolutions metrics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Check system logs and audits</li>
                </ul>
              </div>
              <button onClick={() => navigate('/auth')} className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all">
                Try Admin view <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-text-muted text-sm">Everything you need to know about the UniSync Operating System.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-card-border overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-text focus:outline-none hover:bg-background-alt/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-text-muted transition-transform duration-300 ${activeFaq === idx ? 'transform rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT INFO / FOOTER */}
      <footer className="relative z-10 bg-background border-t border-card-border py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              U
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UniSync
            </span>
          </div>

          <div className="text-center text-xs text-text-muted">
            &copy; 2026 UniSync Platform. Designed for modern higher education ecosystems.
          </div>

          <div className="flex justify-end gap-6 text-xs text-text-muted font-semibold">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="/auth" className="hover:text-primary transition-colors">Login Portal</a>
            <a href="mailto:support@unisync.edu" className="hover:text-primary transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
