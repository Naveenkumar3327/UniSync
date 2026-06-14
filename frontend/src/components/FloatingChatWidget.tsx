import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Brain, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: Date;
}

export default function FloatingChatWidget() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const role = user?.role || 'student';
  const profile = user?.profile || {};

  // Check if widget should display on current route
  const showWidget = role === 'student' && (
    location.pathname === '/dashboard/student' ||
    location.pathname === '/dashboard/student/collaboration' ||
    location.pathname === '/dashboard/student/study-workspace' ||
    location.pathname === '/dashboard/student/opportunity-hub'
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Hello ${profile.full_name || 'there'}! I am **SyncAI**, your personal career and opportunity companion. How can I help you excel today?`,
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestion chips templates
  const suggestionChips = [
    { text: 'Show latest hackathons', label: '🏆 Hackathons' },
    { text: 'Find AI internships', label: '💻 AI Internships' },
    { text: 'Show remote developer jobs', label: '🌍 Remote Jobs' },
    { text: 'Suggest opportunities based on my profile', label: '🎯 Match Profile' }
  ];

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!showWidget) return null;

  // Send message action
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const studentMessage: Message = {
      id: `msg-${Date.now()}-student`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, studentMessage]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/syncai/chat`, {
        message: textToSend,
        studentProfile: {
          department: profile.department || 'Computer Science & Engineering',
          year: profile.year || 3,
          skills: ['React', 'JavaScript', 'Node.js', 'Python', 'SQL']
        }
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: response.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.warn('Backend chat service offline, using mock responses.');
      
      // Local fallback mock replies
      setTimeout(() => {
        let reply = '';
        const query = textToSend.toLowerCase();

        if (query.includes('hackathon')) {
          reply = `### 🏆 Highly Recommended Hackathons\n\nI found **Smart India Hackathon 2026** hosted by *Govt of India*:\n*   **Deadline:** Register immediately!\n*   **Skills Required:** React, Flask, AI, IoT\n\nYou can team up with fellow CS/ECE students inside the **Collaboration Hub** to compete!`;
        } else if (query.includes('intern') || query.includes('internship')) {
          reply = `### 💼 Matching Internships\n\n*   **AI / ML Research Intern** at **Google** (Bangalore, India)\n    *Skills:* Python, PyTorch, Machine Learning, TensorFlow\n\n*   **CAD Design Intern** at **Tesla** (Bangalore, India)\n    *Skills:* CAD, SolidWorks, CATIA\n\nWould you like me to compare your resume skills against these?`;
        } else if (query.includes('job') || query.includes('developer')) {
          reply = `### 🚀 Recommended Developer Openings\n\n*   **Full Stack Developer Job** at **Microsoft** (Remote)\n    *Skills:* React, TypeScript, Node.js, PostgreSQL\n\n*   **Embedded Systems Engineer** at **Intel** (Bangalore, India)\n    *Skills:* Embedded C, RTOS, Microcontrollers, IoT\n\nYou can check details and direct links inside the **Opportunity Hub** dashboard.`;
        } else {
          reply = `I understand you are looking for opportunities. Based on your current profile: **${profile.department || 'Computer Science'} student**, I recommend exploring our **Opportunity Hub** tabs to find tailored listings or running a resume scan. Ask me details about hackathons, internships, or job roles!`;
        }

        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          text: reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1200);
      return;
    }
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. EXPANDED GLASSMORPHISM CHAT DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, cubicBezier: [0.4, 0, 0.2, 1] }}
            className="w-[350px] sm:w-[400px] h-[500px] glass-panel rounded-3xl shadow-premium border border-card-border overflow-hidden flex flex-col justify-between mb-4 bg-background/95 backdrop-blur-xl"
          >
            
            {/* Drawer Header banner */}
            <div className="p-4 border-b border-card-border bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white relative">
                  <Brain size={18} className="animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text flex items-center gap-1">
                    SyncAI <Sparkles size={11} className="text-primary animate-pulse" />
                  </h3>
                  <span className="text-[9px] text-text-muted">Your Career & Opportunity Assistant</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-background-alt text-text-muted hover:text-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body messages area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[320px] scrollbar-thin">
              
              {messages.map(msg => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isAI ? '' : 'flex-row-reverse'}`}>
                    
                    {/* Profile avatar bubbles */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isAI ? 'bg-primary text-white' : 'bg-secondary text-white'
                    }`}>
                      {isAI ? 'AI' : <User size={12} />}
                    </div>

                    <div className="space-y-1 max-w-[75%]">
                      <div
                        className={`p-3 rounded-2xl text-[11px] leading-relaxed font-medium ${
                          isAI
                            ? 'bg-background-alt border border-card-border text-text rounded-tl-none font-sans prose dark:prose-invert max-w-full'
                            : 'bg-primary text-white rounded-tr-none'
                        }`}
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {/* Format bold strings and lists in markdown simply */}
                        {msg.text.split('\n').map((line, lIdx) => {
                          let formatted = line;
                          // Basic bullet indicators
                          const isBullet = formatted.startsWith('*') || formatted.startsWith('-');
                          if (isBullet) {
                            formatted = formatted.substring(1).trim();
                          }
                          // Basic bolding parse
                          const boldParts = formatted.split('**');
                          
                          const element = (
                            <span key={lIdx} className="block mt-0.5">
                              {isBullet && <span className="text-primary mr-1">&bull;</span>}
                              {boldParts.map((part, pIdx) => 
                                pIdx % 2 === 1 ? <strong key={pIdx} className={isAI ? 'font-bold text-text' : 'font-bold text-white'}>{part}</strong> : part
                              )}
                            </span>
                          );
                          return element;
                        })}
                      </div>
                      
                      <span className={`text-[8px] text-text-muted block ${isAI ? 'text-left' : 'text-right'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                );
              })}

              {/* Typing bouncing loader */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                    AI
                  </div>
                  <div className="bg-background-alt border border-card-border p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips area */}
            {messages.length < 3 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-card-border bg-slate-500/5 overflow-x-auto max-h-[80px]">
                {suggestionChips.map(chip => (
                  <button
                    key={chip.text}
                    onClick={() => handleSendMessage(chip.text)}
                    className="text-[9px] font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                  >
                    {chip.label} <ArrowRight size={8} />
                  </button>
                ))}
              </div>
            )}

            {/* Input toolbar footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 border-t border-card-border flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask SyncAI anything..."
                className="flex-1 bg-background-alt border border-card-border rounded-xl px-4 py-2 text-xs text-text focus:outline-none focus:border-primary placeholder-text-muted"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shadow-premium shrink-0 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING PULSING AI ORB BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-premium relative border border-white/20 overflow-hidden"
      >
        {/* Pulsing ring visual animation behind orb */}
        <span className="absolute inset-0 bg-primary/30 rounded-full animate-ping pointer-events-none opacity-70" />
        
        {/* Swirling glow orb */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-spin-slow pointer-events-none" />
        
        {isOpen ? <X size={22} className="relative z-10" /> : <MessageSquare size={22} className="relative z-10" />}
      </motion.button>

    </div>
  );
}
