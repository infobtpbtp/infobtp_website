import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary-config.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "infobtp/publicReportage",
    allowedFormats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }
});

const upload = multer({ storage: storage });

const uploadPublicreportage = (req, res, next) => {
  upload.fields([
    { name: 'imageGrandTitre', maxCount: 1 },
    { name: 'imageSousTitre1', maxCount: 1 },
    { name: 'imageSousTitre2', maxCount: 1 },
    { name: 'imageSecondaire1', maxCount: 1 },
    { name: 'imageSecondaire2', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error("Erreur Multer:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Fichiers reçus:", req.files);
    next();
  });
};


export default uploadPublicreportage;