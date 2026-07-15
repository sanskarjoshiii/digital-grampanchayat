import { model, models, Schema } from "mongoose";

const DocSchema = new Schema(
  {
    title: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const MediaSchema = new Schema(
  {
    url: { type: String },
    type: { type: String, enum: ["image", "video"], default: "image" },
    title: { type: String },
  },
  { _id: false }
);

const WorkSchema = new Schema({
  // Required keys
  workId: { type: String, required: true, unique: true, trim: true },
  schemeName: { type: String, required: true, trim: true },

  // Required details
  address: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  // Core details
  workName: { type: String, trim: true },
  sanctionedAmount: { type: Number, default: 0 },
  receivedAmount: { type: Number, default: 0 },
  startDate: { type: Date },
  expectedCompletionDate: { type: Date },

  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },

  // Only meaningful when ongoing / completed
  amountUtilized: { type: Number, default: 0 },
  remainingBalance: { type: Number, default: 0 },

  // Optional
  contractor: { type: String, trim: true },
  engineer: { type: String, trim: true },
  // Sarpanch during whose tenure the work was carried out (admin fills; optional)
  sarpanch: { type: String, trim: true },

  progress: { type: Number, default: 0, min: 0, max: 100 },
  documents: { type: [DocSchema], default: [] },

  // Only when completed
  finalCompletionDate: { type: Date },
  resultMedia: { type: [MediaSchema], default: [] },

  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Work = models.Work || model("Work", WorkSchema);
export default Work;
