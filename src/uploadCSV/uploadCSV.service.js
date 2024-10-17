const knex = require("../db/connection");
const tableName = "requestTable";

async function create(requestId, status, objectKey) {
  try {
    const created = await knex(tableName)
      .insert({ requestId, status, object_key: objectKey })
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
