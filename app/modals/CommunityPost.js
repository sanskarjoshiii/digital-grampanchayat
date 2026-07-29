const { Schema, models, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    email: { type: String, required: true },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    title: { type: String },
  },
  { _id: false }
);

// Options keep their own _id so that an admin editing the post can rename or
// reorder choices without discarding the votes already cast on them.
const PollOptionSchema = new Schema({
  text: { type: String, required: true, trim: true, maxlength: 120 },
  votes: { type: [String], default: [] },
});

const PollSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 200 },
    // Single choice by default; multiple choice lets one villager pick several.
    allowMultiple: { type: Boolean, default: false },
    options: { type: [PollOptionSchema], default: [] },
  },
  { _id: false }
);

const CommunityPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    caption: { type: String, trim: true, maxlength: 3000, default: "" },
    media: { type: [MediaSchema], default: [] },
    poll: { type: PollSchema, default: null },
    authorEmail: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    likes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

const CommunityPost =
  models.CommunityPost || model("CommunityPost", CommunityPostSchema);
export default CommunityPost;
