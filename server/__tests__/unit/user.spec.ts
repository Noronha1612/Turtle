import db from '../../src/database/connection';
import User from '../../src/models/schemas/User';
import createUser from '../utils/createUser';

describe('users', () => {
    beforeEach(async () => {
        await db.migrate.latest();
    });

    afterEach(async () => {
        await db.migrate.rollback();
    });

    it('should create a session token', async () => {
        const user = await createUser({ user_id: 'noronha123' });

        const token = user.createSessionToken();

        expect(token).not.toBeUndefined();
        expect(token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });

    
})