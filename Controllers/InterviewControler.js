import Interview from "../models/interviews.js";
import PublicReportage from "../models/publicreportage.js";

export default class InterviewControler {
    static async createInterview(req, res) {
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

            if (!interviewMiniatureUrl) {
                return res.status(400).json({ error: "L'upload de la miniature a échoué" });
            }
            if (!videoUrl) {
                return res.status(400).json({ error: "L'upload de la vidéo a échoué" });
            }

            // Création de l'objet Interview avec les données du formulaire et les URLs des fichiers
            const interview = new Interview({
                title,
                presenter,
                category: category || "Interviews",
                videoUrl,  // URL de la vidéo
                interviewsMiniature: interviewMiniatureUrl,  // URL de la miniature (image)
                publicationDate: publicationDate || new Date()  // Date de publication par défaut à la date actuelle
            });

            // Sauvegarde de l'interview en base de données
            const savedInterview = await interview.save();

            // Réponse à la création réussie de l'interview
            res.status(201).json({ message: 'Interview créée avec succès', interview: savedInterview });
        } catch (error) {
            // Gestion des erreurs
            console.error("Erreur lors de la création de l'interview:", error);
            res.status(400).json({ error: error.message });
        }
    }

    static getAll(req, res) {
        Interview.find()
            .then(interviews => res.status(200).json(interviews))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des interviews" });
            });
    }

    static getOne(req, res) {
        const interviewId = req.params.id;

        Interview.findOne({ _id: interviewId })
            .then(interview => {
                if (!interview) {
                    return res.status(404).json({ error: "Interview non trouvée" });
                }
                res.status(200).json(interview);
            })
            .catch(error => res.status(500).json({ error: "Erreur lors de la récupération de l'interview" }));
    }

    static async updateOne(req, res) {
        try {
            const interviewId = req.params.id;

            const interviewMiniatureUrl = req.file ? req.file.path : null;

            const updateData = {
                title: req.body.title,
                presenter: req.body.presenter,
                category: req.body.category || "Interviews",
                videoUrl: req.body.videoUrl,
                publicationDate: req.body.publicationDate || new Date()
            };

            if (interviewMiniatureUrl) {
                updateData.interviewsMiniature = interviewMiniatureUrl;
            }

            const updatedInterview = await Interview.findByIdAndUpdate(interviewId, updateData, { new: true });

            if (!updatedInterview) {
                return res.status(404).json({ error: "Interview non trouvée" });
            }

            res.status(200).json({ message: 'Interview mise à jour avec succès', interview: updatedInterview });
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
            Interview.find({
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
            const interviewId = req.params.id;
            const deletedInterview = await Interview.findByIdAndDelete(interviewId);

            if (!deletedInterview) {
                return res.status(404).json({ error: "Interview non trouvée" });
            }

            res.status(200).json({ message: 'Interview supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la suppression de l'interview" });
        }
    }
}
