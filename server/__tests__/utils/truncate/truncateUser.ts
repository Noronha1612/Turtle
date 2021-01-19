import db from '../../../src/database/connection';

export default async function truncateUser() {
    await db('users').del();
}