const axios = require("axios");
const { processS3Csv } = require("./middleware/startProcessing");
const service = require("./process.service");

async function startProcessingCsvFile(req, res, next) {
  try {
    const { bucketName, objectKey } = req.body;

    if (
      !bucketName ||
      typeof bucketName !== "string" ||
      bucketName.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing bucketName." });
    }

    if (
      !objectKey ||
      typeof objectKey !== "string" ||
      objectKey.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid or missing objectKey." });
    }

    // main function invocation
    await processS3Csv(bucketName, objectKey, next);
    const accessLink = `https://mydemo-private.s3.ap-southeast-2.amazonaws.com/${objectKey}`;

    await service.update(objectKey, accessLink);
    res.status(200).send("CSV processed successfully");
  } catch (error) {
    console.error("error in startProcessingCsvFile:", error.message);
    next(error);
  }
}

module.exports = {
  startProcessingCsvFile,
};
