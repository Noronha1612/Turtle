import { UserGeneric, UserRegister } from '../../interfaces/UserInterface';
import UserManager from '../managers/UserManager';

const userManager = new UserManager();

export default class User {
    private id: string;
    private body?: UserGeneric;

    constructor(id: string) {
        this.id = id;
    }

    async setBody(ableToInsert = true, data?: UserRegister) {
        const {data: userSearched} = await userManager.findById(this.getId());

        if ( userSearched ) this.body = userSearched;
        else if ( data && ableToInsert ) {
            await userManager.insertIntoDB({ ...data, user_id: this.getId() });
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