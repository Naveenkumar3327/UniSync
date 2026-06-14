import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { 
  Megaphone, FileText, Search, BookOpen, BarChart2, 
  DollarSign, Trophy, Bell, Settings, Send, Paperclip, 
  Plus, Calendar, QrCode, Heart, MessageCircle, ShieldAlert,
  User, Lock, Mail, Hash
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==========================================
// 1. ANNOUNCEMENTS PAGE
// ==========================================
export function Announcements() {
  const { user } = useAuthStore();
  const [anns, setAnns] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/announcements`, { headers: { Authorization: `Bearer ${user?.token}` } });
        setAnns(res.data);
      } catch {
        setAnns([
          { id: 'a1', title: 'Model Exams Timetable', content: 'All 3rd-year CS students are requested to download the timetable.', category: 'exam_notice', date: '2026-06-12' },
          { id: 'a2', title: 'UniSync Hackathon Open', content: 'Grand prize of $5000. Registration active.', category: 'hackathon', date: '2026-06-11' }
        ]);
      }
    };
    fetch();
  }, [user]);

  const filtered = anns.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(filter.toLowerCase()) || a.content.toLowerCase().includes(filter.toLowerCase());
    const matchesCat = category ? a.category === category : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-text">Campus Announcements</h2>
          <p className="text-xs text-text-muted">Stay updated with placement drives, circulars, and events.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          placeholder="Search circulars..." 
          className="flex-1 bg-background-alt border border-card-border rounded-xl px-4 py-2 text-xs text-text focus:outline-none" 
        />
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="bg-background-alt border border-card-border rounded-xl px-4 py-2 text-xs text-text focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="exam_notice">Exam Notice</option>
          <option value="placement_drive">Placement Drive</option>
          <option value="hackathon">Hackathon</option>
          <option value="club_event">Club Event</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(a => (
          <div key={a.id} className="glass-panel p-5 rounded-2xl border border-card-border space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                {a.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-text-muted">{a.date}</span>
            </div>
            <h3 className="text-sm font-bold text-text">{a.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. COMPLAINTS PAGE (Student View with Timelines)
// ==========================================
export function Complaints() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('WiFi');
  const [type, setType] = useState<'hostel' | 'day_scholar'>('hostel');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [logs, setLogs] = useState<Record<string, any[]>>({});

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints`, { headers: { Authorization: `Bearer ${user?.token}` } });
      setComplaints(res.data);
      // Fetch status logs for each complaint
      res.data.forEach(async (c: any) => {
        try {
          const lRes = await axios.get(`${API_URL}/api/complaints/${c.id}/logs`, { headers: { Authorization: `Bearer ${user?.token}` } });
          setLogs(prev => ({ ...prev, [c.id]: lRes.data }));
        } catch {
          setLogs(prev => ({ ...prev, [c.id]: [{ status: 'pending', comment: 'Complaint lodged.', actor_id: user?.id, created_at: c.created_at }] }));
        }
      });
    } catch {
      const demoComp = [
        { id: 'c1', title: 'WiFi Connection Failure in Block 3 Room 302', description: 'The primary access point is blinking red.', category: 'WiFi', type: 'hostel', priority: 'high', location: 'Alpha Block Room 302', status: 'pending', created_at: new Date().toISOString() }
      ];
      setComplaints(demoComp);
      setLogs({ c1: [{ status: 'pending', comment: 'Complaint lodged.', actor_id: user?.id, created_at: new Date().toISOString() }] });
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;
    try {
      await axios.post(`${API_URL}/api/complaints`, { title, description: desc, category, type, priority, location }, { headers: { Authorization: `Bearer ${user?.token}` } });
      alert('Complaint lodged successfully!');
      fetchComplaints();
    } catch {
      // Offline fallback addition
      const mockId = `c-mock-${Math.random()}`;
      const newComp = { id: mockId, title, description: desc, category, type, priority, location, status: 'pending', created_at: new Date().toISOString() };
      setComplaints([newComp, ...complaints]);
      setLogs(prev => ({ ...prev, [mockId]: [{ status: 'pending', comment: 'Complaint lodged (Local Mode).', actor_id: user?.id, created_at: new Date().toISOString() }] }));
      alert('Complaint registered locally.');
    }
    setTitle('');
    setDesc('');
    setLocation('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* File log form */}
      <div className="glass-panel p-5 rounded-2xl border border-card-border h-fit">
        <h3 className="text-sm font-bold text-text mb-4">File Hostel / Day-Scholar Log</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Issue Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="WiFi Access Failure" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text">
                <option value="hostel">Hostel</option>
                <option value="day_scholar">Day Scholar</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Location Details</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Block 3, Room 302" className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Description</label>
            <textarea required rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain the technical issue clearly..." className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs text-text focus:outline-none focus:border-primary" />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-premium">
            Submit Complaint
          </button>
        </form>
      </div>

      {/* Complaints Tracking list */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-text mb-4">My Lodged Complaints & Status Timelines</h3>
        {complaints.map(c => {
          const compLogs = logs[c.id] || [];
          return (
            <div key={c.id} className="glass-panel p-5 rounded-2xl border border-card-border space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-text">{c.title}</h4>
                  <p className="text-[10px] text-text-muted uppercase mt-0.5">{c.category} &bull; {c.location}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  c.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                  c.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                }`}>{c.status}</span>
              </div>
              
              <p className="text-xs text-text-muted leading-relaxed">{c.description}</p>
              
              {/* Visual Vertical Timeline tracking */}
              <div className="border-t border-card-border pt-4">
                <h5 className="text-[10px] font-bold text-text uppercase tracking-wider mb-3">Resolution Timeline Tracker</h5>
                <div className="space-y-4 relative pl-4 border-l border-card-border">
                  {compLogs.map((l, lIdx) => (
                    <div key={lIdx} className="relative">
                      {/* Timeline dot bubble */}
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                      <div className="text-[11px] font-bold text-text capitalize">{l.status.replace('_', ' ')}</div>
                      <p className="text-[10px] text-text-muted mt-0.5">{l.comment}</p>
                      <span className="text-[9px] text-text-muted font-mono">{new Date(l.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ==========================================
// 3. STUDY WORKSPACE PAGE (Socket Live Chat & Files)
// ==========================================
export function StudyWorkspace() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  // Simulation fallback triggers
  useEffect(() => {
    setRooms([
      { id: 'room1', name: 'CS302 Project Discussion Group', code: 'SYNC-902' }
    ]);
  }, []);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;
    const code = `SYNC-${Math.floor(100 + Math.random()*900)}`;
    const newRoom = { id: `room-${Math.random()}`, name: newRoomName, code };
    setRooms([...rooms, newRoom]);
    setNewRoomName('');
    alert(`Workspace created! Invite code is: ${code}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const found = rooms.find(r => r.code === roomCode);
    if (found) {
      setActiveRoom(found);
      loadRoomState(found.id);
    } else {
      alert('Room code not found in directory');
    }
  };

  const loadRoomState = (roomId: string) => {
    setMessages([
      { id: 'm1', sender_id: '11111111-1111-1111-1111-111111111111', content: 'Welcome everyone! Uploading the main slides for our presentation here.', created_at: new Date() }
    ]);
    setFiles([
      { id: 'f1', name: 'Project_Outline.pdf', type: 'pdf', size: 1048576, version: 1, created_at: new Date() }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput || !activeRoom) return;
    const newMsg = {
      id: `m-mock-${Math.random()}`,
      sender_id: user?.id,
      content: chatInput,
      created_at: new Date()
    };
    setMessages([...messages, newMsg]);
    setChatInput('');
  };

  const handleSimulateFileUpload = () => {
    if (!activeRoom) return;
    const newFile = {
      id: `f-mock-${Math.random()}`,
      name: 'LectureNotesSem6.docx',
      type: 'docx',
      size: 524288,
      version: 1,
      created_at: new Date()
    };
    setFiles([...files, newFile]);
    alert('File uploaded to room workspace.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
      
      {/* Rooms Directory List */}
      <div className="glass-panel p-5 rounded-2xl border border-card-border space-y-6">
        <div>
          <h3 className="text-sm font-bold text-text mb-1">Study Workspace</h3>
          <p className="text-[10px] text-text-muted">Join or create private study rooms.</p>
        </div>

        <form onSubmit={handleCreateRoom} className="space-y-2.5">
          <input type="text" required value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="Group Name" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-1.5 rounded-xl text-xs font-bold transition-all">
            + Create Room
          </button>
        </form>

        <form onSubmit={handleJoinRoom} className="space-y-2 border-t border-card-border pt-4">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Join with code</label>
          <input type="text" required value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="SYNC-902" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          <button type="submit" className="w-full bg-secondary hover:bg-secondary-hover text-white py-1.5 rounded-xl text-xs font-bold transition-all">
            Join Room
          </button>
        </form>

        <div className="space-y-2 border-t border-card-border pt-4">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">My Active Rooms</label>
          {rooms.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRoom(r);
                loadRoomState(r.id);
              }}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold capitalize transition-all block truncate ${
                activeRoom?.id === r.id ? 'border-primary bg-primary/10 text-primary' : 'border-card-border hover:bg-background-alt'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace chat & files */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {activeRoom ? (
          <>
            {/* Live Chat Panel */}
            <div className="md:col-span-2 glass-panel rounded-2xl border border-card-border flex flex-col justify-between h-[450px]">
              <div className="p-4 border-b border-card-border flex justify-between items-center bg-slate-500/5">
                <div>
                  <h4 className="text-xs font-bold text-text">{activeRoom.name}</h4>
                  <p className="text-[10px] text-text-muted">Invite Code: <strong>{activeRoom.code}</strong></p>
                </div>
              </div>

              {/* Chat lines wrapper */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(m => {
                  const isMe = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'items-start'}`}>
                      <span className="text-[9px] text-text-muted mb-0.5">{isMe ? 'Me' : 'Classmate'}</span>
                      <div className={`p-3 rounded-2xl text-xs font-medium ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-background-alt border border-card-border text-text rounded-tl-none'}`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input toolbar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-card-border flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 bg-background-alt border border-card-border rounded-xl px-4 py-2 text-xs text-text focus:outline-none"
                />
                <button type="submit" className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all">
                  <Send size={14} />
                </button>
              </form>
            </div>

            {/* Document Files Hub Panel */}
            <div className="glass-panel p-4 rounded-2xl border border-card-border h-[450px] flex flex-col justify-between">
              <div>
                <div className="border-b border-card-border pb-2.5 mb-4 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text">Workspace Documents</h4>
                  <button onClick={handleSimulateFileUpload} className="p-1 rounded hover:bg-background-alt text-primary">
                    <Paperclip size={14} />
                  </button>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[330px]">
                  {files.map(f => (
                    <div key={f.id} className="p-2.5 bg-background-alt border border-card-border rounded-xl text-[11px]">
                      <div className="font-bold text-text truncate mb-1">{f.name}</div>
                      <div className="flex justify-between text-[9px] text-text-muted">
                        <span className="uppercase text-primary font-bold">{f.type}</span>
                        <span>v{f.version} &bull; {(f.size/1024/1024).toFixed(1)}MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-primary-light border border-primary/20 rounded-xl">
                <div className="text-[10px] font-bold text-primary mb-1">Collaboration Notice</div>
                <p className="text-[9px] text-text-muted leading-snug">All uploads are version controlled and logged to audits automatically.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="md:col-span-3 glass-panel rounded-2xl border border-card-border flex items-center justify-center p-20 text-center flex-col gap-3">
            <BookOpen size={42} className="text-text-muted" />
            <h4 className="text-sm font-bold text-text">Select Study Workspace Group</h4>
            <p className="text-xs text-text-muted max-w-xs leading-relaxed">Choose an active room on the sidebar or launch a new group code to coordinate with classmates.</p>
          </div>
        )}

      </div>

    </div>
  );
}

// ==========================================
// 4. LOST AND FOUND PAGE
// ==========================================
export function LostFound() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<any[]>([
    { id: 'lf1', title: 'Casio Scientific Calculator', description: 'Found Casio calculator FX-991EX near Physics Lab desk 4.', status: 'found', location: 'Physics Block Ground Floor', date: '2026-06-12' }
  ]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('found');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !location) return;
    const newItem = {
      id: `lf-${Math.random()}`,
      title,
      description: desc,
      status: type === 'found' ? 'found' : 'lost',
      location,
      date: new Date().toISOString().split('T')[0]
    };
    setItems([newItem, ...items]);
    setTitle('');
    setDesc('');
    setLocation('');
    alert('Report published in Campus logs.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Report Form */}
      <div className="glass-panel p-5 rounded-2xl border border-card-border h-fit">
        <h3 className="text-sm font-bold text-text mb-4">Report Missing / Found Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Report Category</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text">
              <option value="found">I Found an Item</option>
              <option value="lost">I Lost an Item</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Item Name</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Scientific Calculator" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Location Details</label>
            <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Physics Lab desk 4" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Description</label>
            <textarea required rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder=" Casio FX-991, black color with mechanical pencil case..." className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all">
            Publish Report
          </button>
        </form>
      </div>

      {/* Items Grid */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-text mb-4 font-display">Campus Lost & Found Bulletin</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(i => (
            <div key={i.id} className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    i.status === 'lost' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>{i.status}</span>
                  <span className="text-[10px] text-text-muted">{i.date}</span>
                </div>
                <h4 className="text-xs font-bold text-text mb-1">{i.title}</h4>
                <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{i.description}</p>
              </div>
              <div className="text-[10px] text-text-muted pt-3 mt-3 border-t border-card-border/50">
                Found near: <strong>{i.location}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 5. POLL SYSTEM
// ==========================================
export function Polls() {
  const { user } = useAuthStore();
  const [polls, setPolls] = useState<any[]>([
    { id: 'p1', question: 'Should we extend the computer lab hours to 10:00 PM during exams?', options: ['Yes, absolutely needed', 'No, 8:00 PM is sufficient', 'Neutral / Undecided'], votes: { 0: 42, 1: 12, 2: 5 } }
  ]);

  const handleVote = (pollId: string, idx: number) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const votes = { ...p.votes };
        votes[idx] = (votes[idx] || 0) + 1;
        return { ...p, votes };
      }
      return p;
    }));
    alert('Vote cast successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text">Active Campus Polls</h2>
        <p className="text-xs text-text-muted">Cast your vote to shape campus administration rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(p => {
          const totalVotes = Object.values(p.votes).reduce((a: any, b: any) => a + b, 0) as number;
          return (
            <div key={p.id} className="glass-panel p-6 rounded-2xl border border-card-border space-y-4">
              <h3 className="text-sm font-bold text-text leading-snug">{p.question}</h3>
              
              <div className="space-y-2.5">
                {p.options.map((opt: string, idx: number) => {
                  const val = p.votes[idx] || 0;
                  const pct = totalVotes > 0 ? (val / totalVotes) * 100 : 0;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVote(p.id, idx)}
                      className="w-full text-left p-3.5 bg-background-alt border border-card-border rounded-xl text-xs hover:border-primary/30 transition-all relative overflow-hidden group"
                    >
                      {/* Percent Fill display indicator bar */}
                      <div className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-500" style={{ width: `${pct}%` }} />
                      <div className="relative z-10 flex justify-between font-semibold">
                        <span className="text-text">{opt}</span>
                        <span className="text-text-muted">{pct.toFixed(0)}% ({val})</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-text-muted pt-2 border-t border-card-border/50 text-center">
                Total participation: <strong>{totalVotes}</strong> votes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 6. CAMPUS MARKETPLACE
// ==========================================
export function Marketplace() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<any[]>([
    { id: 'mp1', title: 'Casio Scientific Calculator FX-991EX', description: 'Almost new condition. Exchanged since I upgraded.', price: 15.00, category: 'calculators', status: 'available', image_url: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400' }
  ]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('books');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !desc) return;
    const newItem = {
      id: `mp-${Math.random()}`,
      title,
      price: parseFloat(price) || 0,
      description: desc,
      category: cat,
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
    };
    setItems([newItem, ...items]);
    setTitle('');
    setPrice('');
    setDesc('');
    alert('Listing published successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* List Item Form */}
      <div className="glass-panel p-5 rounded-2xl border border-card-border h-fit">
        <h3 className="text-sm font-bold text-text mb-4">Sell Academic Material</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Item Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Scientific Calculator" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Price ($)</label>
              <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="15.00" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text">
                <option value="books">Books</option>
                <option value="notes">Notes</option>
                <option value="calculators">Calculators</option>
                <option value="academic_gear">Gear</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Description</label>
            <textarea required rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder=" caspase details, usage details..." className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all">
            List Item
          </button>
        </form>
      </div>

      {/* Marketplace list */}
      <div className="lg:col-span-3 space-y-4">
        <h3 className="text-sm font-bold text-text mb-4 font-display">Active Campus Exchange Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map(i => (
            <div key={i.id} className="glass-panel rounded-2xl border border-card-border overflow-hidden flex flex-col justify-between hover:shadow-premium transition-all">
              <img src={i.image_url} alt={i.title} className="w-full h-32 object-cover" />
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded capitalize">{i.category}</span>
                    <span className="text-xs font-bold text-emerald-500">${i.price.toFixed(2)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-text mb-1 truncate">{i.title}</h4>
                  <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{i.description}</p>
                </div>
                
                <button className="w-full bg-background border border-card-border hover:bg-primary hover:text-white transition-colors text-[10px] font-bold py-1.5 rounded-lg mt-3">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 7. ACHIEVEMENTS SHOWCASE PAGE
// ==========================================
export function Achievements() {
  const { user } = useAuthStore();
  const [achieveList, setAchieveList] = useState<any[]>([
    { id: 'ac1', title: 'First Place - Smart Campus Hackathon 2026', desc: 'Developed a local socket real-time collaboration module. Honored by Dean.', likes: 18, comments: 2, badges: ['Developer', 'Innovator'] }
  ]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;
    const newAc = {
      id: `ac-${Math.random()}`,
      title,
      desc,
      likes: 0,
      comments: 0,
      badges: ['Championship', 'Student']
    };
    setAchieveList([newAc, ...achieveList]);
    setTitle('');
    setDesc('');
    alert('Achievement posted to showcase feed!');
  };

  const handleLike = (id: string) => {
    setAchieveList(achieveList.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Post form */}
      <div className="glass-panel p-5 rounded-2xl border border-card-border h-fit">
        <h3 className="text-sm font-bold text-text mb-4">Post Achievement Record</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Achievement Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Casio Hackathon winner" className="w-full bg-background-alt border border-card-border rounded-xl p-2 text-xs text-text focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Details & Context</label>
            <textarea required rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain the achievement details..." className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all">
            Publish Post
          </button>
        </form>
      </div>

      {/* Feed list */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-text mb-4 font-display">Student Honors & Achievements Feed</h3>
        {achieveList.map(a => (
          <div key={a.id} className="glass-panel p-5 rounded-2xl border border-card-border space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-text">{a.title}</h4>
                <p className="text-[9px] text-text-muted mt-0.5">Author: Alex Mercer &bull; Semester 6</p>
              </div>
              <div className="flex gap-1">
                {a.badges.map((b: string) => (
                  <span key={b} className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{b}</span>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-text-muted leading-relaxed">{a.desc}</p>
            
            <div className="flex items-center gap-4 pt-3 border-t border-card-border/50 text-[10px] text-text-muted">
              <button onClick={() => handleLike(a.id)} className="flex items-center gap-1 hover:text-rose-500 font-bold transition-colors">
                <Heart size={14} className="text-rose-500" /> Like ({a.likes})
              </button>
              <span className="flex items-center gap-1 font-bold">
                <MessageCircle size={14} className="text-primary" /> Comments ({a.comments})
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ==========================================
// 8. EVENT REGISTRATION (QR GENERATOR)
// ==========================================
export function EventRegistration() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<any[]>([
    { id: 'ev1', title: 'Grand Tech Expo 2026', description: 'Annual flagship symposium showcasing AI, Robotics, and VR projects.', category: 'symposium', venue: 'Campus Main Auditorium', date: '2026-06-25' }
  ]);
  const [registeredList, setRegisteredList] = useState<Record<string, string>>({});

  const handleRegister = (eventId: string) => {
    const qrCode = `QR-PASS-${eventId}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setRegisteredList({ ...registeredList, [eventId]: qrCode });
    alert('Event registration complete! Scan pass QR code generated.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text">Campus Events & Symposiums</h2>
        <p className="text-xs text-text-muted">Register for technical seminars, sports meets, and placement bootcamps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(ev => {
          const registeredQr = registeredList[ev.id];
          return (
            <div key={ev.id} className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{ev.category}</span>
                  <span className="text-[10px] text-text-muted font-semibold">{ev.date}</span>
                </div>
                <h3 className="text-sm font-bold text-text mb-2 leading-tight">{ev.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">{ev.description}</p>
                <div className="text-[10px] text-text-muted mb-4">Location: <strong>{ev.venue}</strong></div>
              </div>

              {registeredQr ? (
                <div className="p-4 bg-background-alt border border-card-border rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 bg-white p-1 rounded border border-card-border flex items-center justify-center">
                    <QrCode size={56} className="text-slate-900" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text">Registration Pass QR Code</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-0.5">Ready for scan at gate</div>
                    <div className="text-[9px] font-mono text-text-muted mt-1">{registeredQr}</div>
                  </div>
                </div>
              ) : (
                <button onClick={() => handleRegister(ev.id)} className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all">
                  Register for Event
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 9. NOTIFICATIONS LIST
// ==========================================
export function Notifications() {
  const [notes] = useState([
    { title: "Circular Alert: IA-2 Dates", message: "Model IA-2 exams published by Sarah Connor starting June 18.", type: "announcement", date: "Just now" },
    { title: "Complaint Assigned: WiFi Issue", message: "WiFi connectivity log in Alpha Block Room 302 assigned to maintenance.", type: "complaint_update", date: "2 hours ago" }
  ]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold font-display text-text">Campus Notifications</h2>
        <p className="text-xs text-text-muted">Manage system notifications and active alerts.</p>
      </div>

      <div className="space-y-4">
        {notes.map((n, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-card-border flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-text">{n.title}</h4>
                <span className="text-[9px] text-text-muted">{n.date}</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 10. MY CAMPUS PROFILE
// ==========================================
export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const profile = user?.profile || {};
  const role = user?.role || 'student';
  
  const [name, setName] = useState(profile.full_name || profile.staff_name || profile.admin_name || '');
  const [phone, setPhone] = useState(profile.phone || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ 
      full_name: role === 'student' ? name : undefined, 
      staff_name: role === 'staff' ? name : undefined, 
      admin_name: role === 'admin' ? name : undefined, 
      phone 
    });
    alert('Profile information updated successfully.');
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'staff': return 'bg-secondary/10 text-secondary border border-secondary/20';
      default: return 'bg-primary/10 text-primary border border-primary/20';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* 1. Header Banner & Profile Card */}
      <div className="glass-panel p-6 rounded-3xl border border-card-border relative overflow-hidden bg-gradient-to-r from-primary-light via-transparent to-transparent flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-3xl font-extrabold shadow-md border-2 border-white/10 shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        
        <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-text truncate">
              {name}
            </h2>
            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
              {role}
            </span>
          </div>
          
          <p className="text-xs text-text-muted">
            {role === 'student' ? profile.department : profile.department || 'Campus Operations & Security'}
          </p>
          
          <p className="text-[10px] text-text-muted flex items-center justify-center sm:justify-start gap-1">
            <Mail size={10} /> {profile.email || 'no-email@university.edu'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* 2. Editable preferences form (2/5 cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-card-border h-fit space-y-4">
          <h3 className="text-sm font-bold text-text flex items-center gap-1.5 pb-2 border-b border-card-border">
            <User size={16} className="text-primary" /> Personal Preferences
          </h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Display Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-all" 
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Contact Phone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+1 555 0199"
                className="w-full bg-background-alt border border-card-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-all" 
              />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-premium">
              Save Profile Settings
            </button>
          </form>
        </div>

        {/* 3. Verified Campus Records (3/5 cols) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border border-card-border space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-card-border">
            <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
              <Lock size={15} className="text-text-muted" /> Official Verified Records
            </h3>
            <span className="text-[9px] bg-slate-500/10 text-text-muted font-bold px-2 py-0.5 rounded flex items-center gap-1">
              Read-Only
            </span>
          </div>

          <div className="p-3 bg-slate-500/5 border border-card-border rounded-xl flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-text-muted shrink-0 mt-0.5" />
            <p className="text-[10px] text-text-muted leading-relaxed">
              These details are synchronised from the official campus registration directory database. To make corrections, please contact the Registrar's Office.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            {/* Username */}
            <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Campus Username</span>
              <span className="text-xs font-semibold text-text truncate mt-1">{profile.username || 'N/A'}</span>
              <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
            </div>

            {/* Email */}
            <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">University Email</span>
              <span className="text-xs font-semibold text-text truncate mt-1">{profile.email || 'N/A'}</span>
              <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
            </div>

            {/* Roll/Staff ID */}
            {role !== 'admin' && (
              <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  {role === 'student' ? 'Roll Number' : 'Staff ID'}
                </span>
                <span className="text-xs font-semibold text-text truncate mt-1">
                  {role === 'student' ? profile.roll_number : profile.staff_id}
                </span>
                <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
              </div>
            )}

            {/* Register Number (Students only) */}
            {role === 'student' && (
              <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Registration Number</span>
                <span className="text-xs font-semibold text-text truncate mt-1">{profile.register_number || 'N/A'}</span>
                <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
              </div>
            )}

            {/* Academic details (Students only) */}
            {role === 'student' && (
              <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Academic Track</span>
                <span className="text-xs font-semibold text-text truncate mt-1">
                  Year {profile.year} &bull; Sem {profile.semester} (Sec {profile.section})
                </span>
                <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
              </div>
            )}

            {/* Designation (Staff only) */}
            {role === 'staff' && (
              <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Academic Designation</span>
                <span className="text-xs font-semibold text-text truncate mt-1">{profile.designation || 'Lecturer'}</span>
                <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
              </div>
            )}

            {/* Student Type / Room number */}
            {role === 'student' && (
              <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px]">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Enrollment Type</span>
                <span className="text-xs font-semibold text-text truncate mt-1 capitalize">
                  {profile.student_type} {profile.room_number ? `(Room ${profile.room_number})` : ''}
                </span>
                <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
              </div>
            )}

            {/* Department */}
            <div className="p-3 bg-background-alt border border-card-border/60 rounded-xl relative overflow-hidden flex flex-col justify-between h-[68px] sm:col-span-2">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">College Department</span>
              <span className="text-xs font-semibold text-text truncate mt-1">
                {role === 'admin' ? 'Operations Administration' : profile.department || 'Engineering Division'}
              </span>
              <Lock size={10} className="absolute top-3 right-3 text-text-muted opacity-40" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
