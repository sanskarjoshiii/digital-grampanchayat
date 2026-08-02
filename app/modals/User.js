const { Schema, models, model } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  userType: {
    type: String,
    default: "user",
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  profile: {
    type: String,
  },
  phoneNo:{
    type:String
  },
  // Which Gram Panchayat this account belongs to. One village today, but
  // stored per user so a second Panchayat needs no migration.
  village: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },
});
const User = models.User || model("User", UserSchema);
export default User;
