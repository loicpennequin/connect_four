exports.up = async function(knex) {
  return knex.schema.alterTable('user', table => {
    table
      .integer('status')
      .notNullable()
      .defaultTo(0);

  });
};

exports.down = async function(knex) {
  return knex.schema.alterTable('user', table => {
    table.dropColumn('status');
  });
};
