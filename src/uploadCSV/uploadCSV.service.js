const knex = require("../db/connection");
const tableName = "requestTable";

async function create(requestId, updated_file_url) {
  try {
    const created = await knex(tableName)
      .insert({ requestId, updated_file_url })
      .returning("*");

    return created[0]; // Return the created record
  } catch (error) {
    console.error("Error creating record:", error);
    throw error; // Rethrow the error for higher-level handling
  }
}

module.exports = {
  create,
};
