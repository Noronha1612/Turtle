import db from '../../src/database/connection';
import app from '../../src/app';
import request from 'supertest';

describe('users', () => {
    beforeAll(async () => {
        await db.migrate.latest();
    });

    afterAll(async () => {
        await db.migrate.rollback();
    })

    it('should authenticate with valid data', async () => {
        const response = await request(app)
            .post('/session')

        expect(response.status).toBe(200);
    });
});