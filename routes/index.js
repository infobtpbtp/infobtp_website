
// import multer config items
import uploadAchitecture from '../middlewares/multer-config_architecture.js';
import uploadMarchesIndustries from '../middlewares/multer-config_marchesIndustries.js';
import uploadEnergiesMines from '../middlewares/multer-config_energiesMines.js';
import uploadProduitsMateriaux from '../middlewares/multer-config_produitsMateriaux.js';
import uploadTravauxPublics from '../middlewares/multer-config_travauxPublics.js';
import uploadFoncier from '../middlewares/multer-config_foncier.js';
import uploadInterviewMiniature from '../middlewares/videos/multer-config_interview_miniature.js';



// import controller fonction
import ArchitectureControler from '../Controllers/ArchitectureControler.js';
import MarchesIndustriesControler from '../Controllers/MarchesIndustriesControler.js'
import EnergiesMinesControler from '../Controllers/EnergiesMinesControler.js';
import ProduitsMateriauxController from '../Controllers/ProduitsMateriauxController.js';
import TravauxPublicsControler from '../Controllers/TravauxPublicsControler.js';
import FoncierControler from '../Controllers/FoncierControler.js';
import InterviewControler from '../Controllers/InterviewControler.js';
import SondagesControler from '../Controllers/SondagesControler.js'
import ContactsControler from '../Controllers/ContactsControler.js';
import SubscriberControler from '../Controllers/SubscriberControler.js';
import SearchControler from '../Controllers/SearchControler.js';
import uploadInterviews from "../middlewares/multer-config_interview.js";
import VideosJounalistiqueControler from "../Controllers/VideosJournalistiqueControler.js";
import uploadVideoJournalistique from "../middlewares/multer-config_videosJournalistiques.js";


const injectionRoutes = (api) => {
    // Public reportage == Architecture => PublicReportageControler
    api.get('/architecture', ArchitectureControler.getAll);
    api.get('/architecture/search', ArchitectureControler.search);
    api.get('/architecture/:id', ArchitectureControler.getOne);
    api.post('/architecture', uploadAchitecture, ArchitectureControler.createArchitecture);
    api.put('/architecture/:id', uploadAchitecture, ArchitectureControler.updateOne);  // Retirez les parenthèses
    api.delete('/architecture/:id', ArchitectureControler.deleteOne);

    // Economie == Marche-Industrie => EconomieControler
    api.get('/marcheindustrie', MarchesIndustriesControler.getAll);
    api.get('/marcheindustrie/search', MarchesIndustriesControler.search);
    api.get('/marcheindustrie/:id', MarchesIndustriesControler.getOne);
    api.post('/marcheindustrie', uploadMarchesIndustries, MarchesIndustriesControler.createMarchesIndustries);
    api.put('/marcheindustrie/:id', MarchesIndustriesControler.updateOne);  // Retirez les parenthèses
    api.delete('/marcheindustrie/:id', MarchesIndustriesControler.deleteOne);

    // Enquetes exclusives == Travaux-publics => EnquetesExclusivesControler
    api.get('/travauxpublics', TravauxPublicsControler.getAll);
    api.get('/travauxpublics/search', TravauxPublicsControler.search);
    api.get('/travauxpublics/:id', TravauxPublicsControler.getOne);
    api.post('/travauxpublics', uploadTravauxPublics, TravauxPublicsControler.createTravauxPublics);
    api.put('/travauxpublics/:id', TravauxPublicsControler.updateOne);  // Retirez les parenthèses
    api.delete('/travauxpublics/:id', TravauxPublicsControler.deleteOne);

    // Institution == Foncier => InstitutionControler
    api.get('/foncier', FoncierControler.getAll);
    api.get('/foncier/search', FoncierControler.search);
    api.get('/foncier/:id', FoncierControler.getOne);
    api.post('/foncier', uploadFoncier, FoncierControler.createFoncier);
    api.put('/foncier/:id', FoncierControler.updateOne);  // Retirez les parenthèses
    api.delete('/foncier/:id', FoncierControler.deleteOne);

    // Opinions == Energies-Mines => OpinionControler
    api.get('/energiesmines', EnergiesMinesControler.getAll);
    api.get('/energiesmines/search', EnergiesMinesControler.search);
    api.get('/energiesmines/:id', EnergiesMinesControler.getOne);
    api.post('/energiesmines', uploadEnergiesMines, EnergiesMinesControler.createEnergiesMines);
    api.put('/energiesmines/:id', EnergiesMinesControler.UpdateOne);  // Retirez les parenthèses
    api.delete('/energiesmines/:id', EnergiesMinesControler.deleteOne);

    // Interviews
    api.get('/interviews', InterviewControler.getAll);
    api.get('/interviews/search', InterviewControler.search);
    api.get('/interviews/:id', InterviewControler.getOne);
    api.post('/interviews', uploadInterviews, InterviewControler.createInterview);
    api.put('/interviews/:id', InterviewControler.updateOne);
    api.delete('/interviews/:id', InterviewControler.deleteOne);

    // Videos
    api.get('/videosjournalistiques', VideosJounalistiqueControler.getAll);
    api.get('/videosjournalistiques/search', VideosJounalistiqueControler.search);
    api.get('/videosjournalistiques/:id', VideosJounalistiqueControler.getOne);
    api.post('/videosjournalistiques', uploadVideoJournalistique, VideosJounalistiqueControler.createVideoJour);
    api.put('/videosjournalistiques/:id', VideosJounalistiqueControler.updateOne);
    api.delete('/videosjournalistiques/:id', VideosJounalistiqueControler.deleteOne);

    // Sondages
    api.post('/sondages', SondagesControler.createSurvey);
    api.get('/sondages/search', SondagesControler.search);
    api.put('/sondages/:surveyId/:optionId', SondagesControler.handleVote);
    api.get('/sondages', SondagesControler.getAll);
    api.get('/sondages/:surveyId', SondagesControler.getOne);
    api.put('/sondages/:id', SondagesControler.updateOne);
    api.delete('/sondages/:id', SondagesControler.deleteOne);


    // Divers == Produits-Marteriaux => DiversController
    api.get('/produitsmateriaux', ProduitsMateriauxController.getAll);
    api.get('/produitsmateriaux/search', ProduitsMateriauxController.search);
    api.get('/produitsmateriaux/:id', ProduitsMateriauxController.getOne);
    api.post('/produitsmateriaux', uploadProduitsMateriaux, ProduitsMateriauxController.createProduitsMateriaux);
    api.put('/produitsmateriaux/:id', ProduitsMateriauxController.updateOne);
    api.delete('/produitsmateriaux/:id', ProduitsMateriauxController.deleteOne);

    // Contacts

    api.post('/contact', ContactsControler.createContact);
    api.get('/contact', ContactsControler.getAll);
    api.get('/contact/:id', ContactsControler.getOneContact);
    api.delete('/contact/:id', ContactsControler.deleteOneContact);

    // Abonnement
    api.post('/abonnement', SubscriberControler.createSubscription);
    api.get('/abonnement', SubscriberControler.getAll);
    api.get('/abonnement/:id', SubscriberControler.getOneSubscriber);
    api.delete('/abonnement/:id', SubscriberControler.deleteOneSubscriber);

    // Recherche
    api.get('/recherche/:q', SearchControler.rechercherElements);
};

export default injectionRoutes;
