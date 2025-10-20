// ./utils/bd.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Définir l'URI de connexion ici (remplacez avec votre URI réel)

dotenv.config();

const MONGODB_URI = "mongodb+srv://ypn:GlikeGod%40.1@cluster0.ttabgua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const MONGODB_URI = process.env.MONGODB_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
