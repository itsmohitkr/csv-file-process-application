const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../aws-config/config"); 

async function streamFromS3(bucketName, objectKey) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const { Body } = await s3Client.send(command);
    return Body; // This is a Readable stream
  } catch (error) {
    console.error("Error fetching object from S3:", error);
    throw error;
  }
}

// Export the function
module.exports = {
  streamFromS3,
};
