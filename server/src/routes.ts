import { Router } from 'express';

const routes = Router();

// Routes

routes.get('/', (request, response) => {
    return response.status(200).json({everythingOk: true});
})

export default routes;