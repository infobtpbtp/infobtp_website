
// import multer config items
import uploadPublicreportage from '../middlewares/multer-config_publicReportage.js';
import uploadEconomie from '../middlewares/multer-config_economir.js';
import uploadOpinion from '../middlewares/multer-config_opinions.js';
import uploadMiddleware from '../middlewares/multer-config_divers.js';
import uploadEnquetesExclusives from '../middlewares/multer-config_enquetesExclusives.js';
import uploadInstitutions from '../middlewares/multer-config_institutions.js';
import uploadInterviewMiniature from '../middlewares/videos/multer-config_interview_miniature.js';



// import controller fonction
import PublicReportageControler from '../Controllers/PublicReportageControler.js';
import EconomieControler from '../Controllers/EconomieControler.js'
import OpinionControler from '../Controllers/OpinionControler.js';
import DiversController from '../Controllers/DiversController.js';
import EnquetesExclusivesControler from '../Controllers/EnquetesExclusivesControler.js.js';
import InstitutionControler from '../Controllers/InstitutionControler.js';
import InterviewControler from '../Controllers/InterviewControler.js';
import SondagesControler from '../Controllers/SondagesControler.js'
import ContactsControler from '../Controllers/ContactsControler.js';
import SubscriberControler from '../Controllers/SubscriberControler.js';
import SearchControler from '../Controllers/SearchControler.js';
import uploadInterviews from "../middlewares/multer-config_interview.js";
import VideosJounalistiqueControler from "../Controllers/VideosJournalistiqueControler.js";
import uploadVideoJournalistique from "../middlewares/multer-config_videosJournalistiques.js";


const injectionRoutes = (api) => {
    // Public reportage 
    api.get('/publicreportage', PublicReportageControler.getAll);
    api.get('/publicreportage/search', PublicReportageControler.search);
    api.get('/publicreportage/:id', PublicReportageControler.getOne);
    api.post('/publicreportage', uploadPublicreportage, PublicReportageControler.createPublicReportage);
    api.put('/publicreportage/:id', uploadPublicreportage, PublicReportageControler.updateOne);  // Retirez les parenthèses
    api.delete('/publicreportage/:id', PublicReportageControler.deleteOne);

    // Economie
    api.get('/economie', EconomieControler.getAll);
    api.get('/economie/search', EconomieControler.search);
    api.get('/economie/:id', EconomieControler.getOne);
    api.post('/economie', uploadEconomie, EconomieControler.createEconomie);
    api.put('/economie/:id', EconomieControler.updateOne);  // Retirez les parenthèses
    api.delete('/economie/:id', EconomieControler.deleteOne);

    // Enquetes exclusives
    api.get('/enquetesExclusives', EnquetesExclusivesControler.getAll);
    api.get('/enquetesExclusives/search', EnquetesExclusivesControler.search);
    api.get('/enquetesExclusives/:id', EnquetesExclusivesControler.getOne);
    api.post('/enquetesExclusives', uploadEnquetesExclusives, EnquetesExclusivesControler.createEnquetesExclisives);
    api.put('/enquetesExclusives/:id', EnquetesExclusivesControler.updateOne);  // Retirez les parenthèses
    api.delete('/enquetesExclusives/:id', EnquetesExclusivesControler.deleteOne);

    // Institution
    api.get('/institutions', InstitutionControler.getAll);
    api.get('/institutions/search', InterviewControler.search);
    api.get('/institutions/:id', InstitutionControler.getOne);
    api.post('/institutions', uploadInstitutions, InstitutionControler.createInstitutions);
    api.put('/institution/:id', InstitutionControler.updateOne);  // Retirez les parenthèses
    api.delete('/institution/:id', InstitutionControler.deleteOne);

    // Opinions
    api.get('/opinions', OpinionControler.getAll);
    api.get('/opinions/search', OpinionControler.search);
    api.get('/opinions/:id', OpinionControler.getOne);
    api.post('/opinions', uploadOpinion, OpinionControler.createOpinion);
    api.put('/opinion/:id', OpinionControler.UpdateOne);  // Retirez les parenthèses
    api.delete('/opinion/:id', OpinionControler.deleteOne);

    // Interviews
    api.get('/interviews', InterviewControler.getAll);
    api.get('/interviews/search', InterviewControler.search);
    api.get('/interviews/:id', InterviewControler.getOne);
    api.post('/interviews', uploadInterviews, InterviewControler.createInterview);
    api.put('/interviews/:id', InterviewControler.updateOne);
    api.delete('/interviews/:id', InterviewControler.deleteOne);

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


    // Divers
    api.get('/divers', DiversController.getAll);
    api.get('/divers/search', DiversController.search);
    api.get('/divers/:id', DiversController.getOne);
    api.post('/divers', uploadMiddleware, DiversController.createDivers);
    api.put('/divers/:id', DiversController.updateOne);
    api.delete('/divers/:id', DiversController.deleteOne);

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
