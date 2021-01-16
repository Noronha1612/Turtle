export interface UserRegister extends UserGeneric {
    password: string;
}

export interface UserGeneric {
    user_id: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    birthday: string;
    avatar_id: number;
}