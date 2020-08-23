exports.up = async function(knex) {
  return knex.schema.createTable('game', table => {
    table.increments().primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .integer('user1_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('user2_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('winner_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .notNullable()
      .onDelete('CASCADE');
    table.text('history').notNullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('game');
};
