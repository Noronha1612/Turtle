import faker, { fake } from 'faker';
import UserManager from '../../src/models/managers/UserManager';
import User from '../../src/models/schemas/User';

export default async function createUser(data = {}) {

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    }

    const password = faker.internet.password();

    const dataFake = {
        user_id: faker.internet.userName(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        whatsapp: faker.phone.phoneNumber(),
        password: password,
        confirm_password: password,
        city: faker.address.city(),
        birthday: formatDate(faker.date.past()),
        avatar_id: faker.random.number({ min: 0, max: 12 }),
        ...data
    }

    const user = new User(dataFake.user_id);
    await user.setBody(true, dataFake);

    return user;
}