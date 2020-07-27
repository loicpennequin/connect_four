exports.up = async function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments().unsigned().primary();
    table.timestamps(true, true);
    table.string('username').unique();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('password_hash').notNullable();
  
    table.string('refresh_token').nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('user');
};
