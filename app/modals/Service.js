import { model, models, Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    workingHours: { type: String, default: "" },
    image: { type: String, default: "" },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Service = models.Service || model("Service", ServiceSchema);
export default Service;
