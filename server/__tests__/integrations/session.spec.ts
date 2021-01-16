import db from '../../src/database/connection';
import app from '../../src/app';
import request from 'supertest';
import createUser from '../utils/createUser';
import { config } from 'dotenv';
import ResponseCodes from '../../src/interfaces/responseCodes';
import UserRepository from '../../src/models/repositories/UserRepository';

config();

describe('users', () => {
    beforeEach(async () => {
        await db.migrate.latest();
    });

    afterEach(async () => {
        await db.migrate.rollback();
    });



    it('should authenticate with valid data', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '306090120'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.691@gmail.com',
                password: '306090120'
            });

        expect(response.status).toBe(ResponseCodes.OK);
        expect(response.body.token).not.toBeUndefined();
    });



    it('should not authenticate without valid email', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '30609012'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.6491@gmail.com',
                password: '306090123'
            });

        expect(response.status).toBe(ResponseCodes.NOT_FOUND);
        expect(response.body.token).toBeUndefined();
    });


    
    it('should not authenticate with invalid password', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '30609012'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.691@gmail.com',
                password: '306090123'
            });

        expect(response.status).toBe(ResponseCodes.UNAUTHORIZED);
        expect(response.body.token).toBeUndefined();
    });
});