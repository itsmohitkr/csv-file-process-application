
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../aws-config/config"); 

async function uploadToPresignedUrl(bucketName, key) {
  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: "text/csv",
    });

    let presignedUrl;
    try {
      presignedUrl = await getSignedUrl(s3Client, uploadCommand, {
        expiresIn: 3600, // URL expiration time
      });
    } catch (error) {
      console.error("Error generating presigned URL:", error.message);
      throw new Error("Failed to generate presigned URL.");
    }

    const filePath = path.join(__dirname, "temp-processed.csv");
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      throw new Error("File not found for upload.");
    }

    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(filePath);
    } catch (error) {
      console.error("Error reading file:", error.message);
      throw new Error("Failed to read file.");
    }

    try {
      const response = await axios.put(presignedUrl, fileBuffer, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Length": fileBuffer.length, // Specify content length
        },
      });
      console.log(`Successfully uploaded file to S3: ${key}`, response.data);
    } catch (error) {
      console.error("Error during upload:", error);
      throw new Error("Failed to upload file to S3.");
    }
  } catch (error) {
    console.error("Upload process failed:", error.message);
    throw error; 
  }
}

module.exports = {
  uploadToPresignedUrl,
};