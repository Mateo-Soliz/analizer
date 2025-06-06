import mongoose from "mongoose";

import toJSON from "./plugins/toJSON";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Date,
      required: false,
    },
    uid: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    _createdAt: {
      type: Date,
      default: Date.now,
    },
    _updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "_createdAt",
      updatedAt: "_updatedAt",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.plugin(toJSON);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
