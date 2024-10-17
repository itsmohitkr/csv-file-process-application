exports.up = function (knex) {
  return knex.schema.createTable("requestTable", (table) => {
    table.increments("id").primary();
    table.string("requestId");
    table.string("object_key");
    table.string("status");
    table.string("updated_file_url");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("requestTable");
};
