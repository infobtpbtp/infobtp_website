import mongoose from "mongoose";

const Schema = mongoose.Schema;

const optionSchema = new Schema({
    text: { type: String, required: true },
    votes: { type: Number, required: true, default: 0 } // Compteur de votes pour chaque option
});

// Schéma pour le sondage
const surveySchema = new Schema({
    question: { type: String, required: true },
    options: [optionSchema], // Un tableau d'options de réponse
    totalVotes: { type: Number, default: 0 }, // Compteur total de votes pour la question
    publishedDate: { type: Date, default: Date.now } // Date de publication du sondage
});

// Création du modèle Mongoose pour le sondage
const Survey = mongoose.model('Survey', surveySchema);

export default Survey;
