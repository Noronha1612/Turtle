import ResponseCodes from "../../interfaces/responseCodes";
import { UserGeneric, UserRegister } from "../../interfaces/UserInterface";
import { encryptItem } from "../../utils/encryptItem";
import generateToken from "../../utils/generateToken";
import UserRepository, { UserRepositoryResponse } from '../repositories/UserRepository';

export interface UserManagerResponse<T> extends UserRepositoryResponse<T> {
    code: ResponseCodes;
}

export default class UserManager {
    static async findById(id: string): Promise<UserManagerResponse<UserGeneric | undefined>> {
        const response = await UserRepository.getUserById(id);

        return { ...response, code: response.data ? ResponseCodes.OK : ResponseCodes.NOT_FOUND };
    } 

    static async findByEmail(email: string): Promise<UserManagerResponse<UserGeneric | undefined>> {
        const response = await UserRepository.getUserByEmail(email);

        return { ...response, code: response.data ? ResponseCodes.OK : ResponseCodes.NOT_FOUND };
    } 

    static async insertIntoDB(data: UserRegister): Promise<UserManagerResponse<undefined>> {
        // Validations

        const filteredData = {
            ...data,
            password: encryptItem(data.password).item as string
        }

        // Check if user with ID given is already registered
        const searchedUserById = await UserRepository.getUserById(data.user_id);
        if ( !searchedUserById.error ) return { error: true, code: ResponseCodes.FORBIDDEN };

        // Check if user with email given already exist
        const searchedUserByEmail = await UserRepository.getUserByEmail(data.email);
        if ( !searchedUserByEmail.error ) return { error: true, code: ResponseCodes.FORBIDDEN };

        const response = await UserRepository.insertUser(filteredData);

        if ( response.error ) return { ...response, code: ResponseCodes.BAD_REQUEST };

        return { ...response, code: ResponseCodes.CREATED };
    }

    static async createSession(email: string, password: string): Promise<UserManagerResponse<string | undefined>> {
        // Validations
        try {
            const {data: searchedUserBody} = await UserRepository.getUserByEmail(email);

            if ( !searchedUserBody ) return { error: true, code: ResponseCodes.NOT_FOUND }
            else {
                const {data: userPassword} = await UserRepository.getPasswordByEmail(email);

                if ( userPassword !== encryptItem(password).item ) return { error: true, code: ResponseCodes.UNAUTHORIZED }
            }

            const token = generateToken({
                user_id: searchedUserBody.user_id,
                email: searchedUserBody.email,
                exp: Date.now() + 1000 * 60 * 60 * 24
            });

            return { error: false, code: ResponseCodes.CREATED, data: token };
        } catch(err) {
            console.log(err);
            return { error: true, code: ResponseCodes.INTERNAL_SERVER_ERROR }
        }
    }
}