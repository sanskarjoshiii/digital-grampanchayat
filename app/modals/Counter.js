const { Schema, models, model } = require("mongoose");

// One document per counter key, incremented atomically. Used to hand out
// human-readable complaint numbers without two requests ever getting the same
// one — counting existing documents would race under concurrent submissions.
const CounterSchema = new Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

const Counter = models.Counter || model("Counter", CounterSchema);

/** Atomically reserve and return the next number for this key. */
export const nextSequence = async (key) => {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

export default Counter;
