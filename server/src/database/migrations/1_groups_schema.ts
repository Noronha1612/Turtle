import knex from 'knex';

export function up(knex: knex) {
    return knex.schema.createTable('groups', table => {
        table.string('group_id').primary();
        table.string('name').notNullable();
    });
}

export function down(knex: knex) {
    return knex.schema.dropTable('groups')
}