/**
 * Complaint lifecycle, shared by the API routes and every page that renders a
 * status, so the wording and the allowed transitions can never drift apart.
 */

export const COMPLAINT_STATUSES = [
  {
    value: "submitted",
    label: "Submitted",
    hi: "दर्ज",
    description: "Received, waiting for the Panchayat office to review it.",
    className: "bg-mist text-ink border-line",
  },
  {
    value: "acknowledged",
    label: "Acknowledged",
    hi: "स्वीकृत",
    description: "Seen by the office and accepted as a valid complaint.",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  {
    value: "in_progress",
    label: "In progress",
    hi: "कार्यवाही सुरू",
    description: "Work has started on resolving it.",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    value: "resolved",
    label: "Resolved",
    hi: "निराकरण",
    description: "The issue has been fixed.",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  {
    value: "rejected",
    label: "Rejected",
    hi: "अस्वीकृत",
    description: "Closed without action — the reason is recorded on the complaint.",
    className: "bg-red-50 text-red-800 border-red-200",
  },
];

export const STATUS_VALUES = COMPLAINT_STATUSES.map((status) => status.value);

export const statusMeta = (value) =>
  COMPLAINT_STATUSES.find((status) => status.value === value) || COMPLAINT_STATUSES[0];

/**
 * A villager may only edit or withdraw a complaint while the office has not
 * acted on it yet. Once staff acknowledge it, the record becomes part of the
 * office's workload and editing it underneath them would lose accountability.
 */
export const isEditableByOwner = (status) => status === "submitted";

/** Rejecting or resolving a complaint must carry an explanation for the villager. */
export const requiresNote = (status) => status === "rejected";
