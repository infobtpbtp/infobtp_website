import Contact from "../models/contact.js";
import contact from "../models/contact.js";

export default class ContactsControler {
    static async createContact(req, res) {
        console.log(req.body)
        try {
            const { name, email, subject, message } = req.body;

            const newContact = await Contact.create({ name, email, subject, message });
            console.log(newContact)
            res.status(201).json({ message: 'Message envoyé avec succès', data: newContact });
        } catch (error) {
            res.status(400).json({ message: 'Erreur lors de l\'envoi du message', error });
        }
    }

    static getAll(req, res) {
        Contact.find()
            .then(contact => res.status(200).json(contact))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error : "Erreur lors de la recuperation de données"})
            })
    }
    static getOneContact = async (req, res) => {
        try {
            const contact = await Contact.findById(req.params.id);
            if (!contact) {
                return res.status(404).json({ message: "Contact non trouvé" });
            }
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du contact", error: error.message });
        }
    };

    static deleteOneContact = async (req, res) => {
        try {
            const contact = await Contact.findByIdAndDelete(req.params.id);
            if (!contact) {
                return res.status(404).json({ message: "Contact non trouvé" });
            }
            res.status(200).json({ message: "Contact supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du contact", error: error.message });
        }
    };
}