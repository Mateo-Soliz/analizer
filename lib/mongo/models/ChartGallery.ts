import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const chartGallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DataSet",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["bar", "line", "area", "scatter", "pie"],
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: true,
    enum: ["Circadiano", "diurno", "oscilación"],
  },
  likes: {
    type: Number,
    required: false,
  },
  views: {
    type: Number,
    required: false,
  },
  isPublic: {
    type: Boolean,
    required: false,
  },
});

chartGallerySchema.plugin(toJSON);

const ChartGallery =
  mongoose.models.ChartGallery ||
  mongoose.model("ChartGallery", chartGallerySchema);

export default ChartGallery;
