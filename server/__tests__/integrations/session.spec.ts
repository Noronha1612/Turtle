import app from '../../src/app';
import request from 'supertest';
import createUser from '../utils/createUser';
import ResponseCodes from '../../src/interfaces/responseCodes';
import UserRepository from '../../src/models/repositories/UserRepository';
import truncate from '../utils/truncate';

describe('session', () => {

    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });

    

    it('should authenticate with valid data', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '306090120',
            confirm_password: '306090120'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.691@gmail.com',
                password: '306090120'
        });

        const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

        expect(response.body.token).not.toBeUndefined();
        expect(response.body.token).toMatch(tokenRegex);
        expect(response.status).toBe(ResponseCodes.CREATED);
    });



    it('should not authenticate without valid email', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '30609012',
            confirm_password: '306090120'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.6491@gmail.com',
                password: '306090123'
            });

        expect(response.body.token).toBeUndefined();
        expect(response.status).toBe(ResponseCodes.NOT_FOUND);
    });


    
    it('should not authenticate with invalid password', async () => {
        await createUser({
            user_id: 'g_noronhe-se',
            email: 'inc.691@gmail.com',
            password: '30609012',
            confirm_password: '30609012'
        });

        const response = await request(app)
            .post('/session')
            .send({
                email: 'inc.691@gmail.com',
                password: '306090123'
            });

        expect(response.body.token).toBeUndefined();
        expect(response.status).toBe(ResponseCodes.UNAUTHORIZED);
    });
});