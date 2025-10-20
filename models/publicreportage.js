// models/Article.js
import mongoose from "mongoose";

const sousTitreSchema = new mongoose.Schema({
  sousTitre: { type: String, required: true },
  contenuSousTitre: { type: String, required: true },
  imageSousTitre: { type: String },

});

const publicReportageSchema = new mongoose.Schema({
  titres: {
    grandTitre: { type: String, required: true },
    contenuGrandTitre: { type: String, required: true },
    imageGrandTitre: { type: String },
    sousTitres: [sousTitreSchema],
  },
  auteur: { type: String },
  categorie: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  externalLink: { type: String },
  externalLinkTitle: { type: String },
  tags: [String],
}, { timestamps: true });

const PublicReportage = mongoose.model('PublicReportage', publicReportageSchema);

export default PublicReportage;
