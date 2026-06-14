import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Briefcase, Code, GraduationCap, Award, Search, FileText, CheckCircle2,
  AlertTriangle, TrendingUp, UploadCloud, Sparkles, RefreshCw, Target,
  ExternalLink, Calendar, MapPin, Check, BookOpen, Newspaper
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OpportunityHub() {
  const { user } = useAuthStore();
  const profile = user?.profile || {};

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [readinessScore, setReadinessScore] = useState<any | null>(null);
  
  // News state
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  
  // Loading states
  const [loadingOps, setLoadingOps] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Resume Analyzer state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  // Profile fields used for engine input
  const studentDept = profile.department || 'Computer Science & Engineering';
  const studentYear = profile.year || 3;
  const studentSkills = 'React, Node.js, Python, PostgreSQL, JavaScript, SQL';

  // Fetch opportunities, recommendations, and readiness scores on load
  const fetchAllData = async () => {
    setLoadingOps(true);
    setLoadingRecs(true);
    setLoadingScore(true);
    setLoadingNews(true);
    
    // Opportunities
    try {
      const resOps = await axios.get(`${API_URL}/api/syncai/opportunities`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setOpportunities(resOps.data);
    } catch (err) {
      console.warn('Backend offline, loading mock opportunities locally.');
      // Local fallback
      setOpportunities([
        { id: '1', title: 'AI / ML Research Intern', company: 'Google', source: 'Company Career Pages', category: 'internship', department: 'Computer Science & Engineering', location: 'Bangalore, India', eligibility: 'Pre-final / Final year B.Tech/M.Tech CS students', skills: ['Python', 'PyTorch', 'Machine Learning', 'TensorFlow'], description: 'Work on Generative AI systems, LLM fine-tuning, and research models.', apply_link: 'https://careers.google.com', deadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(), created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200' },
        { id: '2', title: 'Full Stack Developer Job', company: 'Microsoft', source: 'LinkedIn Jobs', category: 'job', department: 'Computer Science & Engineering', location: 'Remote', eligibility: 'Graduating B.Tech CS students, CGPA > 8.0', skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], description: 'Design, write, and deploy cloud microservices in typescript ecosystem.', apply_link: 'https://careers.microsoft.com', deadline: new Date(Date.now() + 15*24*60*60*1000).toISOString(), created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1625014618427-fbc980b974f5?auto=format&fit=crop&q=80&w=200' },
        { id: '3', title: 'Smart India Hackathon 2026', company: 'Govt of India', source: 'Unstop', category: 'hackathon', department: 'Computer Science & Engineering', location: 'New Delhi, India', eligibility: 'Open to engineering students', skills: ['React', 'Flask', 'AI', 'IoT'], description: 'National level hackathon solving critical challenges. $5000 prize.', apply_link: 'https://unstop.com', deadline: new Date(Date.now() + 5*24*60*60*1000).toISOString(), created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200' },
        { id: '4', title: 'CAD Design Intern', company: 'Tesla', source: 'Company Career Pages', category: 'internship', department: 'Mechanical Engineering', location: 'Bangalore, India', eligibility: 'Mechanical engineering 3rd/4th year', skills: ['CAD', 'SolidWorks', 'CATIA', 'Ansys'], description: 'Battery pack packaging modeling, design drafting, and structural stress testing.', apply_link: 'https://careers.tesla.com', deadline: new Date(Date.now() + 20*24*60*60*1000).toISOString(), created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200' },
        { id: '5', title: 'Embedded Systems Engineer', company: 'Intel', source: 'Wellfound', category: 'job', department: 'Electronics & Communication Engineering', location: 'Bangalore, India', eligibility: 'ECE grads with projects', skills: ['Embedded C', 'RTOS', 'Microcontrollers', 'IoT'], description: 'Chipset BIOS firmware architectures, assembly optimizations, and driver engineering.', apply_link: 'https://careers.intel.com', deadline: new Date(Date.now() + 12*24*60*60*1000).toISOString(), created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200' }
      ]);
    } finally {
      setLoadingOps(false);
    }

    // Recommendations
    try {
      const resRecs = await axios.get(`${API_URL}/api/syncai/recommendations`, {
        params: { department: studentDept, skills: studentSkills },
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setRecommendations(resRecs.data);
    } catch (err) {
      setRecommendations([
        { id: '1', title: 'AI / ML Research Intern', company: 'Google', category: 'internship', department: 'Computer Science & Engineering', location: 'Bangalore, India', skills: ['Python', 'PyTorch', 'Machine Learning'], recommendationScore: 92, apply_link: 'https://careers.google.com', deadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200' },
        { id: '2', title: 'Full Stack Developer Job', company: 'Microsoft', category: 'job', department: 'Computer Science & Engineering', location: 'Remote', skills: ['React', 'TypeScript', 'Node.js'], recommendationScore: 88, apply_link: 'https://careers.microsoft.com', deadline: new Date(Date.now() + 15*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1625014618427-fbc980b974f5?auto=format&fit=crop&q=80&w=200' },
        { id: '3', title: 'Smart India Hackathon 2026', company: 'Govt of India', category: 'hackathon', department: 'Computer Science & Engineering', location: 'New Delhi, India', skills: ['React', 'Flask', 'AI'], recommendationScore: 85, apply_link: 'https://unstop.com', deadline: new Date(Date.now() + 5*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200' },
        { id: '4', title: 'CAD Design Intern', company: 'Tesla', category: 'internship', department: 'Mechanical Engineering', location: 'Bangalore, India', skills: ['CAD', 'SolidWorks', 'CATIA'], recommendationScore: 78, apply_link: 'https://careers.tesla.com', deadline: new Date(Date.now() + 20*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200' },
        { id: '5', title: 'Embedded Systems Engineer', company: 'Intel', category: 'job', department: 'Electronics & Communication Engineering', location: 'Bangalore, India', skills: ['Embedded C', 'RTOS', 'Microcontrollers'], recommendationScore: 72, apply_link: 'https://careers.intel.com', deadline: new Date(Date.now() + 12*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200' },
        { id: '6', title: 'VLSI Chip Architect Job', company: 'Qualcomm', category: 'job', department: 'Electronics & Communication Engineering', location: 'Hyderabad, India', skills: ['VLSI', 'Verilog', 'SystemVerilog'], recommendationScore: 68, apply_link: 'https://careers.qualcomm.com', deadline: new Date(Date.now() + 25*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=200' },
        { id: '7', title: 'Venture Capital STEM Scholarship', company: 'Sequoia Capital', category: 'scholarship', department: 'Computer Science & Engineering', location: 'Global / Remote', skills: ['Entrepreneurship', 'Product Development'], recommendationScore: 64, apply_link: 'https://sequoiacap.com', deadline: new Date(Date.now() + 45*24*60*60*1000).toISOString(), image_url: 'https://images.unsplash.com/photo-1579532561814-c1bc1de747c1?auto=format&fit=crop&q=80&w=200' }
      ]);
    } finally {
      setLoadingRecs(false);
    }

    // Job Market News Feed
    try {
      const resNews = await axios.get(`${API_URL}/api/syncai/news`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNews(resNews.data);
    } catch (err) {
      console.warn('Backend news offline, loading mock news locally.');
      setNews([
        {
          id: 'news-1',
          title: 'Generative AI Developer Demand Surges by 150% in Indian Tech Hubs',
          source: 'TechCrunch',
          date: 'June 13, 2026',
          summary: 'A new job market report reveals a massive spike in gen-AI developer positions across Bengaluru, Hyderabad, and Pune. Companies are looking for engineering grads with proficiency in PyTorch, LangChain, and LLM fine-tuning.',
          image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=300',
          read_link: 'https://techcrunch.com'
        },
        {
          id: 'news-2',
          title: 'Top Tech Giants Unveil Fresh Campus Placement Guidelines',
          source: 'Economic Times',
          date: 'June 11, 2026',
          summary: 'Major MNCs have aligned their campus recruitment framework for 2026 graduates. Emphasis is shifting towards core engineering problem-solving, collaborative Git logs, and hands-on hackathon submissions rather than pure CGPA.',
          image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=300',
          read_link: 'https://economictimes.indiatimes.com'
        },
        {
          id: 'news-3',
          title: 'Green Energy & EV Sectors Emerge as Leading Job Creators',
          source: 'LinkedIn News',
          date: 'June 09, 2026',
          summary: 'Mechanical and Electronics engineering graduates are witnessing a double-digit hiring increase in the EV sector. Demand is high for battery packaging, CAD design drafts, and IoT dashboard telemetry sensor engineers.',
          image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=300',
          read_link: 'https://linkedin.com'
        },
        {
          id: 'news-4',
          title: 'Software Engineering Job Market Normalizes Around Hybrid Workspaces',
          source: 'Bloomberg Technology',
          date: 'June 05, 2026',
          summary: 'Industry survey indicates that 72% of mid-to-senior software developers have settled into hybrid work schedules. Startups are offering premium packages for skilled remote TypeScript developers.',
          image_url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=300',
          read_link: 'https://bloomberg.com'
        }
      ]);
    } finally {
      setLoadingNews(false);
    }

    // Readiness Score
    try {
      const resScore = await axios.get(`${API_URL}/api/syncai/readiness-score`, {
        params: { department: studentDept, skills: studentSkills, achievementsCount: 2, collaborationsCount: 1 },
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setReadinessScore(resScore.data);
    } catch (err) {
      setReadinessScore({
        overallScore: 78,
        breakdown: { technicalScore: 20, projectScore: 17, certificationScore: 24, activityScore: 17 },
        recommendations: [
          'Add more specialized technical skills (e.g., TypeScript or PyTorch) to your profile.',
          'Join a new hackathon team or project team in the Collaboration Hub.'
        ]
      });
    } finally {
      setLoadingScore(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Aggregator Sync trigger
  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_URL}/api/syncai/trigger-sync`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert('Opportunities synchronized successfully from Unstop, LinkedIn, Internshala, and other channels!');
      fetchAllData();
    } catch {
      alert('Aggregation synchronization triggered (Local Mode).');
      fetchAllData();
    } finally {
      setSyncing(false);
    }
  };

  // Resume File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setResumeError(null);
    }
  };

  // Resume Analyze submission
  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      setResumeError('Please select a PDF file first.');
      return;
    }
    setAnalyzingResume(true);
    setResumeError(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await axios.post(`${API_URL}/api/syncai/resume-analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      setAnalysisResult(res.data);
    } catch (err: any) {
      console.warn('Backend analyzer offline, calculating local simulation analysis.');
      // Local simulated response based on file metadata or random high quality profile
      setTimeout(() => {
        setAnalysisResult({
          filename: resumeFile.name,
          targetDepartment: studentDept,
          extractedSkills: ['React', 'JavaScript', 'Node.js', 'Python', 'HTML', 'SQL'],
          missingSkills: ['TypeScript', 'PyTorch', 'Docker'],
          atsScore: 72,
          resumeScore: 75,
          suggestions: [
            'Integrate missing keywords: TypeScript, PyTorch, Docker directly into your resume summaries.',
            'Add quantitative impacts (e.g. "Improved query performance by 40%") to project bullet points.',
            'Include certifications or achievements certificates directly on the main page of your resume.'
          ]
        });
        setAnalyzingResume(false);
      }, 2000);
      return;
    }
    setAnalyzingResume(false);
  };

  // Filter list
  const filteredOpportunities = opportunities.filter(op => {
    const matchesCategory = selectedCategory === 'all' ? true : op.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-card-border relative overflow-hidden bg-gradient-to-r from-primary-light via-transparent to-transparent flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
            Placement Assistant
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text mt-2">
            Opportunity Hub
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-xl">
            Explore live hackathons, internship postings, scholarship programs, and campus placement drives. Auto-filtered for your department and matched by AI.
          </p>
        </div>
        
        <button
          onClick={handleTriggerSync}
          disabled={syncing}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-premium w-fit shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing Opportunities...' : 'Sync Opportunities'}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ASSISTANT PANELS (Readiness Score & Resume Analyzer) */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* 1. PLACEMENT READINESS SCORE */}
          <div className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col justify-between">
            <div className="border-b border-card-border pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <Target size={16} className="text-primary" /> Placement Readiness
              </h3>
              <span className="text-[10px] bg-secondary-light text-secondary font-bold px-2 py-0.5 rounded">Active</span>
            </div>

            {loadingScore ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
                <span className="text-[10px] text-text-muted">Computing readiness index...</span>
              </div>
            ) : readinessScore ? (
              <div className="space-y-4">
                
                {/* Visual Radial Gauge Score */}
                <div className="flex items-center gap-4 bg-background-alt p-3.5 rounded-xl border border-card-border">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-card-border fill-none" strokeWidth="5" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        className="stroke-primary fill-none transition-all duration-1000"
                        strokeWidth="5"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * readinessScore.overallScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-display font-extrabold text-sm text-text">
                      {readinessScore.overallScore}%
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-text">Overall Placement Index</h4>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                      Based on skills, hackathon projects, certifications, and campus activity logs.
                    </p>
                  </div>
                </div>

                {/* Score Breakdown List */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Technical Skills Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-card-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(readinessScore.breakdown.technicalScore/25)*100}%` }} />
                      </div>
                      <span className="font-bold text-text">{readinessScore.breakdown.technicalScore}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Project Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-card-border rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${(readinessScore.breakdown.projectScore/25)*100}%` }} />
                      </div>
                      <span className="font-bold text-text">{readinessScore.breakdown.projectScore}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Certification Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-card-border rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(readinessScore.breakdown.certificationScore/25)*100}%` }} />
                      </div>
                      <span className="font-bold text-text">{readinessScore.breakdown.certificationScore}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Campus Activity Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-card-border rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${(readinessScore.breakdown.activityScore/25)*100}%` }} />
                      </div>
                      <span className="font-bold text-text">{readinessScore.breakdown.activityScore}/25</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border-t border-card-border pt-3 mt-3">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">SyncAI Suggestions</h4>
                  <ul className="space-y-1.5">
                    {readinessScore.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-[10px] text-text-muted leading-relaxed">
                        <Sparkles size={12} className="text-primary shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-xs text-text-muted">Failed to compute scores.</div>
            )}
          </div>

          {/* 2. RESUME ANALYZER (ATS SYSTEM) */}
          <div className="glass-panel p-5 rounded-2xl border border-card-border">
            <div className="border-b border-card-border pb-3 mb-4">
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Resume Analyzer (ATS)
              </h3>
            </div>

            <div className="space-y-4">
              {/* Drag Drop select box */}
              <div className="border border-dashed border-card-border rounded-xl p-4 bg-background-alt hover:bg-primary-light/30 transition-all text-center flex flex-col items-center justify-center cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud size={28} className="text-text-muted mb-2" />
                <span className="text-xs font-bold text-text">
                  {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
                </span>
                <span className="text-[9px] text-text-muted mt-1">
                  Supports .pdf formats up to 5MB
                </span>
              </div>

              {resumeError && (
                <div className="text-[10px] text-rose-500 font-bold bg-rose-500/10 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  <span>{resumeError}</span>
                </div>
              )}

              <button
                onClick={handleAnalyzeResume}
                disabled={!resumeFile || analyzingResume}
                className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {analyzingResume ? 'Extracting Resume Data...' : 'Analyze ATS Score'}
              </button>

              {/* Analyzer Outcome Results */}
              {analyzingResume && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full mb-1" />
                  <span className="text-[10px] text-text-muted">Performing keyword matching & scoring...</span>
                </div>
              )}

              {analysisResult && !analyzingResume && (
                <div className="border-t border-card-border pt-4 space-y-3">
                  
                  {/* Scores gauge row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background-alt border border-card-border p-2.5 rounded-xl text-center">
                      <div className="text-xs text-text-muted">ATS Score</div>
                      <div className={`text-lg font-extrabold font-display mt-0.5 ${
                        analysisResult.atsScore >= 75 ? 'text-emerald-500' :
                        analysisResult.atsScore >= 60 ? 'text-yellow-500' : 'text-rose-500'
                      }`}>
                        {analysisResult.atsScore}/100
                      </div>
                    </div>
                    <div className="bg-background-alt border border-card-border p-2.5 rounded-xl text-center">
                      <div className="text-xs text-text-muted">Resume Score</div>
                      <div className="text-lg font-extrabold font-display text-primary mt-0.5">
                        {analysisResult.resumeScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Skills tags extracted */}
                  <div>
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Extracted Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.extractedSkills.map((s: string) => (
                        <span key={s} className="text-[9px] font-semibold text-text bg-background-alt border border-card-border px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills alert */}
                  {analysisResult.missingSkills.length > 0 && (
                    <div className="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <div className="text-[9px] font-bold text-rose-500 flex items-center gap-1 mb-1">
                        <AlertTriangle size={12} /> Missing Keywords for target track:
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisResult.missingSkills.map((s: string) => (
                          <span key={s} className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement suggestions */}
                  <div>
                    <h4 className="text-[10px] font-bold text-text uppercase tracking-wider mb-1.5">ATS Improvement Action list</h4>
                    <ul className="space-y-1.5">
                      {analysisResult.suggestions.map((s: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-start text-[10px] text-text-muted leading-relaxed">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* 3. JOB MARKET PULSE (NEWS) */}
          <div className="glass-panel p-5 rounded-2xl border border-card-border mt-6">
            <div className="border-b border-card-border pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <Newspaper size={16} className="text-primary animate-pulse" /> Job Market Pulse
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
              </span>
            </div>

            {loadingNews ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full mb-2" />
                <span className="text-[10px] text-text-muted">Loading latest news...</span>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start group hover:bg-background-alt/50 p-2 rounded-xl transition-all border border-transparent hover:border-card-border/50">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-14 h-11 rounded-lg object-cover border border-card-border/80 flex-shrink-0 mt-0.5 shadow-sm"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex justify-between items-center text-[8px] text-text-muted font-bold">
                        <span>{item.source}</span>
                        <span>{item.date}</span>
                      </div>
                      <a
                        href={item.read_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </a>
                      <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-text-muted">No news updates available.</div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN OPPORTUNITY SEARCH & PROFILE MATCHES */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* A. AI TARGETED PROFILE MATCH RECOMMENDATIONS */}
          <div className="glass-panel p-5 rounded-2xl border border-card-border">
            <h3 className="text-sm font-bold text-text flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" /> AI Matches for You
            </h3>

            {loadingRecs ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map(op => (
                  <div key={op.id} className="p-3.5 bg-background-alt border border-card-border rounded-xl flex flex-col justify-between hover:border-primary/40 transition-all group relative overflow-hidden">
                    {/* Progress score bar top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-card-border">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${op.recommendationScore || 75}%` }} />
                    </div>

                    <div className="space-y-2 mt-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {op.category}
                        </span>
                        <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
                          <Sparkles size={10} /> {op.recommendationScore || 75}% Match
                        </span>
                      </div>
                      
                      <div className="flex gap-2.5 items-start">
                        {op.image_url ? (
                          <img
                            src={op.image_url}
                            alt={`${op.company} logo`}
                            className="w-8 h-8 rounded-lg object-cover border border-card-border/80 flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-card-border/80 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mt-0.5">
                            {op.company.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{op.title}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">{op.company} &bull; {op.location}</p>
                        </div>
                      </div>

                      {/* Required skills tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {op.skills && op.skills.slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[8px] font-medium text-text-muted bg-background border border-card-border px-1 py-0.2 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-card-border/50 pt-2.5 mt-3">
                      <span className="text-text-muted font-mono flex items-center gap-1">
                        <Calendar size={10} /> {new Date(op.deadline).toLocaleDateString()}
                      </span>
                      <a
                        href={op.apply_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                      >
                        Apply <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-text-muted">No custom profile matches found yet. Keep building skills!</div>
            )}
          </div>

          {/* B. MAIN SEARCH PANEL & GENERAL DIRECTORY */}
          <div className="glass-panel p-5 rounded-2xl border border-card-border space-y-4">
            
            {/* Search Input bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search hackathons, roles, skills, or companies..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-background-alt border border-card-border rounded-xl py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-text placeholder-text-muted"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {[
                { id: 'all', label: 'All Postings', icon: BookOpen },
                { id: 'job', label: 'Jobs', icon: Briefcase },
                { id: 'internship', label: 'Internships', icon: Briefcase },
                { id: 'hackathon', label: 'Hackathons', icon: Code },
                { id: 'drive', label: 'Placement Drives', icon: GraduationCap },
                { id: 'scholarship', label: 'Scholarships', icon: Award },
                { id: 'workshop', label: 'Workshops', icon: Award }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-primary border-primary text-white shadow-premium'
                        : 'border-card-border hover:bg-background-alt text-text-muted hover:text-text'
                    }`}
                  >
                    <TabIcon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Opportunities Feed Directory */}
            {loadingOps ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className="space-y-4">
                {filteredOpportunities.map(op => (
                  <div key={op.id} className="p-4 bg-background-alt border border-card-border rounded-xl hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between">
                    
                    <div className="flex gap-4 items-start flex-1 min-w-0">
                      {op.image_url ? (
                        <img
                          src={op.image_url}
                          alt={`${op.company} logo`}
                          className="w-12 h-12 rounded-xl object-cover border border-card-border/80 flex-shrink-0 mt-1 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-card-border/80 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-1">
                          {op.company.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[9px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {op.category}
                          </span>
                          <span className="text-[9px] font-bold text-text-muted bg-card-border/50 px-2 py-0.5 rounded">
                            Source: {op.source}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-text">{op.title}</h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-text-muted mt-0.5 items-center">
                            <span className="font-semibold text-text">{op.company}</span>
                            <span className="flex items-center gap-0.5"><MapPin size={10} /> {op.location}</span>
                            {op.department && <span className="text-primary font-medium">{op.department}</span>}
                          </div>
                        </div>

                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{op.description}</p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {op.skills && op.skills.map((s: string) => (
                            <span key={s} className="text-[9px] font-semibold text-text-muted bg-background border border-card-border px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Apply action and deadline info */}
                    <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2.5 sm:border-l sm:border-card-border/50 sm:pl-4 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-card-border/50">
                      <div className="text-left sm:text-right">
                        <div className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Deadline</div>
                        <div className="text-[11px] font-bold text-text flex items-center gap-1 mt-0.5">
                          <Calendar size={12} className="text-primary" /> {new Date(op.deadline).toLocaleDateString()}
                        </div>
                      </div>

                      <a
                        href={op.apply_link}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shadow-md"
                      >
                        Apply <ExternalLink size={11} />
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-panel border border-card-border rounded-xl flex flex-col items-center justify-center p-6 text-text-muted">
                <Briefcase size={28} className="mb-2" />
                <h4 className="text-xs font-bold text-text">No matching opportunities found</h4>
                <p className="text-[10px] text-text-muted mt-1">Try relaxing your search terms or clearing category filter tags.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
