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

export const STATUSES = ["pending", "ongoing", "completed"];

export const statusLabel = (status, en = true) => {
  const map = {
    pending: en ? "Pending" : "प्रलंबित",
    ongoing: en ? "Ongoing" : "प्रगतिपथावर",
    completed: en ? "Completed" : "पूर्ण",
  };
  return map[status] || status;
};

// Tailwind classes for the status badge
export const statusClasses = (status) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    ongoing: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[status] || "bg-mist text-muted border-line";
};
