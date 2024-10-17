const knex = require("../db/connection");
const tableName = "requestTable";

async function update(objectKey, accessLink) {
  try {
    // Update the record where objectKey matches and set the new accessLink
    const updated = await knex(tableName)
      .where({ object_key: objectKey })
      .update({ updated_file_url: accessLink,status:"ready to download" })
      .returning("*");

    return updated[0]; // Return the updated record
  } catch (error) {
    console.error("Error updating record:", error);
    throw error; // Rethrow the error for higher-level handling
  }
}

module.exports = {
  update,
};
