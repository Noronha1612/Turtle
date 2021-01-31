export interface UserRegister extends UserGeneric {
    password: string;
    confirm_password: string;
}

export interface UserGeneric {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
    city: string;
    birthday: string;
    avatar_id: number;
    exp_recover_password?: string;
}

export interface UserGenericOptional {
    first_name?: string;
    last_name?: string;
    email?: string;
    whatsapp?: string;
    city?: string;
    birthday?: string;
    avatar_id?: number;
    exp_recover_password?: string;
}

export enum UserGenericPossibilites {
    first_name = "first_name",
    last_name = 'last_name',
    email = 'email',
    whatsapp = 'whatsapp',
    city = 'city',
    birthday = 'birthday',
    avatar_id = 'avatar_id',
    exp_recover_password = 'exp_recover_password'
}