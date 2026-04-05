import React from 'react';
import { motion } from 'motion/react';
import type { DashboardSummary } from '../../types/finance';
import { CATEGORY_COLORS } from '../../types/finance';
import { BalanceTrendChart, CategoryDonut } from './Charts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Props {
  summary: DashboardSummary | null;
  loading: boolean;
}

const formatCurrency = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const SummaryCard: React.FC<{
  title: string; value: string; subtitle?: string;
  color: string; icon: React.ReactNode; delay: number;
}> = ({ title, value, subtitle, color, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-gray-200 rounded-2xl p-5 relative overflow-hidden group hover:border-gray-300 transition-colors shadow-sm"
  >
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: color }} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{title}</p>
        <p className="text-2xl font-bold text-[#1E2020] tracking-tight">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export const DashboardOverview: React.FC<Props> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0,1,2,3].map(i => <div key={i} className="bg-white border border-gray-200 shadow-sm rounded-2xl h-28 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl h-64 animate-pulse" />
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  const trendData = summary.monthlyTrend.map(m => ({
    label: MONTHS[m._id.month - 1],
    income: m.income,
    expenses: m.expenses
  }));

  const donutData = summary.categoryBreakdown.map(c => ({
    label: c._id,
    value: c.total,
    color: CATEGORY_COLORS[c._id] || '#6b7280'
  }));

  const profitMargin = summary.totalIncome > 0
    ? ((summary.balance / summary.totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard delay={0} title="Balance" value={formatCurrency(summary.balance)} subtitle={`${profitMargin}% profit margin`} color="#0b4e9d"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b4e9d" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} />
        <SummaryCard delay={0.05} title="Income" value={formatCurrency(summary.totalIncome)} color="#10b981"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 19V5m-7 7 7-7 7 7" /></svg>} />
        <SummaryCard delay={0.1} title="Expenses" value={formatCurrency(summary.totalExpenses)} color="#ef4444"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M12 5v14m7-7-7 7-7-7" /></svg>} />
        <SummaryCard delay={0.15} title="Transactions" value={summary.transactionCount.toString()} color="#8b5cf6"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-4">Balance Trend</h3>
          <BalanceTrendChart data={trendData} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#1E2020] mb-4">Expense Breakdown</h3>
          <CategoryDonut data={donutData} />
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#1E2020] mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {summary.recentTransactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <p className="text-sm text-[#1E2020] font-medium">{tx.description}</p>
                  <p className="text-[10px] text-gray-500">{tx.category} · {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
          {summary.recentTransactions.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
