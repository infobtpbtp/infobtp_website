import multer from "multer";
import cloudinary from "../utils/cloudinary-config.js";
import { Readable } from 'stream';

// Configurer multer pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

const uploadInterviews = (req, res, next) => {
  upload.fields([
    { name: "interviewsMiniature", maxCount: 1 },
    //{ name: "videoUrl", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("Erreur Multer:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      // Fonction pour uploader un buffer vers Cloudinary
      const uploadBuffer = async (buffer, options) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          Readable.from(buffer).pipe(stream);
        });
      };

      // Uploader l'image
      if (req.files.interviewsMiniature) {
        const imageResult = await uploadBuffer(req.files.interviewsMiniature[0].buffer, {
          folder: "infobtp/interview/images",
          resource_type: "image"
        });
        req.body.interviewsMiniature = imageResult.secure_url;
      }

      // Uploader la vidéo
      if (req.files.videoUrl) {
        const videoResult = await uploadBuffer(req.files.videoUrl[0].buffer, {
          folder: "infobtp/interview/videos",
          resource_type: "video"
        });
        req.body.videoUrl = videoResult.secure_url;
      }

      next();
    } catch (error) {
      console.error("Erreur lors de l'upload sur Cloudinary:", error);
      res.status(500).json({ error: "Erreur lors de l'upload des fichiers" });
    }
  });
};

export default uploadInterviews;