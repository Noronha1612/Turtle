import truncate from '../utils/truncate'
import request from 'supertest';
import app from '../../src/app';
import ResponseCodes from '../../src/interfaces/responseCodes';

describe('recover_password', () => {
    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });



    it('should not send email if email not registered', async () => {
        const response = await request(app)
            .post('/recoverPassword')
            .send({
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImluYy42OTFAaG90bWFpbC5jb20ifQ.n_U9KBMtPn1D7zDI3IRp7iLct3czcQStVCmc5QOpf_o',
        });

        expect(response.status).toBe(ResponseCodes.NOT_FOUND);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Email not found');
    });
})