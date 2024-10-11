
const { saveFileLocally } = require("./middeware/uploadService");
const { readFile } = require("./middeware/csvParserService");
const { processImages } = require("./middeware/imageService");
const { createNewCsv } = require("./middeware/csvWriterService");

function create(req, res) {
  res.json({
    message: "File uploaded and processed successfully",
    file: req.file,
    downloadLink: req.s3CsvFileUrl,
  });
}

module.exports = {
  create: [saveFileLocally, readFile, processImages, createNewCsv, create],
};

