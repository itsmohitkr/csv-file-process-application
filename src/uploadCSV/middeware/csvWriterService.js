const { Parser } = require("json2csv");
const { putObjectUrl } = require("../../aws-config/config");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

async function createNewCsv(req, res, next) {
  const data = req.updatedCsvData;
  const requestID = uuidv4();

  try {
    // Create CSV content
    const fields = Object.keys(data[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    // Generate a unique file name and get a presigned upload URL from S3
    const fileName = `updated_csv_file_${requestID}.csv`;
    const contentType = "text/csv";
    const uploadURL = await putObjectUrl(fileName, contentType);

    // Upload the CSV file data to S3 using the presigned URL
    await axios.put(uploadURL, csv, {
      headers: {
        "Content-Type": contentType,
      },
    });

    console.log("New CSV file uploaded successfully!");

    // Proceed to the next middleware or response
      req.s3CsvFileUrl = `https://mydemo-private.s3.ap-southeast-2.amazonaws.com/uploads/updated-csv/${fileName}`;
      req.requestId = requestID;
    next();
  } catch (err) {
    console.error("Error creating and uploading new CSV file:", err);
    next(err);
  }
}

module.exports = {
  createNewCsv,
};
