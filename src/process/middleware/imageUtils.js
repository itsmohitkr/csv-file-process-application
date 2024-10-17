
const axios = require("axios");
const sharp = require("sharp");
const { Upload } = require("@aws-sdk/lib-storage");
const { s3Client } = require("../../aws-config/config");

async function compressAndUploadImage(imageUrl) {
  try {
    // Fetch the image data using axios
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);
    const imageMetadata = await sharp(imageBuffer).metadata();

    // Compress the image using sharp
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: Math.round(imageMetadata.width * 0.5),
        height: Math.round(imageMetadata.height * 0.5),
      })
      .toBuffer();

    // Generate a unique filename for the compressed image
    const newFileName = `compressed-image-${Date.now()}.jpeg`;

    // Upload the compressed image to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: "mydemo-private", // Update with your bucket name
        Key: `uploads/compressed-images/${newFileName}`,
        Body: compressedImageBuffer,
        ContentType: "image/jpeg",
      },
    });

    await upload.done(); // Wait for the upload to complete

    // Generate the URL for the uploaded image
    return `https://mydemo-private.s3.amazonaws.com/uploads/compressed-images/${newFileName}`; // Update with your bucket name
  } catch (error) {
    console.error("Error compressing and uploading the image:", error);
    throw error;
  }
}

// Export the function
module.exports = {
  compressAndUploadImage,
};
