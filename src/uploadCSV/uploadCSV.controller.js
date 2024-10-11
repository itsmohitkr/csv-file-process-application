
const { saveFileLocally } = require("./middeware/uploadService");
const { readFile } = require("./middeware/csvParserService");
const { processImages } = require("./middeware/imageService");
const { createNewCsv } = require("./middeware/csvWriterService");

const service = require('./uploadCSV.service');

async function create(req, res) {
  try {
    const s3CsvFileUrl = req.s3CsvFileUrl;
    const requestId = req.requestId;

    const data = await service.create(requestId, s3CsvFileUrl);

    res.json({
      message: "File uploaded and processed successfully",
      downloadLink: s3CsvFileUrl,
      data,
    });
  } catch (error) {
    console.error("Error processing CSV file:", error);

    res.status(500).json({
      error: "An error occurred while processing the file.",
      details: error.message || "Unknown error",
    });
  }
}

module.exports = {
  create: [saveFileLocally, readFile, processImages, createNewCsv, create],
};

