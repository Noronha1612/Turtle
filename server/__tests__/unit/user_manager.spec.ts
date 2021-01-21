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
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.code).toBe(ResponseCodes.CREATED);
        expect(createResponse.data).toBeUndefined();
        expect(createResponse.error).toBe(false);
    });



    it('should not insert into DB if password and confirm_password do not match', async () => {
        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecret',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.BAD_REQUEST);
        expect(createResponse.message).toBe('Password and confirm password do not match');
        expect(createResponse.data).toBeUndefined();
    });

    

    it('should not insert into DB if userId already exist', async () => {
        await createUser({ user_id: 'noronha123' });

        const createResponse = await UserManager.insertIntoDB({
            user_id: 'noronha123',
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.FORBIDDEN);
        expect(createResponse.message).toBe('UserID already exist');
        expect(createResponse.data).toBeUndefined();
    });



    it('should not insert into DB if email already exist', async () => {
        await createUser({ email: 'teste@gmail.com' });

        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            email: 'teste@gmail.com',
            birthday: '16/12/2002',
            city: 'Recife',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.FORBIDDEN);
        expect(createResponse.message).toBe('Email already exist');
        expect(createResponse.data).toBeUndefined();
    });



    it('should not insert into DB if birthday is after the local "now"', async () => {
        const formatDate = (date: Date) => {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
    
            return `${day}/${month}/${year}`
        }

        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: formatDate(new Date(Date.now() + 100000000)),
            city: 'Recife',
            email: 'teste@gmail.com',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.BAD_REQUEST);
        expect(createResponse.message).toBe('Invalid date');
        expect(createResponse.data).toBeUndefined();
    });



    it('should not insert into DB if email is invalid', async () => {
        const responses = [];

        responses.push(await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        }));

        responses.push(await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        }));

        responses.push(await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: '@gmail.com',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senhaSecreta',
            confirm_password: 'senhaSecreta',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        }));

        responses.forEach(createResponse => {
            expect(createResponse.error).toBe(true);
            expect(createResponse.code).toBe(ResponseCodes.BAD_REQUEST);
            expect(createResponse.message).toBe('Invalid email');
            expect(createResponse.data).toBeUndefined();
        });        
    });



    it('should not insert into DB if password is too short', async () => {
        const createResponse = await UserManager.insertIntoDB({
            avatar_id: 2,
            birthday: '16/12/2002',
            city: 'Recife',
            email: 'teste@gmail.com',
            first_name: 'Noronha',
            last_name: 'Cavalcante',
            password: 'senha',
            confirm_password: 'senha',
            user_id: 'noronha123',
            whatsapp: '81982472813'
        });

        expect(createResponse.error).toBe(true);
        expect(createResponse.code).toBe(ResponseCodes.BAD_REQUEST);
        expect(createResponse.message).toBe('Password too short');
        expect(createResponse.data).toBeUndefined();
    })



    it('should create a session if valid data', async () => {
        await createUser({ email: 'teste@gmail.com', password: '306090120', confirm_password: '306090120' });

        const sessionResponse = await UserManager.createSession('teste@gmail.com', '306090120');

        expect(sessionResponse.data).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(sessionResponse.code).toBe(ResponseCodes.CREATED);
        expect(sessionResponse.error).toBe(false);
    });



    it('should not create a session if email does not match', async () => {
        await createUser({ email: 'teste2@gmail.com', password: '306090120', confirm_password: '306090120' });

        const sessionResponse = await UserManager.createSession('teste@gmail.com', '306090120');

        expect(sessionResponse.code).toBe(ResponseCodes.NOT_FOUND);
        expect(sessionResponse.message).toBe('Email not found');
        expect(sessionResponse.error).toBe(true);
    });



    it('should not create a session if password does not match', async () => {
        await createUser({ email: 'teste@gmail.com', password: 'senhaIncorreta', confirm_password: 'senhaIncorreta' });

        const sessionResponse = await UserManager.createSession('teste@gmail.com', '306090120');

        expect(sessionResponse.code).toBe(ResponseCodes.UNAUTHORIZED);
        expect(sessionResponse.message).toBe('Password does not match');
        expect(sessionResponse.error).toBe(true);
    });



    it('should find an user by email if email exist', async () => {
        await createUser({ first_name: 'Noronha', email: 'teste@email.com' });

        const findResponse = await UserManager.findByEmail('teste@email.com');

        expect(findResponse.data?.first_name).toBe('Noronha');
        expect(findResponse.data?.email).toBe('teste@email.com');
        expect(findResponse.code).toBe(ResponseCodes.OK);
        expect(findResponse.error).toBe(false);
    });



    it('should not find an user by email if email is not registered', async () => {
        const findResponse = await UserManager.findByEmail('teste@email.com');

        expect(findResponse.message).toBe('Email not found');
        expect(findResponse.code).toBe(ResponseCodes.NOT_FOUND);
        expect(findResponse.error).toBe(true);
    })
});