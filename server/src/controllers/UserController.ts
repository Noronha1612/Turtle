import { Request, response, Response } from 'express';
import ResponseCodes from '../interfaces/responseCodes';
import UserManager from '../models/managers/UserManager';

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
}