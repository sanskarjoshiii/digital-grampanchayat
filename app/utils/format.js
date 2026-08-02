// Shared display formatters.

export const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// "12 Mar 2026"
export const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// "12 Mar 2026, 4:35 pm" — complaints need the time, not just the day.
export const fmtDateTime = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const yearOf = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date) ? "" : date.getFullYear();
};

// For <input type="date"> value binding
export const toInputDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

// The pending/ongoing/completed helpers that used to live here belonged to the
// Work module, which the scheme-wise fund records replaced. Complaint statuses
// have their own vocabulary in utils/complaints.js.
