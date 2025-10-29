import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary-config.js";

// Configuration du stockage pour Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "infobtp/imagesDivers",  // Dossier sur Cloudinary
    allowedFormats: ["jpg", "jpeg", "png"], // Formats autorisés
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  upload.fields([
    { name: "imageGrandTitre", maxCount: 1 },
    { name: "imageSecondaire1", maxCount: 1 }, // Nouvelle image optionnelle 1
    { name: "imageSecondaire2", maxCount: 1 }  // Nouvelle image optionnelle 2
  ])(req, res, (err) => {
    if (err) {
      console.error("Erreur Multer:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Fichiers reçus:", req.files);
    next();
  });
};

export default uploadMiddleware;


// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png'
// };

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images/imagesDivers/');
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension);
//     }
// });

// const uploadDivers= multer({ storage: storage }).single("imageGrandTitre");

// export default uploadDivers;
