import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const chartGallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
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
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    enum: ["Circadiano", "diurno", "oscilación"],
  },
  likes: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
});

chartGallerySchema.plugin(toJSON);

const ChartGallery =
  mongoose.models.ChartGallery ||
  mongoose.model("ChartGallery", chartGallerySchema);

export default ChartGallery;
