import truncate from "../utils/truncate";
import request from 'supertest';
import app from "../../src/app";
import ResponseCodes from "../../src/interfaces/responseCodes";

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
});