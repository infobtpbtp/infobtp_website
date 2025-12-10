import Architecture from "../models/architecture.js";

export default class ArchitectureControler {
    static async createArchitecture(req, res) {
        console.log("Requête reçue:", req.body);
        console.log("Fichiers reçus:", req.files);

        try {
            const {
                grandTitre, contenuGrandTitre,
                sousTitre1, contenuSousTitre1,
                sousTitre2, contenuSousTitre2,
                // sousTitre3, contenuSousTitre3,
                externalLink, externalLinkTitle,
                auteur, categorie, datePublication, tags
            } = req.body;

            // Extraction des URLs des images
            const imageGrandTitreUrl = req.files['imageGrandTitre'] ? req.files['imageGrandTitre'][0].path : null;
            const imageSecondaire1Url = req.files['imageSecondaire1'] ? req.files['imageSecondaire1'][0].path : null;
            const imageSecondaire2Url = req.files['imageSecondaire2'] ? req.files['imageSecondaire2'][0].path : null;
            // const imageSecondaire3Url = req.files['imageSecondaire3'] ? req.files['imageSecondaire3'][0].path : null;

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

            const architecture = new Architecture({
                titres: {
                    grandTitre,
                    contenuGrandTitre,
                    imageGrandTitre: imageGrandTitreUrl,
                    imageSecondaire1: imageSecondaire1Url, // Ajout de l'image secondaire 1
                    imageSecondaire2: imageSecondaire2Url, // Ajout de l'image secondaire 2
                    // imageSecondaire3: imageSecondaire3Url, // Ajout de l'image secondaire 3
                    sousTitres: [
                        { sousTitre: sousTitre1, contenuSousTitre: contenuSousTitre1, imageSousTitre: imageSousTitre1Url },
                        { sousTitre: sousTitre2, contenuSousTitre: contenuSousTitre2, imageSousTitre: imageSousTitre2Url },
                        // { sousTitre: sousTitre3, contenuSousTitre: contenuSousTitre3, imageSousTitre: imageSousTitre3Url },
                    ],
                },
                auteur,
                externalLink,
                externalLinkTitle,
                categorie,
                tags: processedTags,
                datePublication: datePublication || new Date()
            });

            let newItem = await architecture.save();
            res.status(201).json({ message: 'Article créé avec succès', architecture: newItem });
        } catch (error) {
            console.error("Erreur lors de la création de l'article:", error);
            res.status(400).json({ error: error.message });
        }
    }
    static getAll(req, res) {
        Architecture.find()
            .then(articles => res.status(200).json(articles))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des données" });
            });
    }

    static getOne(req, res) {
        const articleId = req.params.id;

        Architecture.findOne({ _id: articleId })
            .then(article => {
                if (!article) {
                    return res.status(404).json({ error: "Article non trouvé" });
                }
                res.status(200).json(article);
            })
            .catch(error => res.status(500).json({ error: "Erreur lors de la récupération de l'article" }));
    }


    static async updateOne(req, res) {
        try {
            const articleId = req.params.id;

            // Mise à jour des champs
            const updateData = {
                "titres.grandTitre": req.body.grandTitre,
                "titres.contenuGrandTitre": req.body.contenuGrandTitre,
                "titres.sousTitres": [
                    { sousTitre: req.body.sousTitre1, contenuSousTitre: req.body.contenuSousTitre1 },
                    { sousTitre: req.body.sousTitre2, contenuSousTitre: req.body.contenuSousTitre2 },
                    // { sousTitre: req.body.sousTitre3, contenuSousTitre: req.body.contenuSousTitre3 }
                ],
                auteur: req.body.auteur,
                categorie: req.body.categorie,
                tags: req.body.tags,
                datePublication: req.body.datePublication
            };

            // Si une nouvelle image est uploadée
            if (req.files?.imageGrandTitre?.[0]) {
                updateData["titres.imageGrandTitre"] = req.files.imageGrandTitre[0].path;
            }
            if (req.files?.imageSecondaire1?.[0]) {
                updateData["titres.imageSecondaire1"] = req.files.imageSecondaire1[0].path;
            }
            if (req.files?.imageSecondaire2?.[0]) {
                updateData["titres.imageSecondaire2"] = req.files.imageSecondaire2[0].path;
            }
            // if (req.files?.imageSecondaire3?.[0]) {
            //     updateData["titres.imageSecondaire3"] = req.files.imageSecondaire3[0].path;
            // }

            const updateArchitecture = await Architecture.findByIdAndUpdate(articleId, updateData, { new: true });

            if (!updateArchitecture) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article mis à jour avec succès', architecture: updateArchitecture });
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
            Architecture.find({
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
            const deletedArchitecture = await Architecture.findByIdAndDelete(articleId);
            if (!deletedArchitecture) {
                return res.status(404).json({ error: "Article non trouvé" });
            }
            res.status(200).json({  message: 'Article supprimé avec succès', id: articleId });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
        }
    }
}