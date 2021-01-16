import knex from 'knex';

export function up(knex: knex) {
    return knex.schema.createTable('feets', table => {
        table.increments('feet_id').primary();
        table.string('group_id').notNullable();
        table.string('latitude').notNullable();
        table.string('longitude').notNullable();
        table.boolean('active').notNullable();

        table.foreign('group_id').references('group_id').inTable('groups');
    });
}

export function down(knex: knex) {
    return knex.schema.dropTable('feets')
}