import { Request, response, Response } from 'express';

export default class UserController {
    async createSession() {
        return response.status(200).json({ error: false });
    }
}