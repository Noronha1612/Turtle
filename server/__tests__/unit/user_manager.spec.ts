import db from '../../src/database/connection';
import ResponseCodes from '../../src/interfaces/responseCodes';
import UserManager from '../../src/models/managers/UserManager';
import UserRepository from '../../src/models/repositories/UserRepository';
import User from '../../src/models/schemas/User';
import createUser from '../utils/createUser';
import truncate from '../utils/truncate';

describe('user_manager', () => {

    beforeEach(async () => {
        await truncate();
    });

    afterEach(async () => {
        await truncate();
    });
    
    
    
    it('should find user by Id', async () => {
        await createUser({ user_id: 'noronha123' });

        const userResponse = await UserManager.findById('noronha123');

        expect(userResponse.data).not.toBeUndefined();
        expect(userResponse.data?.user_id).toBe('noronha123');

        expect(userResponse.error).toBe(false);
        expect(userResponse.code).toBe(ResponseCodes.OK);
    });



    it('should not find user if Id not registered', async () => {
        const userResponse = await UserManager.findById('noronha123');

        expect(userResponse.error).toBe(true);
        expect(userResponse.code).toBe(ResponseCodes.NOT_FOUND);
        expect(userResponse.data).toBeUndefined();
    });



    it('should insert into DB if data is valid and user not exist', async () => {

        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            name: 'Noronha',
            password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.code).toBe(ResponseCodes.CREATED);
        expect(createResponse.data).toBeUndefined();
        expect(createResponse.error).toBe(false);
    });

    

    it('should not insert into DB if userId already exist', async () => {
        await createUser({ user_id: 'noronha123' });

        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            name: 'Noronha',
            password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.FORBIDDEN);
        expect(createResponse.data).toBeUndefined();
    });



    it('should not insert into DB if email already exist', async () => {
        await createUser({ email: 'teste@gmail.com' });

        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            name: 'Noronha',
            password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.FORBIDDEN);
        expect(createResponse.data).toBeUndefined();
    });



    it('should create a session if valid data', async () => {
        await createUser({ email: 'teste@gmail.com', password: '306090120' });

        const sessionResponse = await UserManager.createSession('teste@gmail.com', '306090120');

        expect(sessionResponse.data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(sessionResponse.code).toBe(ResponseCodes.CREATED);
        expect(sessionResponse.error).toBe(false);
    })
});