// import models
import EnergiesMines from "../models/energiesMines.js";
import PublicReportage from "../models/publicreportage.js";

export default class OpinionControler {
    static async createEnergiesMines (req, res) {
        console.log("Requête reçue:", req.body);
        console.log("Fichiers reçus:", req.files);

        try {
            // Extraction des données du formulaire
            const { 
                grandTitre, contenuGrandTitre,
                sousTitre1, contenuSousTitre1,
                sousTitre2, contenuSousTitre2,
                externalLink, externalLinkTitle,
                auteur, categorie, datePublication, tags
            } = req.body;
    
            // URLs des images après upload sur Cloudinary
            const imageGrandTitreUrl = req.files?.imageGrandTitre?.[0]?.path || null;
            const imageSecondaire1Url = req.files?.imageSecondaire1?.[0]?.path || null;
            const imageSecondaire2Url = req.files?.imageSecondaire2?.[0]?.path || null;
    
            if (!imageGrandTitreUrl) {
                return res.status(400).json({ error: "L'upload de l'image principale a échoué" });
            }

            let processedTags;
            if (Array.isArray(tags)) {
                processedTags = tags;
            } else if (typeof tags === 'string') {
                processedTags = tags.split(',').map(tag => tag.trim());
            } else {
                processedTags = [];
            }
    
            const energiesMines = new EnergiesMines({
                titres: {
                    grandTitre, 
                    contenuGrandTitre, 
                    imageGrandTitre: imageGrandTitreUrl,
                    imageSecondaire1: imageSecondaire1Url, // Ajout de l'image secondaire 1
                    imageSecondaire2: imageSecondaire2Url, // Ajout de l'image secondaire 2
                    sousTitres: [
                        { sousTitre: sousTitre1, contenuSousTitre: contenuSousTitre1 },
                        { sousTitre: sousTitre2, contenuSousTitre: contenuSousTitre2 },
                    ],
                },
                auteur,
                externalLink, externalLinkTitle,
                categorie, 
                tags: processedTags,
                datePublication: datePublication || new Date()
            });
    
            let newItem = await energiesMines.save();
            res.status(201).json({ message: 'Article créé avec succès', divers: newItem });
        } catch (error) {
            console.error("Erreur lors de la création de l'article:", error);
            res.status(400).json({ error: error.message });
        }
    }

    static getAll(req, res) {
        EnergiesMines.find()
            .then(articles => res.status(200).json(articles))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des données" });
            });
    }

    static getOne(req, res) {
        const articleId = req.params.id;

        EnergiesMines.findOne({ _id: articleId })
            .then(article => {
                if (!article) {
                    return res.status(404).json({ error: "Article non trouvé" });
                }
                res.status(200).json(article);
            })
            .catch(error => res.status(500).json({ error: "Erreur lors de la récupération de l'article" }));
    }

    static async UpdateOne(req, res) {
        try {
            const articleId = req.params.id;

            // Mise à jour des champs
            const updateData = {
                "titres.grandTitre": req.body.grandTitre,
                "titres.contenuGrandTitre": req.body.contenuGrandTitre,
                "titres.sousTitres": [
                    { sousTitre: req.body.sousTitre1, contenuSousTitre: req.body.contenuSousTitre1 },
                    { sousTitre: req.body.sousTitre2, contenuSousTitre: req.body.contenuSousTitre2 }
                ],
                auteur: req.body.auteur,
                categorie: req.body.categorie,
                tags: req.body.tags,
                datePublication: req.body.datePublication
            };

            // Si de nouvelles images sont uploadées
            if (req.files?.imageGrandTitre?.[0]) {
                updateData["titres.imageGrandTitre"] = req.files.imageGrandTitre[0].path;
            }
            if (req.files?.imageSecondaire1?.[0]) {
                updateData["titres.imageSecondaire1"] = req.files.imageSecondaire1[0].path;
            }
            if (req.files?.imageSecondaire2?.[0]) {
                updateData["titres.imageSecondaire2"] = req.files.imageSecondaire2[0].path;
            }

            const updatedEnergiesMines = await EnergiesMines.findByIdAndUpdate(articleId, updateData, { new: true });

            if (!updatedEnergiesMines) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article mis à jour avec succès', energiesMines: updatedEnergiesMines });
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
            EnergiesMines.find({
                $or: [
                    { "titres.grandTitre": regex },
                    { "titres.sousTitres.sousTitre": regex }
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
            const articleId = req.params.id;
            const deletedEnergiesMines = await EnergiesMines.findByIdAndDelete(articleId);

            if (!deletedEnergiesMines) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
        }
    }
}