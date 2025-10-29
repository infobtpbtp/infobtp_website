import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary-config.js";

// Configuration du stockage pour Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "infobtp/energiesMines",  // Dossier sur Cloudinary
    allowedFormats: ["jpg", "jpeg", "png"], // Formats autorisés
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }
});

const upload = multer({ storage: storage });

const uploadEnergiesMines = (req, res, next) => {
  upload.fields([
    { name: "imageGrandTitre", maxCount: 1 },
    { name: "imageSecondaire1", maxCount: 1 }, // Nouvelle image secondaire 1
    { name: "imageSecondaire2", maxCount: 1 }, // Nouvelle image secondaire 2
  ])(req, res, (err) => {
    if (err) {
      console.error("Erreur Multer:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Fichiers reçus:", req.files);
    next();
  });
};

export default uploadEnergiesMines;
