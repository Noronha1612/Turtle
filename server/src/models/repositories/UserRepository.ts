import { UserGeneric, UserGenericOptional, UserGenericPossibilites, UserRegister } from "../../interfaces/UserInterface";
import db from '../../database/connection';
import ResponseCodes from "../../interfaces/responseCodes";

export interface UserRepositoryResponse<T> {
    error: boolean;
    data?: T;
    message?: string;
    code: ResponseCodes;
}

export default class UserRepository {
    async indexAllUsers() {
        const response = await db('users').select('*');

        return response;
    }

    async getUserById(id: string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        try {
            const response = await db('users')
                .select(['user_id', 'first_name', 'last_name', 'email', 'whatsapp', 'city', 'birthday', 'avatar_id', 'exp_recover_password'])
                .where({ user_id: id })
                .first<UserGeneric | undefined>();

            if ( !response ) return { error: true, code: ResponseCodes.NOT_FOUND };

            return { error: false, data: response, code: ResponseCodes.OK };
        } catch(err) {
            console.log(err);
            return { error: true, message: 'Internal Server Error', code: ResponseCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async getUserByEmail(email:string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        try {
            const response = await db('users')
                .select(['user_id', 'first_name', 'last_name', 'email', 'whatsapp', 'city', 'birthday', 'avatar_id', 'exp_recover_password'])
                .where({ email })
                .first<UserGeneric | undefined>();

            if ( !response ) return { error: true, message: 'Email not found', code: ResponseCodes.NOT_FOUND };

            return { error: false, data: response, code: ResponseCodes.OK };
        } catch(err) {
            console.log(err);
            return { error: true, message: 'Internal Server Error', code: ResponseCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async getPasswordByEmail(email:string): Promise<UserRepositoryResponse<string | undefined>> {
        try {
            const response = await db('users')
            .select('password')
            .where({ email })
            .first<{ password: string } | undefined>();

            if ( !response ) return { error: true, message: 'Email not found', code: ResponseCodes.NOT_FOUND }

            return { error: false, data: response?.password, code: ResponseCodes.OK };
        } catch(err) {
            console.log(err);
            return { error: true, message: 'Internal Server Error', code: ResponseCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async insertUser(data: UserRegister): Promise<UserRepositoryResponse<undefined>> {
        try {
            const filteredData = {
                first_name: data.first_name,
                last_name: data.last_name,
                user_id: data.user_id,
                email: data.email,
                whatsapp: data.whatsapp,
                city: data.city,
                birthday: data.birthday,
                avatar_id: data.avatar_id,
                password: data.password
            };

            await db('users')
                .insert(filteredData);

            return { error: false, code: ResponseCodes.CREATED };
        } catch(err) {
            console.log(err);
            return { error: true, message: 'Internal Server Error', code: ResponseCodes.INTERNAL_SERVER_ERROR };
        }
    }

    async updateUser(data: UserGenericOptional): Promise<UserRepositoryResponse<undefined>> {
        const filteredData = { ...data };

        Object.keys(filteredData).forEach((key) => {
            if(!filteredData[key as UserGenericPossibilites]) delete filteredData[key as UserGenericPossibilites];
        });
        
        await db('users').update(filteredData);

        return { code: ResponseCodes.OK, error: false };
    }
}