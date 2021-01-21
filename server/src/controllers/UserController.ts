import { Request, Response } from 'express';
import ResponseCodes from '../interfaces/responseCodes';
import { UserRegister } from '../interfaces/UserInterface';
import UserManager from '../models/managers/UserManager';
import User from '../models/schemas/User';

export default class UserController {
    async createSession(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const {data: session, code, error} = await UserManager.createSession(email, password);

            if ( !session ) return response.status(code).json({ error });

            return response.status(code).json({ error, token: session });
        } catch(err) {
            console.log(err);
            return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async createUser(request: Request, response: Response) {
        try {
            const data = request.body as UserRegister;

            const createResponse = await UserManager.insertIntoDB(data);
            const { data: token } = await UserManager.createSession(data.email, data.password);
            
            return response.status(ResponseCodes.CREATED).json({ error: false, token });
        } catch(err) {
            console.log(err);
            return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }
}