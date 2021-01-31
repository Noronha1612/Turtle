import truncate from '../utils/truncate'
import request from 'supertest';
import app from '../../src/app';
import ResponseCodes from '../../src/interfaces/responseCodes';
import generateToken from '../../src/utils/generateToken';
import createUser from '../utils/createUser';
import UserRepository from '../../src/models/repositories/UserRepository';

describe('recover_password', () => {
    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });



    it('should not send email if email not registered', async () => {
        const token = generateToken({
            email: 'teste@email.com'
        });

        const response = await request(app)
            .post('/recoverPassword')
            .send({
                token
        });

        expect(response.status).toBe(ResponseCodes.NOT_FOUND);
        expect(response.body.message).toBe('Email not found');
        expect(response.body.error).toBe(true);
    });



    it('should not send email if has an token active', async () => {
        await createUser({ email: 'teste@email.com' });

        const token = generateToken({
            email: 'teste@email.com'
        });

        await request(app)
            .post('/recoverPassword')
            .send({
                token
        });

        const userRepository = new UserRepository();

        const response = await request(app)
            .post('/recoverPassword')
            .send({
                token
        });

        expect(response.status).toBe(ResponseCodes.FORBIDDEN);
        expect(response.body.message).toBe('User has already an active token');
        expect(response.body.error).toBe(true);
    });
})