import ResponseCodes from "../interfaces/responseCodes";
import { UserRegister } from "../interfaces/UserInterface";
import UserRepository, { UserRepositoryResponse } from "../models/repositories/UserRepository";

export default async function validateInsert(data: UserRegister): Promise<UserRepositoryResponse<undefined>> {

    // Check if user with ID given is already registered
    const searchedUserById = await UserRepository.getUserById(data.user_id);
    if ( !searchedUserById.error ) return { error: true, message: 'UserID already exist', code: ResponseCodes.FORBIDDEN };

    // Check if user with email given already exist
    const searchedUserByEmail = await UserRepository.getUserByEmail(data.email);
    if ( !searchedUserByEmail.error ) return { error: true, message: 'Email already exist', code: ResponseCodes.FORBIDDEN };
    
    // Check if passwords match
    if ( data.password !== data.confirm_password ) return { error: true, message: 'Password and confirm password do not match', code: ResponseCodes.BAD_REQUEST };

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

    return { error: false, code: ResponseCodes.ACCEPTED }
}