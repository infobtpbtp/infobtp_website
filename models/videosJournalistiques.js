import mongoose from "mongoose";

const videoJOurnalistiqueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  presenter: { type: String, required: true },
  category: { type: String, default: "Video journalistique" },
  videoUrl: { type: String, required: true },
  interviewsMiniature: {type: String},
  publicationDate: { type: Date, default: Date.now },
});

const VideoJournal = mongoose.model('VideoJournalistique', videoJOurnalistiqueSchema);
export default VideoJournal;