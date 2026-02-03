/**
 * Convert 24h time string (e.g. "09:00", "14:30") to 12h with AM/PM.
 */
export function time24To12(t24) {
  if (!t24 || typeof t24 !== 'string') return '';
  const [h, m] = t24.split(':').map(Number);
  const hour = typeof h !== 'number' || isNaN(h) ? 0 : h;
  const min = typeof m !== 'number' || isNaN(m) ? 0 : m;
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
}

const RAW_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

/** Slots for dropdowns: { value: '09:00', label: '9:00 AM' } */
export const TIME_SLOTS_12H = RAW_SLOTS.map((value) => ({ value, label: time24To12(value) }));
