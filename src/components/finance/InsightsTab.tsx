import React from 'react';
import { motion } from 'motion/react';
import type { Insights } from '../../types/finance';
import { CATEGORY_COLORS } from '../../types/finance';
import { ComparisonBar } from './Charts';

interface Props {
  insights: Insights | null;
  loading: boolean;
}

const fmt = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const pctChange = (curr: number, prev: number) => {
  if (prev === 0) return curr > 0 ? '+100' : '0';
  return ((curr - prev) / prev * 100).toFixed(1);
};

export const InsightsTab: React.FC<Props> = ({ insights, loading }) => {
  if (loading || !insights) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0,1,2,3].map(i => <div key={i} className="bg-white border border-gray-200 shadow-sm rounded-2xl h-52 animate-pulse" />)}
      </div>
    );
  }

  const incChange = pctChange(insights.currentMonth.income, insights.previousMonth.income);
  const expChange = pctChange(insights.currentMonth.expenses, insights.previousMonth.expenses);
  const profitChange = pctChange(insights.currentMonth.profit, insights.previousMonth.profit);

  // Compute smart observations
  const observations: string[] = [];
  if (insights.topCategories.length > 0) {
    observations.push(`Highest expense category is ${insights.topCategories[0]._id} at ${fmt(insights.topCategories[0].total)}`);
  }
  if (Number(incChange) > 0) observations.push(`Income is up ${incChange}% from last month`);
  else if (Number(incChange) < 0) observations.push(`Income dropped ${Math.abs(Number(incChange))}% from last month`);
  if (insights.currentMonth.profit > 0) observations.push(`This month is profitable: net ${fmt(insights.currentMonth.profit)}`);
  else if (insights.currentMonth.profit < 0) observations.push(`This month is running at a loss of ${fmt(Math.abs(insights.currentMonth.profit))}`);
  if (insights.topIncomeSources.length > 0) {
    observations.push(`Top revenue source: ${insights.topIncomeSources[0]._id} (${fmt(insights.topIncomeSources[0].total)})`);
  }

  // Daily average chart data
  const dailyData = insights.dailyAvg.slice(-14).map(d => ({
    label: new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    value1: d.income,
    value2: d.expenses
  }));

  return (
    <div className="space-y-5">
      {/* Month comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: 'Monthly Income', current: insights.currentMonth.income, prev: insights.previousMonth.income, change: incChange, color: '#10b981' },
          { title: 'Monthly Expenses', current: insights.currentMonth.expenses, prev: insights.previousMonth.expenses, change: expChange, color: '#ef4444', invertColor: true },
          { title: 'Monthly Profit', current: insights.currentMonth.profit, prev: insights.previousMonth.profit, change: profitChange, color: '#0b4e9d' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-15" style={{ backgroundColor: card.color }} />
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{card.title}</p>
            <p className="text-xl font-bold text-[#1E2020]">{fmt(card.current)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[11px] font-semibold ${
                card.invertColor
                  ? Number(card.change) > 0 ? 'text-red-400' : 'text-emerald-400'
                  : Number(card.change) > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {Number(card.change) > 0 ? '↑' : '↓'} {Math.abs(Number(card.change))}%
              </span>
              <span className="text-[10px] text-gray-600">vs last month ({fmt(card.prev)})</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-4">Top Expense Categories</h3>
          <div className="space-y-3">
            {insights.topCategories.map((cat, i) => {
              const maxTotal = insights.topCategories[0]?.total || 1;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[cat._id] || '#6b7280' }} />
                      {cat._id}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">{fmt(cat.total)} ({cat.count})</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.total / maxTotal) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="h-full rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat._id] || '#6b7280' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top income sources */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-4">Top Income Sources</h3>
          <div className="space-y-3">
            {insights.topIncomeSources.map((src, i) => {
              const maxTotal = insights.topIncomeSources[0]?.total || 1;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[src._id] || '#10b981' }} />
                      {src._id}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">{fmt(src.total)} ({src.count})</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(src.total / maxTotal) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="h-full rounded-full bg-emerald-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Daily trend */}
      {dailyData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-4">Daily Trend (Last 14 Days)</h3>
          <ComparisonBar data={dailyData} />
        </motion.div>
      )}

      {/* Smart observations */}
      {observations.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px]">💡</span>
            Smart Observations
          </h3>
          <div className="space-y-2">
            {observations.map((obs, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5 text-xs">•</span>
                <p className="text-xs text-gray-600 leading-relaxed">{obs}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
