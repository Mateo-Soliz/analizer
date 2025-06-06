import mongoose from "mongoose";

const dataSetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
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

const DataSet =
  mongoose.models.DataSet || mongoose.model("DataSet", dataSetSchema);

export default DataSet;
