// models/Article.js
import mongoose from "mongoose";

const sousTitreSchema = new mongoose.Schema({
  sousTitre: { type: String, required: true },
  contenuSousTitre: { type: String, required: true },
  imageSousTitre: { type: String },
});

const economieShema = new mongoose.Schema({
  titres: {
    grandTitre: { type: String, required: true },
    contenuGrandTitre: { type: String, required: true },
    imageGrandTitre: { type: String },
    sousTitres: [sousTitreSchema],
  },
  auteur: { type: String },
  categorie: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  tags: [String],
}, { timestamps: true });

const Economie = mongoose.model('Economie', economieShema);

export default Economie;
