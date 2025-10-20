import VideoJournal from "../models/videosJournalistiques.js";
import PublicReportage from "../models/publicreportage.js";


export default class VideosJounalistiqueControler {

    static async createVideoJour(req, res) {
        // Logs pour vérifier les données reçues
        console.log("Requête reçue:", req.body);
        console.log("Fichiers reçus:", req.files);

        try {
            // Extraction des données du formulaire
            const { title, presenter, category, publicationDate } = req.body;

            // Récupérer les URL des fichiers uploadés (image et vidéo)
            //const interviewMiniatureUrl = req.files?.interviewsMiniature ? req.files.interviewsMiniature[0].path : null;
            const interviewMiniatureUrl = req.body.interviewsMiniature;
            //const videoUrl = req.files?.videoUrl ? req.files.videoUrl[0].path : null;
            const videoUrl = req.body.videoUrl;

            // Vérification de la réussite de l'upload de la miniature (image) et de la vidéo
            if (!interviewMiniatureUrl) {
                return res.status(400).json({ error: "L'upload de la miniature a échoué" });
            }
            if (!videoUrl) {
                return res.status(400).json({ error: "L'upload de la vidéo a échoué" });
            }

            // Création de l'objet Video journalistique avec les données du formulaire et les URLs des fichiers
            const videoJournal = new VideoJournal({
                title,
                presenter,
                category: category || "Video Journalistique", // Valeur par défaut si non fournie
                videoUrl,  // URL de la vidéo
                interviewsMiniature: interviewMiniatureUrl,  // URL de la miniature (image)
                publicationDate: publicationDate || new Date()  // Date de publication par défaut à la date actuelle
            });

            // Sauvegarde de l'interview en base de données
            const savedVideoJournal = await videoJournal.save();

            // Réponse à la création réussie de la video
            res.status(201).json({ message: 'Video journal créée avec succès', interview: savedVideoJournal });
        } catch (error) {
            // Gestion des erreurs
            console.error("Erreur lors de la création de de la video:", error);
            res.status(400).json({ error: error.message });
        }
    }

    static getAll(req, res) {
        VideoJournal.find()
            .then(videojournal => res.status(200).json(videojournal))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des videos journalistiques" });
            });
    }

    static getOne(req, res) {
        const videoJournalId = req.params.id;

        VideoJournal.findOne({ _id: videoJournalId })
            .then(videojournal => {
                if (!videojournal) {
                    return res.status(404).json({ error: "Interview non trouvée" });
                }
                res.status(200).json(videojournal);
            })
            .catch(error => res.status(500).json({ error: "Erreur lors de la récupération de la video" }));
    }
    static async updateOne(req, res) {
        try {
            const videoJournalId = req.params.id;

            const interviewMiniatureUrl = req.file ? req.file.path : null;

            const updateData = {
                title: req.body.title,
                presenter: req.body.presenter,
                category: req.body.category || "video jounalistique",
                videoUrl: req.body.videoUrl,
                publicationDate: req.body.publicationDate || new Date()
            };

            if (interviewMiniatureUrl) {
                updateData.interviewsMiniature = interviewMiniatureUrl;
            }

            const updatedVideoJournal = await VideoJournal.findByIdAndUpdate(videoJournalId, updateData, { new: true });

            if (!updatedVideoJournal) {
                return res.status(404).json({ error: "Interview non trouvée" });
            }

            res.status(200).json({ message: 'Interview mise à jour avec succès', interview: updatedVideoJournal });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static search(req, res) {
        try { // Recherche par mot-clé
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({ message: 'Le paramètre de recherche est requis' });
            }

            // Décodage de la requête
            const decodedQuery = decodeURIComponent(q);

            // Création d'une expression régulière pour la recherche
            const regex = new RegExp(decodedQuery, 'i');

            // Rechercher les articles dont les titres ou les sous-titres contiennent le terme de recherche
            PublicReportage.find({
                $or: [
                    { "title": regex }
                ]
            })
                .then(articles => {
                    if (articles.length === 0) {
                        return res.status(404).json({ message: "Aucun article trouvé" });
                    }
                    res.status(200).json(articles);
                })
                .catch(error => res.status(500).json({ error: "Erreur lors de la recherche des articles" }));
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la recherche des articles" });
        }
    }

    static async deleteOne(req, res) {
        try {
            const videoJournalId = req.params.id;
            const deletedvideoJournal = await VideoJournal.findByIdAndDelete(videoJournalId);

            if (!deletedvideoJournal) {
                return res.status(404).json({ error: "video journal  non trouvée" });
            }
            res.status(200).json({ message: 'video journal supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la suppression de la video journal" });
        }
    }


}