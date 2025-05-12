import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.uuid('session_id').notNullable().defaultTo('00000000-0000-0000-0000-000000000000');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id');
    });
}