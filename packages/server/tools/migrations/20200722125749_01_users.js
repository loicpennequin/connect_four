exports.up = async function(knex) {
  return knex.schema.createTable('user', table => {
    table
      .increments()
      .unsigned()
      .primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('username').unique();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('password_hash').notNullable();
    table
      .boolean('is_online')
      .nullable()
      .defaultTo(false);

    table.string('refresh_token').nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('user');
};
