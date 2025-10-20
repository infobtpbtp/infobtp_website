import Subscriber from "../models/suscriber.js";

export default class SubscriberControler {
    static async createSubscription(req, res) {
        const {email} = req.body;
        try {
            // Vérifier si l'email est déjà abonné
            const existingSubscriber = await Subscriber.findOne({ email: email });
            if (existingSubscriber) {
                return res.status(400).json({ message: "Cet email est déjà abonné à la newsletter." });
            }
    
            // Créer un nouvel abonné
            const newSubscriber = new Subscriber({ email });
            await newSubscriber.save();
    
            res.status(201).json({ message: "Abonnement à la newsletter réussi." });
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur." });
        }
    };

    // recuperation de tous les articles de public reportage
    static getAll(req, res) {
        Subscriber.find()
            .then(article => res.status(200).json(article))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error : "Erreur lors de la recuperation de données"})
            })
    }

    static getOneSubscriber = async (req, res) => {
        try {
            const subscriber = await Subscriber.findById(req.params.id);
            if (!subscriber) {
                return res.status(404).json({ message: "Abonné non trouvé" });
            }
            res.status(200).json(subscriber);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de l'abonné", error: error.message });
        }
    };

    static deleteOneSubscriber = async (req, res) => {
        try {
            const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
            if (!subscriber) {
                return res.status(404).json({ message: "Abonné non trouvé" });
            }
            res.status(200).json({ message: "Abonné supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de l'abonné", error: error.message });
        }
    };
}