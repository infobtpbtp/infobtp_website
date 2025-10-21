import PoduitsMateriaux from "../models/produitsMateriaux.js";
import PublicReportage from "../models/publicreportage.js";

export default class PoduitsMateriauxController {
    static async createProduitsMateriaux(req, res) {
        console.log("Requête reçue:", req.body);
        console.log("Fichier reçu:", req.file);
    
        try {
            // Extraction des données du formulaire
            const { 
                grandTitre, contenuGrandTitre,
                sousTitre1, contenuSousTitre1,
                sousTitre2, contenuSousTitre2,
                externalLink, externalLinkTitle,
                auteur, categorie, datePublication, tags
            } = req.body;
    
            // URL de l'image après upload sur Cloudinary
            const imageUrl = req.file ? req.file.path : null;
    
            if (!imageUrl) {
                return res.status(400).json({ error: "L'upload de l'image a échoué" });
            }

            let processedTags;
            if (Array.isArray(tags)) {
                processedTags = tags;
            } else if (typeof tags === 'string') {
                processedTags = tags.split(',').map(tag => tag.trim());

            } else {
                processedTags = []
            }
    
            const produitsMateriaux = new Divers({
                titres: {
                    grandTitre, 
                    contenuGrandTitre, 
                    imageGrandTitre: imageUrl,
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
    
            let newItem = await produitsMateriaux.save();
            res.status(201).json({ message: 'Article créé avec succès', produitsMateriaux: newItem });
        } catch (error) {
            console.error("Erreur lors de la création de l'article:", error);
            res.status(400).json({ error: error.message });
        }
    }

    static getAll(req, res) {
        PoduitsMateriaux.find()
            .then(articles => res.status(200).json(articles))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération des données" });
            });
    }

    static getOne(req, res) {
        const articleId = req.params.id;

        PoduitsMateriaux.findOne({ _id: articleId })
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
                    { sousTitre: req.body.sousTitre2, contenuSousTitre: req.body.contenuSousTitre2 }
                ],
                auteur: req.body.auteur,
                categorie: req.body.categorie,
                tags: req.body.tags,
                datePublication: req.body.datePublication
            };

            // Si une nouvelle image est uploadée
            if (req.file) {
                updateData["titres.imageGrandTitre"] = req.file.path;
            }

            const updatePoduitsMateriaux = await PoduitsMateriaux.findByIdAndUpdate(articleId, updateData, { new: true });

            if (!updatePoduitsMateriaux) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article mis à jour avec succès', produitsMateriaux: updatePoduitsMateriaux });
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

            const regex = new RegExp(decodedQuery, 'i');

            PoduitsMateriaux.find({
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
            const deletedProduitsMateriaux = await PoduitsMateriaux.findByIdAndDelete(articleId);

            if (!deletedProduitsMateriaux) {
                return res.status(404).json({ error: "Article non trouvé" });
            }

            res.status(200).json({ message: 'Article supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
        }
    }
}
