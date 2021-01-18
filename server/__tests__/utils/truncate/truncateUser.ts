import db from '../../../src/database/connection';

export default async function truncate() {
    await db('users').del();
}