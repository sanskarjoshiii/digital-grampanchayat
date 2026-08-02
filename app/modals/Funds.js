import { model, models, Schema } from "mongoose";
import { SOURCE_VALUES } from "@/app/utils/funds";

const DocSchema = new Schema(
  {
    title: { type: String, trim: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

/**
 * One scheme's fund position for one financial year, matching the fields the
 * Meri Panchayat report publishes. Everything outside that set — work IDs,
 * contractors, addresses — is deliberately gone: this record is about money
 * received and spent, not about a single work.
 *
 * The three extras kept on top of the official fields are description,
 * progress and supporting documents, so the office can explain a figure and
 * back it with paperwork.
 */
const FundsSchema = new Schema(
  {
    // "2025-2026". Indexed because every page view filters on it.
    financialYear: { type: String, required: true, trim: true, index: true },
    source: { type: String, enum: SOURCE_VALUES, default: "goi", index: true },

    scheme: { type: String, required: true, trim: true, maxlength: 200 },
    component: { type: String, trim: true, maxlength: 200, default: "Center Schemes/ Grants" },

    expectedFund: { type: Number, default: 0, min: 0 },
    actualFundReceived: { type: Number, default: 0, min: 0 },
    previousYearBalance: { type: Number, default: 0, min: 0 },
    revertedFund: { type: Number, default: 0, min: 0 },
    actualExpenditure: { type: Number, default: 0, min: 0 },

    // Kept in addition to the official report.
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    documents: { type: [DocSchema], default: [] },

    email: { type: String },
  },
  { timestamps: true }
);

// The one query the villager-facing page makes.
FundsSchema.index({ financialYear: 1, source: 1 });

const Funds = models.Funds || model("Funds", FundsSchema);
export default Funds;
