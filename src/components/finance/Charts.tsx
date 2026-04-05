import React from 'react';

interface Props {
  data: Array<{ label: string; income: number; expenses: number }>;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const BalanceTrendChart: React.FC<Props> = ({ data }) => {
  if (!data.length) return <div className="text-gray-500 text-sm text-center py-8">No trend data yet</div>;

  const W = 520, H = 200, PAD = { t: 20, r: 20, b: 40, l: 55 };
  const cw = W - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;

  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1);

  const x = (i: number) => PAD.l + (i / (data.length - 1 || 1)) * cw;
  const y = (v: number) => PAD.t + ch - (v / maxVal) * ch;

  const linePath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const areaPath = (vals: number[]) =>
    linePath(vals) + ` L${x(vals.length - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

  const incomeVals = data.map(d => d.income);
  const expenseVals = data.map(d => d.expenses);

  const gridLines = 4;
  const formatNum = (n: number) => n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="incomeGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="expenseGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yPos = PAD.t + (i / gridLines) * ch;
        const val = maxVal - (i / gridLines) * maxVal;
        return (
          <g key={i}>
            <line x1={PAD.l} y1={yPos} x2={W - PAD.r} y2={yPos} stroke="#e5e7eb" strokeWidth="0.5" />
            <text x={PAD.l - 8} y={yPos + 4} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace">{formatNum(val)}</text>
          </g>
        );
      })}

      {/* Areas */}
      <path d={areaPath(incomeVals)} fill="url(#incomeGrad)" />
      <path d={areaPath(expenseVals)} fill="url(#expenseGrad)" />

      {/* Lines */}
      <path d={linePath(incomeVals)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={linePath(expenseVals)} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" />

      {/* Dots */}
      {incomeVals.map((v, i) => <circle key={`i${i}`} cx={x(i)} cy={y(v)} r="3.5" fill="#10b981" stroke="white" strokeWidth="1.5" />)}
      {expenseVals.map((v, i) => <circle key={`e${i}`} cx={x(i)} cy={y(v)} r="3" fill="#ef4444" stroke="white" strokeWidth="1.5" />)}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">{d.label}</text>
      ))}

      {/* Legend */}
      <circle cx={PAD.l} cy={H - 2} r="3" fill="#10b981" />
      <text x={PAD.l + 8} y={H + 1} fill="#9ca3af" fontSize="8">Income</text>
      <circle cx={PAD.l + 60} cy={H - 2} r="3" fill="#ef4444" />
      <text x={PAD.l + 68} y={H + 1} fill="#9ca3af" fontSize="8">Expenses</text>
    </svg>
  );
};

interface DonutProps {
  data: Array<{ label: string; value: number; color: string }>;
}

export const CategoryDonut: React.FC<DonutProps> = ({ data }) => {
  if (!data.length) return <div className="text-gray-500 text-sm text-center py-8">No expense data</div>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const SIZE = 180, CX = SIZE / 2, CY = SIZE / 2, R = 65, INNER = 40;

  let cumAngle = -90;
  const slices = data.map(d => {
    const angle = (d.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, angle, pct: ((d.value / total) * 100).toFixed(1) };
  });

  const arc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const s = (startAngle * Math.PI) / 180;
    const e = (endAngle * Math.PI) / 180;
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx + r * Math.cos(s)} ${cy + r * Math.sin(s)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(e)} ${cy + r * Math.sin(e)}`;
  };

  const formatNum = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="flex-shrink-0">
        {slices.map((s, i) => {
          if (s.angle < 0.5) return null;
          const path = `${arc(CX, CY, R, s.start, s.start + s.angle)} L ${CX + INNER * Math.cos(((s.start + s.angle) * Math.PI) / 180)} ${CY + INNER * Math.sin(((s.start + s.angle) * Math.PI) / 180)} ${arc(CX, CY, INNER, s.start + s.angle, s.start).replace('M', 'L')} Z`;
          return (
          <path key={i} d={path} fill={s.color} opacity="0.85" stroke="white" strokeWidth="1.5"
              className="hover:opacity-100 transition-opacity cursor-default">
              <title>{s.label}: {formatNum(s.value)} ({s.pct}%)</title>
            </path>
          );
        })}
        <text x={CX} y={CY - 6} textAnchor="middle" fill="#1E2020" fontSize="13" fontWeight="bold">{formatNum(total)}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fill="#6b7280" fontSize="8">TOTAL</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {slices.slice(0, 8).map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[#1E2020] truncate max-w-[80px]">{s.label}</span>
            <span className="text-gray-500 ml-auto">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BarProps {
  data: Array<{ label: string; value1: number; value2: number }>;
  label1?: string;
  label2?: string;
  color1?: string;
  color2?: string;
}

export const ComparisonBar: React.FC<BarProps> = ({
  data, label1 = 'Income', label2 = 'Expenses', color1 = '#10b981', color2 = '#ef4444'
}) => {
  if (!data.length) return <div className="text-gray-500 text-sm text-center py-8">No data</div>;

  const maxVal = Math.max(...data.flatMap(d => [d.value1, d.value2]), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-2">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color1 }} />{label1}</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color2 }} />{label2}</div>
      </div>
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="text-[11px] text-gray-500 font-medium">{d.label}</div>
          <div className="flex gap-1 h-5">
            <div className="rounded-sm h-full transition-all duration-500" style={{ width: `${(d.value1 / maxVal) * 100}%`, backgroundColor: color1, minWidth: d.value1 > 0 ? '4px' : '0' }} />
            <div className="rounded-sm h-full transition-all duration-500" style={{ width: `${(d.value2 / maxVal) * 100}%`, backgroundColor: color2, minWidth: d.value2 > 0 ? '4px' : '0', opacity: 0.7 }} />
          </div>
        </div>
      ))}
    </div>
  );
};
