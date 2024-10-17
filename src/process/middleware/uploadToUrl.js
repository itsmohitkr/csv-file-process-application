// s3Utils.js

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../aws-config/config"); // Adjust the path as needed

async function uploadToPresignedUrl(bucketName, key) {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: "text/csv",
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, uploadCommand, {
      expiresIn: 3600,
    });
    const filePath = path.join(__dirname, "temp-processed.csv");
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return;
    }

    // Create a read stream from the file
    const fileBuffer = fs.readFileSync(filePath);

    // Upload the buffer to S3 using the presigned URL
    const response = await axios.put(presignedUrl, fileBuffer, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Length": fileBuffer.length, // Add Content-Length header
      },
    });

    console.log(`Uploaded file to S3 via presigned URL: ${key}`, response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Export the function
module.exports = {
  uploadToPresignedUrl,
};
