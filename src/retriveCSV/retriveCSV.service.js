const knex = require("../db/connection");
const tableName = "requestTable";

function read(id) {
    return knex(tableName).select("*").where({ requestId: id }).first();
}

module.exports = {
  read,
};
