const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");
const { PassThrough } = require("stream");
const { Upload } = require("@aws-sdk/lib-storage");

const { createObjectCsvWriter } = require("csv-writer");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const csvParser = require("csv-parser");

const { s3Client } = require("../../aws-config/config");
const { compressAndSaveImage } = require("./imageService");

async function streamFromS3(bucketName, objectKey) {
  console.log("streamFromS3 called with", { bucketName, objectKey });

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const { Body } = await s3Client.send(command);

    if (Body) {
      console.log("Successfully got S3 object, returning Body stream.");
    }
    return Body; // This is a Readable stream
  } catch (error) {
    console.error("Error fetching object from S3:", error);
    throw error; // rethrow the error to handle it at a higher level
  }
}
// Function to process CSV data from S3 without storing it locally
async function processS3Csv(bucketName, objectKey) {
  const s3Stream = await streamFromS3(bucketName, objectKey);
  const outputStream = new PassThrough();
  let header = [];
  let isFirstRow = true;

  // Create a CSV writer that streams to S3
// const csvWriter = createObjectCsvWriter({
//   header: [
//     { id: "S. No.", title: "S. No." },
//     { id: "Product Name", title: "Product Name" },
//     { id: "Input Image Urls", title: "Input Image Urls" },
//   ],
//   // Set output to the writable stream
//   append: true,
//   path: outputStream,
// });
  // Upload the new CSV to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: `uploads/updated-csv/new-updated-file.csv`,
    Body: outputStream,
    ContentType: "text/csv",
  });

  // Start uploading to S3
  const uploadPromise = s3Client.send(uploadCommand);

  s3Stream
    .pipe(csvParser())
    .on("data", async (row) => {
      if (isFirstRow) {
        header = Object.keys(row); // Get headers from the first row
        isFirstRow = false; // Set the flag to false after the first row
      }
      // Process the image URLs if present
      if (row["Input Image Urls"]) {
        const compressedImageUrls = await Promise.all(
          row["Input Image Urls"].split(",").map(async (url) => {
            const compressedImageUrl = await compressAndUploadImage(url.trim());
            return compressedImageUrl;
          })
        );

        // Update the row with new URLs
        row["Input Image Urls"] = compressedImageUrls.join(","); // Join the URLs back into a string

        console.log("row: ", row["Input Image Urls"]);
      }
      

      // Write the processed row to the CSV writer
      // await csvWriter.writeRecords([row]); // Write the entire row
    })
    .on("end", async () => {
      // outputStream.end(); // End the writable stream
      // await uploadPromise; // Wait for the upload to complete
      console.log("Finished processing CSV and uploading to S3.");
    })
    .on("error", (error) => {
      console.error("Error processing CSV:", error);
    });
}

// Function to compress and upload an image
async function compressAndUploadImage(imageUrl) {

  try {
    // Fetch the image data using axios
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer", // Receive the data as a buffer
    });

    const imageBuffer = Buffer.from(response.data);
    const imageMetadata = await sharp(imageBuffer).metadata();
    console.log(response.data);

    // Compress the image using sharp
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: Math.round(imageMetadata.width * 0.5),
        height: Math.round(imageMetadata.height * 0.5),
      })
      .toBuffer();

    // Generate a unique filename for the compressed image
    const newFileName = `compressed-${Date.now()}`;
    console.log(newFileName);

    // Upload the compressed image to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: "mydemo-private",
        Key: `uploads/compressed-images/${newFileName}`,
        Body: compressedImageBuffer,
        ContentType: "image/jpeg",
      },
    });

    await upload.done(); // Wait for the upload to complete

    // Generate the URL for the uploaded image
    const uploadedImageUrl = `https://mydemo-private.s3.amazonaws.com/uploads/compressed-images/${newFileName}`;
    console.log(uploadedImageUrl);

    return uploadedImageUrl; // Return the new image URL
  } catch (error) {
    console.error("Error compressing and uploading the image:", error);
    throw error;
  }
}

// function readFile(req, res, next) {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const filePath = req.file.path;

//   // Read the file content as plain text
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Error reading the CSV file." });
//     }

//     const results = [];
//     const rows = data.split("\n").map((row) => row.trim()); // Split by newline and trim each row

//     // Get the headers from the first row
//     const headers = rows[0].split(";").map((header) => header.trim());

//     for (let i = 1; i < rows.length; i++) {
//       const row = rows[i].split(";").map((col) => col.trim());

//       if (row.length === headers.length) {
//         const result = {};

//         for (let j = 0; j < headers.length; j++) {
//           if (headers[j] === "S. No.") {
//             result[headers[j]] = row[j].replace(/['"]+/g, ""); // Remove quotes
//           } else if (headers[j] === "Input Image Urls") {
//             result[headers[j]] = row[j]
//               .split(",")
//               .map((url) => url.trim().replace(/["']/g, ""));
//           } else {
//             result[headers[j]] = row[j];
//           }
//         }

//         results.push(result);
//       }
//     }

//     req.csvData = results; // Attach parsed data to the request object
//     next(); // Proceed to the next middleware
//   });
// }

module.exports = {
  // readFile,
  processS3Csv,
};
