export function currentSlot(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}
export function hourLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(date);
}
export function msUntilNextHour(date = new Date()) {
  const next = new Date(date);
  next.setMinutes(60, 0, 0);
  return Math.max(1000, next.getTime() - date.getTime());
}
export function pickFeatured(notes, slotIso) {
  if (!notes?.length) return null;
  let h = 0;
  for (let i = 0; i < slotIso.length; i++) h = (h * 31 + slotIso.charCodeAt(i)) >>> 0;
  return notes[h % notes.length];
}
