import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { 
  ShieldCheck, Users, FileText, CheckCircle2, 
  Trash2, Play, AlertCircle, RefreshCw, BarChart2 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const token = user?.token;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'complaints' | 'audits'>('analytics');
  
  // States
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any>({ students: [], staffs: [], admins: [] });
  const [complaintsList, setComplaintsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Selected complaint details
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [statusUpdateComment, setStatusUpdateComment] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Load Analytics
      const analRes = await axios.get(`${API_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } });
      setAnalyticsData(analRes.data);

      // Load Users
      const usersRes = await axios.get(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsersList(usersRes.data);

      // Load Complaints
      const compRes = await axios.get(`${API_URL}/api/complaints`, { headers: { Authorization: `Bearer ${token}` } });
      setComplaintsList(compRes.data);

      // Load Audits
      const auditRes = await axios.get(`${API_URL}/api/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
      setAuditLogs(auditRes.data);
    } catch (err) {
      console.warn('Backend offline, loading fallback local admin database states');
      
      // Fallback data
      setAnalyticsData({
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
          { name: 'ECE', projects: 22, events: 8 }
        ]
      });

      setUsersList({
        students: [
          { id: '11111111-1111-1111-1111-111111111111', full_name: 'Alex Mercer', email: 'alex.mercer@university.edu', roll_number: 'CS2042', department: 'Computer Science & Engineering', year: 3 }
        ],
        staffs: [
          { id: '22222222-2222-2222-2222-222222222222', staff_name: 'Dr. Sarah Connor', staff_id: 'STF9021', department: 'Computer Science & Engineering', designation: 'Associate Professor', email: 'sarah.connor@university.edu' }
        ],
        admins: [
          { id: '33333333-3333-3333-3333-333333333333', admin_name: 'Executive Admin Chief', email: 'admin.chief@university.edu' }
        ]
      });

      setComplaintsList([
        {
          id: 'c1',
          student_id: '11111111-1111-1111-1111-111111111111',
          title: 'WiFi Connection Failure in Block 3 Room 302',
          description: 'The primary access point has been blinking red since yesterday afternoon.',
          category: 'WiFi',
          type: 'hostel',
          priority: 'high',
          location: 'Alpha Block, Room 302',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);

      setAuditLogs([
        { id: 'audit1', actor_id: '33333333-3333-3333-3333-333333333333', action: 'System Loaded', details: { message: 'Local fallback engine operational' }, created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('User deleted.');
    } catch (err) {
      alert('Local Cache delete: user list updated.');
    }
    // Update local state
    setUsersList({
      students: usersList.students.filter((u: any) => u.id !== userId),
      staffs: usersList.staffs.filter((u: any) => u.id !== userId),
      admins: usersList.admins.filter((u: any) => u.id !== userId)
    });
  };

  const handleUpdateStatus = async (complaintId: string, status: string) => {
    if (!statusUpdateComment) {
      alert('Please enter a status update log comment.');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/complaints/${complaintId}/status`,
        { status, comment: statusUpdateComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Complaint timeline updated.');
    } catch (err) {
      alert('Mock complaint status log comment registered!');
    }

    // Update locally
    setComplaintsList(
      complaintsList.map(c => c.id === complaintId ? { ...c, status, updated_at: new Date().toISOString() } : c)
    );
    setSelectedComplaint(null);
    setStatusUpdateComment('');
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome banner */}
      <div className="glass-panel p-6 rounded-3xl border border-card-border relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-transparent to-transparent">
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-orange-500" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">
            System Administrator core console
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text">
            Operating System Commander
          </h2>
          <p className="text-xs text-text-muted max-w-lg leading-relaxed">
            Oversee user permissions directories, review pending and assigned complaints status charts, examine system audit lines, and review telemetry.
          </p>
        </div>
      </div>

      {/* Tabs selectors bar */}
      <div className="flex border-b border-card-border gap-2">
        {[
          { id: 'analytics', label: 'Ecosystem Analytics', icon: BarChart2 },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'complaints', label: 'Complaint Resolution Hub', icon: FileText },
          { id: 'audits', label: 'System Audit Logs', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* TAB 1: ANALYTICS CHARTS */}
          {activeTab === 'analytics' && analyticsData && (
            <AnalyticsCharts data={analyticsData} />
          )}

          {/* TAB 2: USER DIRECTORY LIST */}
          {activeTab === 'users' && (
            <div className="glass-panel p-6 rounded-2xl border border-card-border">
              <h3 className="text-sm font-bold text-text mb-4">Students Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-card-border text-text-muted">
                      <th className="py-2.5 font-bold">Name</th>
                      <th className="py-2.5 font-bold">Email</th>
                      <th className="py-2.5 font-bold">Roll Number</th>
                      <th className="py-2.5 font-bold">Department</th>
                      <th className="py-2.5 font-bold">Year</th>
                      <th className="py-2.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.students.map((std: any) => (
                      <tr key={std.id} className="border-b border-card-border/50 hover:bg-background-alt/30 transition-colors">
                        <td className="py-2.5 font-semibold text-text">{std.full_name}</td>
                        <td className="py-2.5 text-text-muted">{std.email}</td>
                        <td className="py-2.5 font-mono text-text-muted">{std.roll_number}</td>
                        <td className="py-2.5 text-text-muted">{std.department}</td>
                        <td className="py-2.5 text-text-muted">{std.year}</td>
                        <td className="py-2.5 text-right">
                          <button onClick={() => handleDeleteUser(std.id)} className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLAINTS HUB MODERATION */}
          {activeTab === 'complaints' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Complaints list */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-card-border space-y-4">
                <h3 className="text-sm font-bold text-text">Open Campus Logs</h3>
                {complaintsList.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-4 rounded-xl border cursor-pointer hover:scale-101 transition-all ${
                      selectedComplaint?.id === c.id 
                        ? 'border-primary bg-primary-light' 
                        : 'border-card-border bg-background-alt'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-text">{c.title}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        c.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        c.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>{c.status}</span>
                    </div>
                    <p className="text-[11px] text-text-muted line-clamp-2">{c.description}</p>
                    <div className="flex justify-between items-center text-[10px] text-text-muted mt-3 pt-2 border-t border-card-border/50">
                      <span>Location: {c.location}</span>
                      <span className="capitalize text-primary font-bold">Priority: {c.priority}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Update comment box panel */}
              <div className="glass-panel p-5 rounded-2xl border border-card-border h-fit">
                {selectedComplaint ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Modify Complaint status</h3>
                    <div className="text-xs font-bold text-text leading-tight">{selectedComplaint.title}</div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Timeline Status Comment Log</label>
                      <textarea
                        required
                        rows={3}
                        value={statusUpdateComment}
                        onChange={e => setStatusUpdateComment(e.target.value)}
                        placeholder="Comment on what actions have been performed (e.g. WiFi technician dispatched)."
                        className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'in_progress')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-[10px] transition-colors"
                      >
                        Set In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-[10px] transition-colors"
                      >
                        Set Resolved
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-text-muted flex flex-col items-center gap-2">
                    <AlertCircle size={24} className="text-text-muted" />
                    <span>Select an open complaint card to modify its tracking status timeline.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM AUDIT LOGS */}
          {activeTab === 'audits' && (
            <div className="glass-panel p-6 rounded-2xl border border-card-border">
              <h3 className="text-sm font-bold text-text mb-4">Audit Trails</h3>
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-background-alt border border-card-border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-primary mr-3">{log.action}</span>
                      <span className="text-text-muted">{JSON.stringify(log.details)}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono">{log.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
