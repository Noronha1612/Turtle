import knex from 'knex';

export function up(knex: knex) {
    return knex.schema.createTable('user_group', table => {
        table.increments('id').primary();
        table.string('user_id').notNullable();
        table.string('group_id').notNullable();

        table.foreign('user_id').references('user_id').inTable('users');
        table.foreign('group_id').references('group_id').inTable('groups');
    });
}

export function down(knex: knex) {
    return knex.schema.dropTable('user_group')
}