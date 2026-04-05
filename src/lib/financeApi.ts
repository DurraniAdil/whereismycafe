import { API_URL } from './api';
import type { DashboardSummary, Insights, Transaction, FinanceOwner } from '../types/finance';

const getToken = () => localStorage.getItem('wimc_owner_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

export async function financeLogin(email: string, password: string): Promise<{ token: string; owner: FinanceOwner }> {
  const res = await fetch(`${API_URL}/finance/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
}

export async function financeRegister(data: any): Promise<{ token: string; owner: FinanceOwner }> {
  const res = await fetch(`${API_URL}/finance/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function fetchMe(): Promise<{ owner: FinanceOwner }> {
  const res = await fetch(`${API_URL}/finance/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Auth failed');
  return res.json();
}

export async function fetchSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_URL}/finance/summary`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchTransactions(params: Record<string, string> = {}): Promise<{
  transactions: Transaction[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/finance/transactions?${qs}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(data: any): Promise<Transaction> {
  const res = await fetch(`${API_URL}/finance/transactions`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
  return res.json();
}

export async function editTransaction(id: string, data: any): Promise<Transaction> {
  const res = await fetch(`${API_URL}/finance/transactions/${id}`, {
    method: 'PATCH', headers: authHeaders(), body: JSON.stringify(data)
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
  return res.json();
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/finance/transactions/${id}`, {
    method: 'DELETE', headers: authHeaders()
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
}

export async function fetchInsights(): Promise<Insights> {
  const res = await fetch(`${API_URL}/finance/insights`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
}

export async function exportData(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
  const res = await fetch(`${API_URL}/finance/export?format=${format}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}
