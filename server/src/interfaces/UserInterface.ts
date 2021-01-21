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
}