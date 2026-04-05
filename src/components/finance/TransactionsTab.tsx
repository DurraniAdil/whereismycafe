import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Transaction, TransactionFormData, FinanceOwner } from '../../types/finance';
import { CATEGORIES, CATEGORY_COLORS } from '../../types/finance';
import { fetchTransactions, addTransaction, editTransaction, deleteTransaction } from '../../lib/financeApi';

interface Props { owner: FinanceOwner; }

const EMPTY_FORM: TransactionFormData = { type: 'expense', category: 'Supplies', amount: '', description: '', date: new Date().toISOString().split('T')[0] };

export const TransactionsTab: React.FC<Props> = ({ owner }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TransactionFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');



  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20', sortBy, sortOrder };
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      if (search) params.search = search;
      const res = await fetchTransactions(params);
      setTransactions(res.transactions);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [page, filterType, filterCategory, search, sortBy, sortOrder]);

  useEffect(() => { loadData(); }, [loadData]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editingId) {
        await editTransaction(editingId, payload);
      } else {
        await addTransaction(payload);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Error saving');
    }
    setFormLoading(false);
  };

  const handleEdit = (tx: Transaction) => {
    setForm({ type: tx.type, category: tx.category, amount: String(tx.amount), description: tx.description, date: new Date(tx.date).toISOString().split('T')[0] });
    setEditingId(tx._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await deleteTransaction(id); loadData(); }
    catch (err) { console.error(err); }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const inputClass = "w-full px-3 py-2.5 bg-[#F8F6F1] text-[#1E2020] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d]/30 transition-all text-sm";
  const selectClass = "px-3 py-2 bg-[#F8F6F1] text-[#1E2020] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0b4e9d] text-xs cursor-pointer";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search transactions..." className={`${inputClass} max-w-[240px] !py-2 !text-xs`} />
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-[11px] text-gray-500 ml-auto">{total} transaction{total !== 1 ? 's' : ''}</span>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
            className="px-4 py-2 bg-[#0b4e9d] text-white text-xs font-semibold rounded-xl hover:bg-[#093d7a] transition-all">
            + Add
          </motion.button>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1E2020]">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-[#1E2020] text-lg transition-colors">×</button>
            </div>
            {formError && <div className="mb-3 text-red-600 text-xs bg-red-50 border border-red-200 py-2 px-3 rounded-xl">{formError}</div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as any}))} className={inputClass}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} required min="1" className={inputClass} />
              <input type="text" placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required className={inputClass} />
              <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required className={inputClass} />
              <motion.button type="submit" disabled={formLoading} whileTap={{ scale: 0.96 }}
                className="px-4 py-2.5 bg-[#0b4e9d] text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover:bg-[#093d7a] transition-all">
                {formLoading ? '...' : editingId ? 'Save' : 'Add'}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {[{ key: 'date', label: 'Date' }, { key: 'type', label: 'Type' }, { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount' }].map(col => (
                  <th key={col.key} onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#1E2020] transition-colors select-none">
                    {col.label} {sortBy === col.key && <span className="text-[#0b4e9d]">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">No transactions found</td></tr>
              ) : (
                transactions.map((tx, i) => (
                  <motion.tr key={tx._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap font-mono">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#6b7280' }} />
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{tx.description}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => handleEdit(tx)} className="text-[#0b4e9d] hover:text-blue-700 text-xs mr-3 opacity-0 group-hover:opacity-100 transition-all">Edit</button>
                        <button onClick={() => handleDelete(tx._id)} className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition-all">Del</button>
                      </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/30">
            <span className="text-[11px] text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 hover:text-[#1E2020] transition-all">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 hover:text-[#1E2020] transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
