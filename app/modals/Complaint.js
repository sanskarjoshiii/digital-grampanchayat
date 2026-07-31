const { Schema, models, model } = require("mongoose");
import { STATUS_VALUES } from "@/app/utils/complaints";

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    title: { type: String },
  },
  { _id: false }
);

// Every status change is appended rather than overwritten, so the villager and
// the office can both see what happened to a complaint and when.
const StatusEventSchema = new Schema(
  {
    status: { type: String, enum: STATUS_VALUES, required: true },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    byEmail: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ComplaintSchema = new Schema(
  {
    // Human-readable reference the villager can quote at the office, e.g.
    // CMP-2026-000042. Assigned from an atomic counter, never reused.
    complaintId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    media: { type: [MediaSchema], default: [] },
    raisedBy: { type: String, required: true, index: true },
    status: { type: String, enum: STATUS_VALUES, default: "submitted", index: true },
    history: { type: [StatusEventSchema], default: [] },
  },
  { timestamps: true }
);

// The two queries this collection serves: one villager's own list, and the
// office dashboard filtered by status.
ComplaintSchema.index({ raisedBy: 1, createdAt: -1 });
ComplaintSchema.index({ status: 1, createdAt: -1 });

const Complaint = models.Complaint || model("Complaint", ComplaintSchema);
export default Complaint;
