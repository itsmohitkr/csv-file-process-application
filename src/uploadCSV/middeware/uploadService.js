const { v4: uuidv4 } = require("uuid");
const { putObjectUrl } = require("../../aws-config/config");
const { processS3Csv } = require("./csvParserService");

async function saveFileLocally(req, res, next) {
  const metadata = req.body;
  if (metadata.filetype !== "text/csv") {
    return next({
      status: 400,
      message: "File type must be .csv",
    });
  }

  const requestId = uuidv4();
  const fileNameWithoutExtension = metadata.filename.endsWith(".csv")
    ? metadata.filename.slice(0, -4)
    : metadata.filename;

  const filenameNew = `${fileNameWithoutExtension}-${requestId}.csv`;
  const uploadUrl = await putObjectUrl(filenameNew, metadata.filetype);

  res.json({ data: { requestId, uploadUrl, newFileName: filenameNew } });

  const objectKey = `uploads/original-csv/${filenameNew}`;
  try {
    setTimeout(async () => {
      await processS3Csv("mydemo-private", objectKey);
    }, 15000);
  } catch (error) {
    console.error("Error processing CSV:", error);
    return next({
      status: 500,
      message: "Error processing CSV",
    });
  }
}

module.exports = {
  saveFileLocally,
};
