import { Request, Response } from 'express';
import ResponseCodes from '../interfaces/responseCodes';
import { UserRegister } from '../interfaces/UserInterface';
import UserManager from '../models/managers/UserManager';
import jwt from 'jsonwebtoken';

const userManager = new UserManager();

export default class UserController {
    async createSession(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const {data: session, code, error, message} = await userManager.createSession(email, password);

            if ( !session ) return response.status(code).json({ error, message });

            return response.status(code).json({ error, token: session });
        } catch(err) {
            console.log(err);
            return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async createUser(request: Request, response: Response) {
        try {
            const data = request.body as UserRegister;

            const createResponse = await userManager.insertIntoDB(data);
            const { data: token } = await userManager.createSession(data.email, data.password);

            if(createResponse.error) return response.status(createResponse.code).json({ error: createResponse.error, message: createResponse.message });
            
            return response.status(createResponse.code).json({ error: createResponse.error, token });
        } catch(err) {
            console.log(err);
            return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Internal Server Error' });
        }
    }

    async recoverPassword(request: Request, response: Response) {
        const { token } = request.body;

        const { email } = jwt.decode(token) as { email: string };

        const codeResponse = await userManager.sendRecoverEmail(email);

        if ( codeResponse.error ) return response.status(codeResponse.code).json({ error: codeResponse.error, message: codeResponse.message });

        return response.status(codeResponse.code).json({ error: codeResponse.error, token: codeResponse.data });
    }
}