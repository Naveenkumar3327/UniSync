import React, { useState } from 'react';

interface ChartData {
  userGrowth: Array<{ month: string; count: number }>;
  complaintTrends: Array<{ category: string; open: number; resolved: number }>;
  departmentActivity: Array<{ name: string; projects: number; events: number }>;
}

export default function AnalyticsCharts({ data }: { data: ChartData }) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // 1. User Growth Area Chart (SVG Path Drawing)
  const maxGrowth = Math.max(...data.userGrowth.map(d => d.count));
  const points = data.userGrowth.map((d, index) => {
    const x = 50 + index * 90;
    const y = 220 - (d.count / maxGrowth) * 160;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} 230 L ${points[0].x} 230 Z` 
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* User Growth Area Chart card */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-text mb-1">User Base Growth</h3>
          <p className="text-xs text-text-muted mb-4">Total students and faculty registered on UniSync</p>
        </div>
        
        <div className="relative h-60 w-full">
          <svg className="w-full h-full" viewBox="0 0 540 260">
            {/* Grid Lines */}
            <line x1="50" y1="60" x2="500" y2="60" stroke="var(--card-border)" strokeDasharray="3 3" />
            <line x1="50" y1="140" x2="500" y2="140" stroke="var(--card-border)" strokeDasharray="3 3" />
            <line x1="50" y1="220" x2="500" y2="220" stroke="var(--card-border)" strokeWidth="1.5" />

            {/* Gradient definition for fill */}
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Shaded Area */}
            {areaD && <path d={areaD} fill="url(#growthGrad)" />}

            {/* Main Trend Line */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="transition-all duration-500" 
              />
            )}

            {/* Interactive Circles */}
            {points.map((p, idx) => (
              <g key={`pt-${idx}`}>
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredPoint === idx ? 8 : 4} 
                  fill={hoveredPoint === idx ? 'var(--accent)' : 'var(--primary)'}
                  stroke="var(--background)"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer transition-all duration-150"
                />
                {/* Tooltip on hover */}
                {hoveredPoint === idx && (
                  <foreignObject x={p.x - 45} y={p.y - 45} width="90" height="35">
                    <div className="bg-slate-900 text-[10px] text-white py-1 px-2 rounded shadow text-center border border-slate-700">
                      <strong>{p.count}</strong> users
                    </div>
                  </foreignObject>
                )}
                {/* X-Axis labels */}
                <text x={p.x} y="245" textAnchor="middle" className="text-[10px] fill-text-muted font-medium">
                  {p.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Complaint Trends Bar Chart card */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-text mb-1">Complaints Resolution Telemetry</h3>
          <p className="text-xs text-text-muted mb-4">Pending vs Resolved status metrics per category</p>
        </div>

        <div className="relative h-60 w-full">
          <svg className="w-full h-full" viewBox="0 0 540 260">
            {/* Grid Line */}
            <line x1="50" y1="220" x2="500" y2="220" stroke="var(--card-border)" strokeWidth="1.5" />

            {/* Draw grouped bars */}
            {data.complaintTrends.map((item, idx) => {
              const xOffset = 70 + idx * 110;
              const openHeight = (item.open / 100) * 160;
              const resHeight = (item.resolved / 100) * 160;

              return (
                <g key={`bar-group-${idx}`} className="transition-all duration-300">
                  {/* Open / Pending Complaint Bar */}
                  <rect
                    x={xOffset}
                    y={220 - openHeight}
                    width="24"
                    height={Math.max(4, openHeight)}
                    rx="4"
                    fill="var(--primary)"
                    fillOpacity={hoveredBar === idx ? 1 : 0.85}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer transition-all duration-200"
                  />
                  {/* Resolved Complaint Bar */}
                  <rect
                    x={xOffset + 28}
                    y={220 - resHeight}
                    width="24"
                    height={Math.max(4, resHeight)}
                    rx="4"
                    fill="var(--secondary)"
                    fillOpacity={hoveredBar === idx ? 1 : 0.85}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer transition-all duration-200"
                  />

                  {/* Text labels below axis */}
                  <text x={xOffset + 26} y="245" textAnchor="middle" className="text-[10px] fill-text-muted font-medium">
                    {item.category}
                  </text>

                  {/* Value tooltips inside / above bars */}
                  {hoveredBar === idx && (
                    <foreignObject x={xOffset - 15} y={15} width="112" height="42">
                      <div className="bg-slate-900 text-[9px] text-white p-1 rounded shadow border border-slate-700 leading-tight">
                        <span className="text-primary font-bold">● Open: {item.open}</span><br />
                        <span className="text-secondary font-bold">● Solved: {item.resolved}</span>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
