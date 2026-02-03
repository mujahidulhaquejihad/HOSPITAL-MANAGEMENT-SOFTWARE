// Headers for API calls that require auth. Send JWT so server can verify identity and role.
export function roleHeaders() {
  try {
    const saved = localStorage.getItem('hospital_user');
    const user = saved ? JSON.parse(saved) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
    return headers;
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

// Admin-only routes (staff, doctors management) — same as roleHeaders; server enforces admin via JWT.
export function adminHeaders() {
  return roleHeaders();
}
