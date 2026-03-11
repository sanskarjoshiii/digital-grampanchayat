import { model, models, Schema } from "mongoose";
const FundsSchema = new Schema({
  scheme: {
    type: String,
  },
  component: {
    type: String,
  },
  expected_funds: {
    type: Number,
  },
  actual_funds: {
    type: Number,
  },
  reverted_funds: {
    type: Number,
  },
  actual_expenditure: {
    type: Number,
  },
  date: {
    type: Date,
    default:new Date()
  },
  email: {
    type: String,
  },
});
const Funds = models.Funds || model("Funds",FundsSchema);
export default Funds