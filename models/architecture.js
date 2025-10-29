// models/Article.js
import mongoose from "mongoose";

const sousTitreSchema = new mongoose.Schema({
  sousTitre: { type: String, required: true },
  contenuSousTitre: { type: String, required: true },
  imageSousTitre: { type: String },

});

const architectureSchema = new mongoose.Schema({
  titres: {
    grandTitre: { type: String, required: true },
    contenuGrandTitre: { type: String, required: true },
    imageGrandTitre: { type: String },
    imageSecondaire1: { type: String }, // Nouvelle image secondaire 1
    imageSecondaire2: { type: String }, // Nouvelle image secondaire 2
    sousTitres: [sousTitreSchema],
  },
  auteur: { type: String },
  categorie: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  externalLink: { type: String },
  externalLinkTitle: { type: String },
  tags: [String],
}, { timestamps: true });

const Architecture = mongoose.model('Architecture', architectureSchema);

export default Architecture;
