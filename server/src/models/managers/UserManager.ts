import ResponseCodes from "../../interfaces/responseCodes";
import { UserGeneric, UserRegister } from "../../interfaces/UserInterface";
import { encryptItem } from "../../utils/encryptItem";
import generateToken from "../../utils/generateToken";
import UserRepository, { UserRepositoryResponse } from '../repositories/UserRepository';

export interface UserManagerResponse<T> extends UserRepositoryResponse<T> {
    code: ResponseCodes;
    message?: string;
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
        const filteredData = {
            ...data,
            password: encryptItem(data.password).item as string,
            confirm_password: encryptItem(data.confirm_password).item as string
        }


        // Validations //

        // Check if passwords match
        if ( data.password !== data.confirm_password ) return { error: true, message: 'Password and confirm password do not match', code: ResponseCodes.BAD_REQUEST };

        // Check if user with ID given is already registered
        const searchedUserById = await UserRepository.getUserById(data.user_id);
        if ( !searchedUserById.error ) return { error: true, message: 'UserID already exist', code: ResponseCodes.FORBIDDEN };

        // Check if user with email given already exist
        const searchedUserByEmail = await UserRepository.getUserByEmail(data.email);
        if ( !searchedUserByEmail.error ) return { error: true, message: 'Email already exist', code: ResponseCodes.FORBIDDEN };

        // Check if user birthday is not after today
        const today = Date.now();
        const userBirthday = data.birthday.split('/').map(item => Number(item)) as [number, number, number];
        const userBirthdayInNumber = new Date(userBirthday[2], userBirthday[1], userBirthday[0]).getTime();
        if ( today < userBirthdayInNumber ) return { error: true, message: 'Invalid date', code: ResponseCodes.BAD_REQUEST };

        // Check if email is valid
        const regexEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( !data.email.match(regexEmailPattern) ) return { error: true, message: 'Invalid email', code: ResponseCodes.BAD_REQUEST };

        // Check if password is too short
        if ( data.password.length < 6 ) return { error: true, message: 'Password too short', code: ResponseCodes.BAD_REQUEST };



        const response = await UserRepository.insertUser(filteredData);

        if ( response.error ) return { ...response, code: ResponseCodes.BAD_REQUEST };

        return { ...response, code: ResponseCodes.CREATED };
    }

    static async createSession(email: string, password: string): Promise<UserManagerResponse<string | undefined>> {
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