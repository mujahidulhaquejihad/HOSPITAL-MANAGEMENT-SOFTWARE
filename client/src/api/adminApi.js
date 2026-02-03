// Headers for API calls that require role. Send x-user-role so server can enforce.
export function roleHeaders() {
  try {
    const saved = localStorage.getItem('hospital_user');
    const user = saved ? JSON.parse(saved) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (user?.role) headers['x-user-role'] = user.role;
    return headers;
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

// Admin-only routes (staff, doctors management)
export function adminHeaders() {
  try {
    const saved = localStorage.getItem('hospital_user');
    const user = saved ? JSON.parse(saved) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (user?.role === 'admin') headers['x-user-role'] = 'admin';
    return headers;
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}
