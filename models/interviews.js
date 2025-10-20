import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  presenter: { type: String, required: true },
  category: { type: String, default: "Interviews" },
  videoUrl: { type: String, required: true },
  interviewsMiniature: {type: String},
  publicationDate: { type: Date, default: Date.now },
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;