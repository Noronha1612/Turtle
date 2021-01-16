import { UserGeneric, UserRegister } from '../../interfaces/UserInterface';
import generateToken from '../../utils/generateToken';
import UserManager, { UserManagerResponse } from '../managers/UserManager';

export default class User {
    private id: string;
    private body?: UserGeneric;

    constructor(id: string) {
        this.id = id;
    }

    async setBody(data?: UserRegister) {
        const {data: userSearched} = await UserManager.findById(this.getId());

        if ( userSearched ) this.body = userSearched;
        else if ( data ) {
            await UserManager.insertIntoDB({ ...data, user_id: this.getId() });
            this.setBody();
        }
    }

    async createSessionToken() {
        if ( !this.body ) throw 'User has no body yet';

        const token = generateToken({
            user_id: this.id,
            email: this.getBody()?.email,
            exp: Date.now() + 1000 * 60 * 60 * 24
        });
        
        return token;
    }

    public getId(): string {
        return this.id;
    }

    public getBody(): UserGeneric | undefined {
        return this.body;
    }
}