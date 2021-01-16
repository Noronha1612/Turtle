import ResponseCodes from "../../interfaces/responseCodes";
import { UserGeneric, UserRegister } from "../../interfaces/UserInterface";
import { encryptItem } from "../../utils/encryptItem";
import UserRepository, { UserRepositoryResponse } from '../repositories/UserRepository';
import User from "../schemas/User";

export interface UserManagerResponse<T> extends UserRepositoryResponse<T> {
    code: ResponseCodes;
}

export default class UserManager {
    static async findById(id: string): Promise<UserManagerResponse<UserGeneric | undefined>> {
        const response = await UserRepository.getUserById(id);

        return { ...response, code: 200 };
    } 

    static async insertIntoDB(data: UserRegister): Promise<UserManagerResponse<undefined>> {
        // Validations

        const filteredData = {
            ...data,
            password: encryptItem(data.password).item as string
        }

        const response = await UserRepository.insertUser(filteredData);

        return { ...response, code: 200 };
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

            const user = new User(searchedUserBody.user_id);
            await user.setBody();

            const token = await user.createSessionToken();

            return { error: false, code: ResponseCodes.OK, data: token };
        } catch(err) {
            console.log(err);
            return { error: true, code: ResponseCodes.INTERNAL_SERVER_ERROR }
        }
    }
}