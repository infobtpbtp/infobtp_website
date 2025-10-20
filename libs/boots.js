const startServer = (api) => {
    // Ne démarrez le serveur que si l'environnement n'est pas Vercel
    if (process.env.VERCEL_ENV !== 'production') {
        const port = process.env.PORT || 5500;
        api.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default startServer;