import { UserGeneric, UserRegister } from "../../interfaces/UserInterface";
import db from '../../database/connection';

export interface UserRepositoryResponse<T> {
    error: boolean;
    data?: T
}

export default class UserRepository {
    static async indexAllUsers() {
        const response = await db('users').select('*');

        return response;
    }

    static async getUserById(id: string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        try {
            const response = await db('users')
                .select(['user_id', 'name', 'email', 'whatsapp', 'city', 'birthday', 'avatar_id'])
                .where({ user_id: id })
                .first<UserGeneric | undefined>();

            if ( !response ) return { error: true };

            return { error: false, data: response };
        } catch(err) {
            console.log(err);
            return { error: true };
        }
    }

    static async getUserByEmail(email:string): Promise<UserRepositoryResponse<UserGeneric | undefined>> {
        try {
            const response = await db('users')
                .select(['user_id', 'name', 'email', 'whatsapp', 'city', 'birthday', 'avatar_id'])
                .where({ email })
                .first<UserGeneric | undefined>();

            if ( !response ) return { error: true };

            return { error: false, data: response };
        } catch(err) {
            console.log(err);
            return { error: true };
        }
    }

    static async getPasswordByEmail(email:string): Promise<UserRepositoryResponse<string | undefined>> {
        try {
            const response = await db('users')
            .select('password')
            .where({ email })
            .first<{ password: string } | undefined>();

            return { error: false, data: response?.password };
        } catch(err) {
            console.log(err);
            return { error: true };
        }
    }


    static async insertUser(data: UserRegister): Promise<UserRepositoryResponse<undefined>> {
        try {
            await db('users')
                .insert(data);

            return { error: false };
        } catch(err) {
            console.log(err);
            return { error: true };
        }
    }
}