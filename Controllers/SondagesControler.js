import Survey from "../models/sondage.js";
import PublicReportage from "../models/publicreportage.js";
import Sondage from "../models/sondage.js";

export default class SondagesContoler {
    static async createSurvey(req, res) {
        console.log("Le corps: ", req.body);
        const survey = new Survey(req.body);
        console.log(survey);
        survey.save()
            .then(() => res.status(201).json({ message: "Object enregistré avec succès", survey }))
            .catch(error => res.status(400).json({ error }));
    }

    static async handleVote(req, res) {
        try {
            const surveyId = req.params.surveyId;
            const optionId = req.params.optionId;

            const survey = await Survey.findById(surveyId);
            if (!survey) {
                return res.status(404).json({ message: "Sondage non trouvé" });
            }

            const option = survey.options.id(optionId);
            if (!option) {
                return res.status(404).json({ message: "Option non trouvée" });
            }

            option.votes += 1;
            survey.totalVotes += 1;

            await survey.save()
                .then((data) => res.status(200).json(data));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getAll(req, res) {
        Survey.find()
            .then(surveys => res.status(200).json(surveys))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: "Erreur lors de la récupération de données" });
            });
    }

    static getOne(req, res) {
        const { surveyId } = req.params;

        Survey.findOne({ _id: surveyId })
            .then(survey => res.status(200).json(survey))
            .catch(error => res.status(404).json({ error }));
    }

    static async updateOne(req, res) {
        try {
            const  surveyId  = req.params.id;
            const updatedSurvey = await Survey.findByIdAndUpdate(
                surveyId,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedSurvey) {
                return res.status(404).json({ message: "Sondage non trouvé" });
            }

            res.status(200).json({ message: "Sondage mis à jour avec succès", survey: updatedSurvey });
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
            Sondage.find({
                $or: [
                    { "question": regex },
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
            const surveyId  = req.params.id;

            const deletedSurvey = await Survey.findByIdAndDelete(surveyId);

            if (!deletedSurvey) {
                return res.status(404).json({ message: "Sondage non trouvé" });
            }

            res.status(200).json({ message: "Sondage supprimé avec succès" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
