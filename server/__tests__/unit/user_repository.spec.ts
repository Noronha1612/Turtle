import ResponseCodes from "../../src/interfaces/responseCodes";
import UserRepository from "../../src/models/repositories/UserRepository";
import createUser from "../utils/createUser";
import truncate from "../utils/truncate";

const userRepository = new UserRepository;

describe('user_repository', () => {
    beforeEach(async () => {
        await truncate();
    });
    
    afterEach(async () => {
        await truncate();
    });



    it('should search all users', async () => {

        await createUser();
        await createUser({ first_name: 'Noronha' });
        await createUser();

        const allUsers = await userRepository.indexAllUsers();

        expect(allUsers.length).toBe(3);
        expect(allUsers[1].first_name).toBe('Noronha');
    });



    it('should get an user by email if email is registered', async() => {
        await createUser({ email: 'teste@email.com' });

        const userResponse = await userRepository.getUserByEmail('teste@email.com');
        
        expect(userResponse.data).not.toBeUndefined();
        expect(userResponse.data?.email).toBe('teste@email.com');
        expect(userResponse.code).toBe(ResponseCodes.OK);
    });



    it('should not get an user by email if email is not registered', async () => {
        const userResponse = await userRepository.getUserByEmail('teste@email.com');

        expect(userResponse.data).toBeUndefined();
        expect(userResponse.code).toBe(ResponseCodes.NOT_FOUND);
        expect(userResponse.message).toBe('Email not found');
    });
});