import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { FinanceOwner, DashboardSummary, Insights } from '../types/finance';
import { fetchMe, fetchSummary, fetchInsights, exportData } from '../lib/financeApi';
import { FinanceLogin } from '../components/finance/FinanceLogin';
import { DashboardOverview } from '../components/finance/DashboardOverview';
import { TransactionsTab } from '../components/finance/TransactionsTab';
import { InsightsTab } from '../components/finance/InsightsTab';

type Tab = 'overview' | 'transactions' | 'insights';

export function FinanceDashboard() {
  const [owner, setOwner] = useState<FinanceOwner | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Data
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Check stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('wimc_owner_token');
    if (!token) { setAuthLoading(false); return; }
    fetchMe()
      .then(res => setOwner(res.owner))
      .catch(() => localStorage.removeItem('wimc_owner_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (!owner) return;
    setSummaryLoading(true);
    fetchSummary().then(setSummary).catch(console.error).finally(() => setSummaryLoading(false));
    setInsightsLoading(true);
    fetchInsights().then(setInsights).catch(console.error).finally(() => setInsightsLoading(false));
  }, [owner]);

  const handleLogout = () => {
    localStorage.removeItem('wimc_owner_token');
    setOwner(null);
    setSummary(null);
    setInsights(null);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true);
    try {
      const blob = await exportData(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error('Export failed:', err); }
    setExporting(false);
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#0b4e9d]/30 border-t-[#0b4e9d] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!owner) {
    return <FinanceLogin onLogin={setOwner} />;
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { key: 'transactions', label: 'Transactions', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></svg> },
    { key: 'insights', label: 'Insights', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E2020] pb-24">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center">
              <img src="/media/map-pin.png" alt="WIMC Portal" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">WIMC Portal</h1>
              <p className="text-[10px] text-gray-500">{owner.cafeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <button disabled={exporting}
                className="px-3 py-1.5 text-[11px] font-medium text-[#1E2020] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50">
                {exporting ? '...' : '↓ Export'}
              </button>
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-30">
                <button onClick={() => handleExport('csv')} className="block w-full px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#1E2020] transition-colors text-left">CSV</button>
                <button onClick={() => handleExport('json')} className="block w-full px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#1E2020] transition-colors text-left">JSON</button>
              </div>
            </div>
            <button onClick={handleLogout}
              className="px-3 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all">
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Tab navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-2xl p-1 w-fit shadow-sm">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.key
                  ? 'bg-[#0b4e9d] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#1E2020]'
                }`}>
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && <DashboardOverview summary={summary} loading={summaryLoading} />}
        {activeTab === 'transactions' && <TransactionsTab owner={owner} />}
        {activeTab === 'insights' && <InsightsTab insights={insights} loading={insightsLoading} />}
      </div>
    </div>
  );
}
