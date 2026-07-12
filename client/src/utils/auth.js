import { API_URL } from '../config';
import { fetchWithTimeout } from './fetchHelper';

const TOKEN_KEY = 'aishop_token';
const USER_KEY = 'aishop_user';

// `remember` decides persistence: localStorage survives browser restarts,
// sessionStorage clears when the tab closes.
function storageFor(remember) {
  if (typeof window === 'undefined') return null;
  return remember ? window.localStorage : window.sessionStorage;
}

export function saveSession({ access_token, user }, remember = true) {
  const store = storageFor(remember);
  if (!store) return;
  // Clear the other storage so a stale session doesn't linger there.
  const other = storageFor(!remember);
  if (other) {
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
  }
  store.setItem(TOKEN_KEY, access_token);
  store.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

async function parseError(res, fallback) {
  try {
    const data = await res.json();
    return data.detail || fallback;
  } catch {
    return fallback;
  }
}

export async function signup({ fullName, email, password, accountType }) {
  const res = await fetchWithTimeout(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
      account_type: accountType,
    }),
    timeout: 60000,
  });
  if (!res.ok) throw new Error(await parseError(res, 'Could not create your account.'));
  return res.json();
}

export async function login({ email, password, rememberMe }) {
  const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
    timeout: 60000,
  });
  if (!res.ok) throw new Error(await parseError(res, 'Invalid email or password.'));
  return res.json();
}

export async function forgotPassword({ email }) {
  const res = await fetchWithTimeout(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    timeout: 60000,
  });
  if (!res.ok) throw new Error(await parseError(res, 'Something went wrong. Please try again.'));
  return res.json();
}

export async function resetPassword({ token, newPassword }) {
  const res = await fetchWithTimeout(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
    timeout: 60000,
  });
  if (!res.ok) throw new Error(await parseError(res, 'This reset link is invalid or has expired.'));
  return res.json();
}

export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, label: '' };
  if (score <= 1) return { score: 1, label: 'Weak' };
  if (score <= 3) return { score: 2, label: 'Fair' };
  if (score === 4) return { score: 3, label: 'Good' };
  return { score: 4, label: 'Strong' };
}
