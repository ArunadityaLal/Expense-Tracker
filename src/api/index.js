import { getAccessToken } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5173';

async function callBackend(path, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(err.error || resp.statusText);
  }
  return resp.json();
}

/** Exports for frontend usage */
export const expensesAPI = {
  list: () => callBackend('/api/personal-expenses'),
  create: (payload) => callBackend('/api/personal-expenses', { method: 'POST', body: payload }),
  update: (id, payload) => callBackend(`/api/personal-expenses/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => callBackend(`/api/personal-expenses/${id}`, { method: 'DELETE' })
};

export const groupsAPI = {
  list: () => callBackend('/api/groups'),
  create: (payload) => callBackend('/api/groups', { method: 'POST', body: payload }),
  remove: (id) => callBackend(`/api/groups/${id}`, { method: 'DELETE' }),
  members: (groupId) => callBackend(`/api/group-members/${groupId}`),
  createMember: (payload) => callBackend('/api/group-members', { method: 'POST', body: payload }),
  createExpense: (payload) => callBackend('/api/group-expenses', { method: 'POST', body: payload }),
  listExpenses: (groupId) => callBackend(`/api/group-expenses/${groupId}`)
};

export const profileAPI = {
  me: () => callBackend('/api/profile')
};
