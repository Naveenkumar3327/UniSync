import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/authStore';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, School } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, loading, error, clearError } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Personal & academic fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  
  const [rollNumber, setRollNumber] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1');
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');

  // Student classification details
  const [studentType, setStudentType] = useState<'hosteller' | 'day_scholar'>('day_scholar');
  const [hostelBlock, setHostelBlock] = useState('Alpha Block');
  const [roomNumber, setRoomNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('1');
  const [bedNumber, setBedNumber] = useState('');
  
  const [busNumber, setBusNumber] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('');
  const [transportType, setTransportType] = useState('College Bus');
  const [parkingDetails, setParkingDetails] = useState('');

  // Staff details
  const [staffName, setStaffName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');

  useEffect(() => {
    // Check search params to toggle registration directly
    if (searchParams.get('register') === 'true') {
      setIsRegister(true);
    }
    clearError();
  }, [searchParams, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isRegister) {
      let data: any = { username, email, password, phone };
      if (selectedRole === 'student') {
        data = {
          ...data,
          full_name: fullName,
          gender,
          dob,
          roll_number: rollNumber,
          register_number: registerNumber,
          department,
          year,
          semester,
          section,
          student_type: studentType,
          ...(studentType === 'hosteller' 
            ? { hostel_block: hostelBlock, room_number: roomNumber, floor_number: floorNumber, bed_number: bedNumber }
            : { bus_number: busNumber, boarding_point: boardingPoint, transport_type: transportType, parking_details: parkingDetails }
          )
        };
      } else {
        data = {
          ...data,
          staff_name: staffName,
          staff_id: staffId,
          department,
          designation
        };
      }

      const success = await register(selectedRole, data);
      if (success) {
        navigate(`/dashboard/${selectedRole}`);
      }
    } else {
      const success = await login(email, selectedRole);
      if (success) {
        navigate(`/dashboard/${selectedRole}`);
      }
    }
  };

  const fillQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('student@university.edu');
    } else if (role === 'staff') {
      setEmail('staff@university.edu');
    } else {
      setEmail('admin@university.edu');
    }
    setPassword('demo-credentials');
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-6 select-none">
      {/* Background decoration dots */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[radial-gradient(var(--primary)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />

      <div className="w-full max-w-2xl z-10">
        
        {/* Header branding */}
        <div className="flex items-center gap-3 justify-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl animate-float">
            U
          </div>
          <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            UniSync
          </span>
        </div>

        {/* Auth form card */}
        <div className="glass-panel p-8 rounded-3xl shadow-premium border border-card-border">
          
          {/* Header toggles */}
          <div className="flex justify-between items-center mb-8 border-b border-card-border pb-4">
            <div>
              <h2 className="text-xl font-bold font-display text-text">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-text-muted">
                {isRegister ? 'Register and configure your details.' : 'Access your university workspace.'}
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                clearError();
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              {isRegister ? 'Already have an account? Login' : 'Register Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Quick Demo Credentials Switcher */}
          {!isRegister && (
            <div className="mb-8 p-4 rounded-2xl bg-primary-light dark:bg-slate-800/80 border border-primary/20">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-3">
                <Sparkles size={14} />
                <span>Quick Demo Accounts Access:</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student')}
                  className="bg-background hover:bg-background-alt border border-card-border p-2 rounded-xl text-center text-[10px] font-bold text-text transition-colors flex items-center justify-center gap-1"
                >
                  <School size={12} className="text-blue-500" /> Student Profile
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('staff')}
                  className="bg-background hover:bg-background-alt border border-card-border p-2 rounded-xl text-center text-[10px] font-bold text-text transition-colors flex items-center justify-center gap-1"
                >
                  <UserCheck size={12} className="text-purple-500" /> Faculty Profile
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="bg-background hover:bg-background-alt border border-card-border p-2 rounded-xl text-center text-[10px] font-bold text-text transition-colors flex items-center justify-center gap-1"
                >
                  <ShieldCheck size={12} className="text-orange-500" /> Admin Core
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Tab Selector */}
            <div>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2.5">
                Select Account Role Identity
              </label>
              <div className="grid grid-cols-3 gap-2 bg-background-alt p-1 rounded-xl border border-card-border">
                {(isRegister ? ['student', 'staff'] : ['student', 'staff', 'admin']).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r as UserRole)}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                      selectedRole === r
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email & Password (Common Fields) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                  Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
            </div>

            {/* Registration-Only Dynamic Fields */}
            {isRegister && (
              <div className="space-y-6 border-t border-card-border pt-6">
                
                {selectedRole === 'student' && (
                  <>
                    <h3 className="text-sm font-bold font-display text-text mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
                        <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Alex Mercer" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Username</label>
                        <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="alex_cs" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Phone</label>
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555-0199" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Date of Birth</label>
                        <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold font-display text-text pt-4 border-t border-card-border mb-4">Academic Credentials</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Roll Number</label>
                        <input type="text" required value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="CS2042" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Register Number</label>
                        <input type="text" required value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} placeholder="REG9920112" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Department</label>
                        <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text">
                          <option>Computer Science & Engineering</option>
                          <option>Information Technology</option>
                          <option>Electronics & Communication</option>
                          <option>Mechanical Engineering</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Year</label>
                        <input type="number" min="1" max="4" value={year} onChange={e => setYear(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Semester</label>
                        <input type="number" min="1" max="8" value={semester} onChange={e => setSemester(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Section</label>
                        <input type="text" value={section} onChange={e => setSection(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Student Type</label>
                        <select value={studentType} onChange={e => setStudentType(e.target.value as any)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text">
                          <option value="day_scholar">Day Scholar</option>
                          <option value="hosteller">Hosteller</option>
                        </select>
                      </div>
                    </div>

                    {/* Hosteller Fields */}
                    {studentType === 'hosteller' ? (
                      <div className="p-4 rounded-2xl bg-background-alt border border-card-border grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Hostel Block</label>
                          <input type="text" value={hostelBlock} onChange={e => setHostelBlock(e.target.value)} className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Room No</label>
                          <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="302" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Floor Level</label>
                          <input type="number" value={floorNumber} onChange={e => setFloorNumber(e.target.value)} className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Bed Identifier</label>
                          <input type="text" value={bedNumber} onChange={e => setBedNumber(e.target.value)} placeholder="Bed-A" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                      </div>
                    ) : (
                      /* Day Scholar Fields */
                      <div className="p-4 rounded-2xl bg-background-alt border border-card-border grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Bus Number</label>
                          <input type="text" value={busNumber} onChange={e => setBusNumber(e.target.value)} placeholder="Bus-45" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Boarding Point</label>
                          <input type="text" value={boardingPoint} onChange={e => setBoardingPoint(e.target.value)} placeholder="Central Square" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Transport Mode</label>
                          <input type="text" value={transportType} onChange={e => setTransportType(e.target.value)} placeholder="College Bus" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block mb-1">Parking Lot</label>
                          <input type="text" value={parkingDetails} onChange={e => setParkingDetails(e.target.value)} placeholder="Zone-B No. 12" className="w-full bg-background border border-card-border rounded-lg p-2 text-xs text-text focus:outline-none" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedRole === 'staff' && (
                  <>
                    <h3 className="text-sm font-bold font-display text-text mb-4">Faculty Position Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Staff Name</label>
                        <input type="text" required value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Dr. Sarah Connor" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Staff ID Code</label>
                        <input type="text" required value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="STF9021" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Designation</label>
                        <input type="text" required value={designation} onChange={e => setDesignation(e.target.value)} placeholder="Associate Professor" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Department Filter</label>
                        <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text">
                          <option>Computer Science & Engineering</option>
                          <option>Information Technology</option>
                          <option>Electronics & Communication</option>
                          <option>Mechanical Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Username</label>
                        <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="sarah_prof" className="w-full bg-background-alt border border-card-border rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-text" />
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Remember Me and submit buttons */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-card-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-[11px] text-text-muted font-semibold">Keep me signed in</span>
              </label>

              <button
                type="button"
                className="text-[11px] text-text-muted hover:underline font-semibold"
              >
                Forgot credentials?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all shadow-premium hover:scale-102 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Complete Registration' : 'Authenticate Session'}{' '}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
