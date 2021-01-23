import truncate from "../utils/truncate";
import request from 'supertest';
import app from "../../src/app";
import ResponseCodes from "../../src/interfaces/responseCodes";
import createUser from "../utils/createUser";

describe('register user', () => {

    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });



    it('should create an user if passed valid datas', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@email.com',
                password: 'senhaSecreta',
                confirm_password: 'senhaSecreta',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

        expect(response.body.token).toMatch(tokenRegex);
        expect(response.status).toBe(ResponseCodes.CREATED);
    });



    it('should not create an user if passed invalid email', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@.com',
                password: 'senhaSecreta',
                confirm_password: 'senhaSecreta',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        expect(response.status).toBe(ResponseCodes.BAD_REQUEST);
        expect(response.body.message).toBe('Invalid email');
        expect(response.body.error).toBe(true);
    });



    it('should not create an user if passed password too short', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@gmail.com',
                password: 'se',
                confirm_password: 'se',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        expect(response.status).toBe(ResponseCodes.BAD_REQUEST);
        expect(response.body.message).toBe('Password too short');
        expect(response.body.error).toBe(true);
    });



    it('should not create an user if passed passwords that do not match', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@gmail.com',
                password: 'senha1',
                confirm_password: 'senha2',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        expect(response.status).toBe(ResponseCodes.BAD_REQUEST);
        expect(response.body.message).toBe('Password and confirm password do not match');
        expect(response.body.error).toBe(true);
    });



    it('should not create an user if passed an email that is already registered', async () => {
        await createUser({ email: 'teste@gmail.com' });

        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@gmail.com',
                password: 'se',
                confirm_password: 'se',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        expect(response.status).toBe(ResponseCodes.FORBIDDEN);
        expect(response.body.message).toBe('Email already exist');
        expect(response.body.error).toBe(true);
    });



    it('should not create an user if passed an id that is already registered', async () => {
        await createUser({ user_id: 'g_noronhe-se' });

        const response = await request(app)
            .post('/users')
            .send({
                user_id: 'g_noronhe-se',
                first_name: 'Gabriel',
                last_name: 'Noronha',
                whatsapp: '81987654321',
                email: 'teste@gmail.com',
                password: 'se',
                confirm_password: 'se',
                city: 'Recife',
                birthday: '16/12/2002',
                avatar_id: 12
        });

        expect(response.status).toBe(ResponseCodes.FORBIDDEN);
        expect(response.body.message).toBe('UserID already exist');
        expect(response.body.error).toBe(true);
    });
});