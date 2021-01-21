import knex from 'knex';

export function up(knex: knex) {
    return knex.schema.createTable('users', table => {
        table.string('user_id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('whatsapp').notNullable().unique();
        table.string('password').notNullable();
        table.string('city').notNullable();
        table.date('birthday').notNullable();
        table.integer('avatar_id').notNullable();
    });
}

export function down(knex: knex) {
    return knex.schema.dropTable('users')
}