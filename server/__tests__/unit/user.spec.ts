import db from '../../src/database/connection';
import User from '../../src/models/schemas/User';
import createUser from '../utils/createUser';
import truncate from '../utils/truncate';

describe('users', () => {

    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });

    

    it('should setBody if user_id is registered in DB', async () => {
        await createUser({user_id: 'noronha123'});

        const user = new User('noronha123');

        await user.setBody();

        expect(user.getBody()).not.toBeUndefined();
        expect(user.getBody()?.first_name).not.toBeUndefined();
    });



    it('should not setBody if user_id is not registered in DB', async () => {
        const user = new User('noronha123');

        try {
            await user.setBody();

            expect(user.getBody()).toBeUndefined();
        } catch(err) {
            expect(err).not.toBeUndefined();
        }
    });



    it('should setBody if data is valid', async () => {
        const user = new User('noronha123');
        await user.setBody(true, {
            user_id: 'noronha',
            avatar_id: 12,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'inc.691@gmail.com',
            first_name: 'Gabriel',
            last_name: 'Noronha',
            password: '306090120',
            confirm_password: '306090120',
            whatsapp: '81983167399'
        });

        expect(user.getBody()).not.toBeUndefined();
        expect(user.getBody()?.first_name).not.toBeUndefined();
        expect(user.getBody()?.first_name).toBe('Gabriel');
    });
})