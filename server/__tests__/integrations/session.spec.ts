import db from '../../src/database/connection';

describe('users', () => {
    beforeAll(() => {
        db.migrate.latest();
    });

    afterAll(() => {
        db.migrate.rollback();
    })

    it('should authenticate with valid data', () => {
        
    });
});