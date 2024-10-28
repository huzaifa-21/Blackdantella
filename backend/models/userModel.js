import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      default: {},
    },
    cartdata: { type: Array, default: [] },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { minimize: false }
);

const user = mongoose.models.user || mongoose.model("user", userModel);
export default user;
