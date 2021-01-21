import ResponseCodes from "../../interfaces/responseCodes";
import { UserGeneric, UserRegister } from "../../interfaces/UserInterface";
import { encryptItem } from "../../utils/encryptItem";
import generateToken from "../../utils/generateToken";
import validateInsert from "../../utils/validateInsert";
import UserRepository, { UserRepositoryResponse } from '../repositories/UserRepository';

export default class UserManager {
    static async findById(id: string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        const response = await UserRepository.getUserById(id);

        return response;
    } 

    static async findByEmail(email: string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        const response = await UserRepository.getUserByEmail(email);

        return response;
    } 

    static async insertIntoDB(data: UserRegister): Promise<UserRepositoryResponse<undefined>> {
        const filteredData = {
            ...data,
            password: encryptItem(data.password).item as string,
            confirm_password: encryptItem(data.confirm_password).item as string
        }

        const validation = await validateInsert(data);
        if ( validation.error ) return validation;

        const response = await UserRepository.insertUser(filteredData);
        if ( response.error ) return { ...response, code: ResponseCodes.BAD_REQUEST };

        return { ...response, code: ResponseCodes.CREATED };
    }

    static async createSession(email: string, password: string): Promise<UserRepositoryResponse<string | undefined>> {
        // Validations
        try {
            const {data: searchedUserBody} = await UserRepository.getUserByEmail(email);

            if ( !searchedUserBody ) return { error: true, message: 'Email not found', code: ResponseCodes.NOT_FOUND }
            else {
                const {data: userPassword} = await UserRepository.getPasswordByEmail(email);

                if ( userPassword !== encryptItem(password).item ) return { error: true, message:'Password does not match', code: ResponseCodes.UNAUTHORIZED }
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