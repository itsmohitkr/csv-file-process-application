const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const { streamFromS3 } = require("./s3Utils");
const { processRow } = require("./csvUtils");
const { uploadToPresignedUrl } = require("./uploadToUrl");


async function processS3Csv(bucketName, objectKey) {
  const s3Stream = await streamFromS3(bucketName, objectKey);
  const tempFilePath = path.join(__dirname, "temp-processed.csv"); 
  const outputStream = fs.createWriteStream(tempFilePath);
  let headerWritten = false;

  const rows = [];

  // Process the incoming CSV stream and store the rows in order
  s3Stream
    .pipe(csvParser())
    .on("data", (row) => {
      rows.push(row); // Collect rows in order
    })
    .on("end", async () => {
      // Process rows in order
      for (const row of rows) {
        const processedRow = await processRow(row);

        // Write header if it's the first row
        if (!headerWritten) {
          const headers = Object.keys(processedRow).concat(
            "Compressed Image Urls"
          ); // Include new column
          outputStream.write(headers.join(",") + "\n"); // Write the header
          headerWritten = true;
        }
        // Write the processed row to the CSV
        outputStream.write(Object.values(processedRow).join(",") + "\n");
      }

      outputStream.end(); // End the writable stream

      // Upload the temporary CSV to S3 using a presigned URL
      const realFileName = key.replace("uploads/original-csv/", "");
      await uploadToPresignedUrl(
        bucketName,
        `uploads/updated-csv/new-updated-file-${realFileName}.csv`
      );

      //delete the temp file
      fs.unlinkSync(tempFilePath);
      console.log("Temporary CSV file deleted.");
      console.log("Finished processing CSV and uploading to S3.");
    })
    .on("error", (error) => {
      console.error("Error processing CSV:", error);
    });
}

module.exports = {
  processS3Csv,
};