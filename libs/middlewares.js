import cors from 'cors';
import express from 'express';

const injectionMiddlewares = (api) => {
    api.use(express.json());
    api.use(cors());
}
export default injectionMiddlewares;