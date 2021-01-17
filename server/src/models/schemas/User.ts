import { UserGeneric, UserRegister } from '../../interfaces/UserInterface';
import generateToken from '../../utils/generateToken';
import UserManager, { UserManagerResponse } from '../managers/UserManager';

export default class User {
    private id: string;
    private body?: UserGeneric;

    constructor(id: string) {
        this.id = id;
    }

    async setBody(ableToInsert = true, data?: UserRegister) {
        const {data: userSearched} = await UserManager.findById(this.getId());

        if ( userSearched ) this.body = userSearched;
        else if ( data && ableToInsert ) {
            await UserManager.insertIntoDB({ ...data, user_id: this.getId() });
            await this.setBody();
        }
    }

    public getId(): string {
        return this.id;
    }

    public getBody(): UserGeneric | undefined {
        return this.body;
    }
}