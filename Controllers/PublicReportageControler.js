import PublicReportage from "../models/publicreportage.js";

export default class PublicReportageControler {
    static async createPublicReportage(req, res) {
    console.log("Requête reçue:", req.body);
    console.log("Fichiers reçus:", req.files);

        try {
            const {
                grandTitre, contenuGrandTitre,
                sousTitre1, contenuSousTitre1,
                sousTitre2, contenuSousTitre2,
                externalLink, externalLinkTitle,
                auteur, categorie, datePublication, tags
            } = req.body;

            // Extraction des URLs des images (les nouvelles images secondaires sont optionnelles)
            const imageGrandTitreUrl = req.files && req.files['imageGrandTitre'] ? req.files['imageGrandTitre'][0].path : null;
            const imageSousTitre1Url = req.files && req.files['imageSousTitre1'] ? req.files['imageSousTitre1'][0].path : null;
            const imageSousTitre2Url = req.files && req.files['imageSousTitre2'] ? req.files['imageSousTitre2'][0].path : null;
            const imageSecondaire1Url = req.files && req.files['imageSecondaire1'] ? req.files['imageSecondaire1'][0].path : null;
            const imageSecondaire2Url = req.files && req.files['imageSecondaire2'] ? req.files['imageSecondaire2'][0].path : null;

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

            const publicreportage = new PublicReportage({
                titres: {
                    grandTitre,
                    contenuGrandTitre,
                    imageGrandTitre: imageGrandTitreUrl,
                    imageSecondaire1: imageSecondaire1Url,
                    imageSecondaire2: imageSecondaire2Url,
                    sousTitres: [
                        { sousTitre: sousTitre1, contenuSousTitre: contenuSousTitre1, imageSousTitre: imageSousTitre1Url },
                        { sousTitre: sousTitre2, contenuSousTitre: contenuSousTitre2, imageSousTitre: imageSousTitre2Url },
                        // { sousTitre: sousTitre1, contenuSousTitre: contenuSousTitre1, imageSecondaire1: imageSecondaire1Url },
                        // { sousTitre: sousTitre2, contenuSousTitre: contenuSousTitre2, imageSecondaire2: imageSecondaire2Url },
                    ],
                },
                auteur,
                externalLink,
                externalLinkTitle,
                categorie,
                tags: processedTags,
                datePublication: datePublication || new Date()
            });

            let newItem = await publicreportage.save();
            res.status(201).json({ message: 'Article créé avec succès', publicReportage: newItem });
        } catch (error) {
            console.error("Erreur lors de la création de l'article:", error);
            res.status(400).json({ error: error.message });
        }
    }
    static getAll(req, res) {
        PublicReportage.find()
            .then(articles => res.status(200).json(articles))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des données" });
            });
    }

    static getOne(req, res) {
        const articleId = req.params.id;

        PublicReportage.findOne({ _id: articleId })
            .then(article => {
                if (!article) {
                    return res.status(404).json({ error: "Article non trouvé" });
                }
                res.status(200).json(article);
            })
            .catch(error => res.status(500).json({ error: "Erreur lors de la récupération de l'article" }));
    }

    static async updateOne(req, res) {
    console.log("Requête reçue:", req.body);
    console.log("Fichiers reçus:", req.files);

        try {
            const articleId = req.params.id;

            // Extraction des données du formulaire
            const {
                grandTitre, contenuGrandTitre,
                sousTitre1, contenuSousTitre1,
                sousTitre2, contenuSousTitre2,
                auteur, categorie, datePublication, tags
            } = req.body;

            // Traitement des tags
            let processedTags;
            if (Array.isArray(tags)) {
                processedTags = tags;
            } else if (typeof tags === 'string') {
                processedTags = tags.split(',').map(tag => tag.trim());
            } else {
                processedTags = [];
            }

            // Préparation des données de mise à jour
            const updateData = {
                titres: {
                    grandTitre,
                    contenuGrandTitre,
                    sousTitres: [
                        { sousTitre: sousTitre1, contenuSousTitre: contenuSousTitre1 },
                        { sousTitre: sousTitre2, contenuSousTitre: contenuSousTitre2 },
                    ],
                },
                auteur,
                categorie,
                tags: processedTags,
                datePublication: datePublication || new Date()
            };

            // Si de nouvelles images sont uploadées
            if (req.files) {
                if (req.files['imageGrandTitre']) updateData.titres.imageGrandTitre = req.files['imageGrandTitre'][0].path;
                if (req.files['imageSecondaire1']) updateData.titres.imageSecondaire1 = req.files['imageSecondaire1'][0].path;
                if (req.files['imageSecondaire2']) updateData.titres.imageSecondaire2 = req.files['imageSecondaire2'][0].path;
                if (req.files['imageSousTitre1']) updateData.titres.sousTitres[0].imageSousTitre = req.files['imageSousTitre1'][0].path;
                if (req.files['imageSousTitre2']) updateData.titres.sousTitres[1].imageSousTitre = req.files['imageSousTitre2'][0].path;
            }

            const updatedPublicReportage = await PublicReportage.findByIdAndUpdate(
                articleId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedPublicReportage) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article mis à jour avec succès', publicReportage: updatedPublicReportage });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'article:", error);
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
            const deletedPublicReportage = await PublicReportage.findByIdAndDelete(articleId);
            if (!deletedPublicReportage) {
                return res.status(404).json({ error: "Article non trouvé" });
            }
            res.status(200).json({  message: 'Article supprimé avec succès', id: articleId });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
        }
    }
}