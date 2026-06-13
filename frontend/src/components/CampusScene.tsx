import React, { useRef, useState, useEffect } from 'react';

// Procedural SVG-based premium interactive 3D particle system as a high-fidelity, high-performance visual layer.
// This is used for absolute compatibility, 60 FPS performance, and premium responsiveness.
export default function CampusScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }>>([]);

  useEffect(() => {
    // Initialize procedural floating nodes
    const initialParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(initialParticles);

    // Particle update animation loop
    let animId: number;
    const update = () => {
      setParticles(prev =>
        prev.map(p => {
          let nextX = p.x + p.speedX;
          let nextY = p.y + p.speedY;

          // Boundary bounce
          if (nextX < 0 || nextX > 100) p.speedX *= -1;
          if (nextY < 0 || nextY > 100) p.speedY *= -1;

          return {
            ...p,
            x: Math.max(0, Math.min(100, nextX)),
            y: Math.max(0, Math.min(100, nextY)),
          };
        })
      );
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-background-alt via-background to-background pointer-events-auto select-none"
    >
      {/* Dynamic Background Glowing Blobs */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 transition-all duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          left: `${mouse.x * 0.8}%`,
          top: `${mouse.y * 0.8}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-25 transition-all duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)',
          left: `${100 - mouse.x * 0.6}%`,
          top: `${100 - mouse.y * 0.6}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* SVG Canvas for Interactive 3D Perspective Lines and Particles */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--secondary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 3D Wireframe Perspectives representing Tech Campus buildings */}
        <g stroke="url(#line-grad)" strokeWidth="1" fill="none" className="transition-transform duration-300">
          {/* Main Campus Center Block Grid */}
          <polygon 
            points={`
              ${50 + (mouse.x - 50) * 0.05},${40 + (mouse.y - 50) * 0.05} 
              ${65 + (mouse.x - 50) * 0.04},${52 + (mouse.y - 50) * 0.04} 
              ${50 + (mouse.x - 50) * 0.05},${68 + (mouse.y - 50) * 0.05} 
              ${35 + (mouse.x - 50) * 0.06},${52 + (mouse.y - 50) * 0.06}
            `} 
            strokeWidth="1.5"
          />
          
          {/* Administrative Tower Wireframe */}
          <line 
            x1={50 + (mouse.x - 50) * 0.05} y1={12 + (mouse.y - 50) * 0.05} 
            x2={50 + (mouse.x - 50) * 0.05} y2={40 + (mouse.y - 50) * 0.05} 
            strokeWidth="2"
          />
          <line 
            x1={50 + (mouse.x - 50) * 0.05} y1={12 + (mouse.y - 50) * 0.05} 
            x2={65 + (mouse.x - 50) * 0.04} y2={22 + (mouse.y - 50) * 0.04} 
          />
          <line 
            x1={50 + (mouse.x - 50) * 0.05} y1={12 + (mouse.y - 50) * 0.05} 
            x2={35 + (mouse.x - 50) * 0.06} y2={22 + (mouse.y - 50) * 0.06} 
          />

          {/* Connectors representing Infinite Connections */}
          {particles.slice(0, 15).map((p, idx) => {
            const nextP = particles[(idx + 1) % 15];
            const dist = Math.hypot(p.x - nextP.x, p.y - nextP.y);
            if (dist < 25) {
              return (
                <line
                  key={`link-${idx}`}
                  x1={`${p.x}%`}
                  y1={`${p.y}%`}
                  x2={`${nextP.x}%`}
                  y2={`${nextP.y}%`}
                  stroke="var(--primary)"
                  strokeOpacity={(1 - dist / 25) * 0.25}
                  strokeWidth="0.8"
                />
              );
            }
            return null;
          })}
        </g>

        {/* Hover-Reactive Connective Node Lines */}
        {particles.map(p => {
          const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (distToMouse < 20) {
            return (
              <line
                key={`mouse-link-${p.id}`}
                x1={`${p.x}%`}
                y1={`${p.y}%`}
                x2={`${mouse.x}%`}
                y2={`${mouse.y}%`}
                stroke="var(--accent)"
                strokeOpacity={(1 - distToMouse / 20) * 0.4}
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            );
          }
          return null;
        })}
      </svg>

      {/* Floating 3D Procedural Assets (SVG/CSS Layer with 3D translations) */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Floating Open Book */}
        <div 
          className="absolute transition-all duration-300 ease-out animate-float"
          style={{
            left: '25%',
            top: '30%',
            transform: `translate(${(mouse.x - 50) * 0.1}px, ${(mouse.y - 50) * 0.1}px) rotateY(${(mouse.x - 50) * 0.4}deg)`,
            perspective: '1000px'
          }}
        >
          <div className="w-16 h-12 flex relative transform-style-3d rotateX-30">
            {/* Book Left Page */}
            <div className="w-8 h-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l shadow-lg origin-right transform rotateY-10 flex flex-col justify-around p-1">
              <div className="h-0.5 bg-slate-400 w-4 rounded" />
              <div className="h-0.5 bg-slate-400 w-5 rounded" />
              <div className="h-0.5 bg-slate-400 w-3 rounded" />
            </div>
            {/* Book Right Page */}
            <div className="w-8 h-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r shadow-lg origin-left transform rotateY--10 flex flex-col justify-around p-1">
              <div className="h-0.5 bg-slate-400 w-5 rounded" />
              <div className="h-0.5 bg-slate-400 w-3 rounded" />
              <div className="h-0.5 bg-slate-400 w-4 rounded" />
            </div>
          </div>
        </div>

        {/* Floating Graduation Cap */}
        <div 
          className="absolute transition-all duration-300 ease-out animate-float"
          style={{
            left: '70%',
            top: '25%',
            transform: `translate(${(mouse.x - 50) * -0.08}px, ${(mouse.y - 50) * -0.08}px) rotate(-15deg)`,
            animationDelay: '1.5s'
          }}
        >
          <div className="relative w-16 h-14 flex flex-col items-center">
            {/* Diamond top */}
            <div className="w-16 h-8 bg-slate-900 dark:bg-slate-200 shadow-lg transform rotateX-60 border border-slate-700 dark:border-slate-300 relative flex items-center justify-center">
              {/* Golden button */}
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 absolute" />
            </div>
            {/* Cap Base */}
            <div className="w-8 h-4 bg-slate-800 dark:bg-slate-400 rounded-b shadow-md border-x border-b border-slate-700 dark:border-slate-300 -mt-2" />
            {/* Tassel */}
            <div className="w-0.5 h-6 bg-yellow-500 absolute left-12 top-4 transform origin-top rotate-12 shadow" />
          </div>
        </div>

        {/* Rotating Academic Badge Icons */}
        <div 
          className="absolute transition-all duration-300 ease-out animate-float"
          style={{
            left: '60%',
            top: '65%',
            transform: `translate(${(mouse.x - 50) * 0.05}px, ${(mouse.y - 50) * -0.05}px)`,
            animationDelay: '3s'
          }}
        >
          <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-primary shadow-premium border border-card-border animate-spin-slow">
            <span className="text-xl font-bold font-display select-none">A+</span>
          </div>
        </div>
      </div>

      {/* Particle Nodes Overlay */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            backgroundColor: 'var(--secondary)',
            boxShadow: `0 0 ${p.size * 2}px var(--secondary)`,
          }}
        />
      ))}
    </div>
  );
}
