exports.up = async function(knex) {
  return knex.schema.createTable('message', table => {
    table.increments().primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .integer('author_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .notNullable()
      .onDelete('CASCADE');
    table
      .string('content')
      .notNullable()
    table
      .integer('game_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .notNullable()
      .onDelete('CASCADE');
    table.text('history').notNullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('message');
};
