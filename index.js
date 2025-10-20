import express from 'express';
import startServer from './libs/boots.js';
import path from 'path';
import injectionMiddlewares from './libs/middlewares.js';
import injectionRoutes from './routes/index.js';
import { connectDB } from './utils/bd.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuration CORS
const corsOptions = {
    origin: '*', // Permet toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Utiliser le middleware CORS
app.use(cors(corsOptions));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '/images')));

injectionMiddlewares(app);
injectionRoutes(app);

app.get('/', (req, res) => {
    res.send("Server is running");
});

// Connectez-vous à la base de données
connectDB();

// Démarrez le serveur (cela ne s'exécutera que dans les environnements non-Vercel)
startServer(app);

// Exportez l'application pour Vercel
export default app;