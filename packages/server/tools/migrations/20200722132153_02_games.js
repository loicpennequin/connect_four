exports.up = async function(knex) {
  return knex.schema.createTable('game', table => {
    table.increments().primary();
    table.timestamps(true, true);
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
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('game');
};