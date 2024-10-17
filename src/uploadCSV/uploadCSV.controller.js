const { v4: uuidv4 } = require("uuid");
const { putObjectUrl } = require("../../src/aws-config/config");
const service = require("./uploadCSV.service");

async function create(req, res,next) {
  try {
    const metadata = req.body;
    console.log(metadata);
    

    // Check if the file type is CSV
    if (metadata.filetype !== "text/csv") {
      next({
        status: 400,
        message: "File type must be .csv",
      });
    }

    // Generate a unique requestId
    const requestId = uuidv4();
    const fileNameWithoutExtension = metadata.filename.endsWith(".csv")
      ? metadata.filename.slice(0, -4)
      : metadata.filename;

    // Generate a new filename and presigned URL for client-side S3 upload
    const filenameNew = `${fileNameWithoutExtension}-${requestId}.csv`;
    const uploadUrl = await putObjectUrl(filenameNew, metadata.filetype);

    // Set status to indicate file has not been uploaded yet
    const status = "File not uploaded yet to database.";

    // Store the requestId and status in the database (or any other service)
    const objectKey = `uploads/original-csv/${filenameNew}`;
    await service.create(requestId, status, objectKey);

    // Respond with the presigned URL and other relevant information
    res.json({
      message: "Presigned URL generated. File not uploaded yet.",
      data: {
        requestId,
        uploadUrl,
        newFileName: filenameNew,
      },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);

    res.status(500).json({
      error: "An error occurred while generating the upload URL.",
      details: error.message || "Unknown error",
    });
  }
}

module.exports = {
  create,
};
