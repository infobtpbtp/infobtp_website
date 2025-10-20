
import Divers from "../models/divers.js";
import Economie from "../models/economie.js";
import EnquetesExclusives from "../models/enquetesExclusives.js";
import Opinion from "../models/opinions.js";
import PublicReportage from "../models/publicreportage.js";



export default class SearchControler {
    static async rechercherElements (req, res) {

        var {q} = req.query;

        try {
            // Liste de tous les modèles à interroger
            const models = [Divers, Economie, EnquetesExclusives, Opinion, PublicReportage];
            let searchResults = [];
    
            for (const model of models) {
                const results = await model.find({ $text: { $search: q } }).exec();
                searchResults = searchResults.concat(results);
            }
    
            res.json(searchResults);
        } catch (e) {
            console.error(e);
            res.status(500).send("Erreur interne du serveur");
        }
        // Utilisez 'query' pour rechercher dans votre base de données
        // Puis renvoyez les résultats
    };
}