const axios = require("axios");
const { processS3Csv } = require("./middleware/startProcessing");

async function startProcessingCsvFile(req, res) {
  await processS3Csv(req.body.bucketName, req.body.objectKey);
  res.status(200).send("csv processed");
}

module.exports = {
  startProcessingCsvFile,
};
