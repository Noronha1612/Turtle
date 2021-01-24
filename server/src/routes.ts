import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import UserController from './controllers/UserController';

const userController = new UserController();

const routes = Router();

// Routes

routes.post('/session', userController.createSession);
routes.post('/users', userController.createUser);
routes.post('/recoverPassword', userController.recoverPassword);

export default routes;