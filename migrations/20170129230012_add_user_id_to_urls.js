exports.up = function(knex, Promise) {
  return knex.schema.table('urls', (table) => {
    table.integer('user_id').unsigned();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('urls', (table) => {
    table.dropColumn('user_id');
  });
};
