const axios = require("axios");
const sharp = require("sharp");
const { putObjectUrl } = require("../../aws-config/config");

async function uploadImageToS3(uploadUrl, imageBuffer) {
  console.log("called");
  
  try {
    const response = await axios.put(uploadUrl, imageBuffer, {
      headers: { "Content-Type": "image/jpeg" },
    });
    console.log(response);
    
    console.log("Image uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

async function compressAndSaveImage(imageUrl) {
  console.log("Called");
  
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data);
    const imageMetadata = await sharp(imageBuffer).metadata();

    const compressedImage = await sharp(imageBuffer)
      .resize({
        width: Math.round(imageMetadata.width * 0.5),
        height: Math.round(imageMetadata.height * 0.5),
      })
      .toBuffer();

    const compressedImageFilename = `compressed-${Date.now()}.jpg`;
    const uploadUrl = await putObjectUrl(compressedImageFilename, "image/jpeg");
    await uploadImageToS3(uploadUrl, compressedImage);

    const liveImageUrl = `https://mydemo-private.s3.ap-southeast-2.amazonaws.com/uploads/user-images/${compressedImageFilename}`;
    return liveImageUrl;
  } catch (error) {
    console.error("Error compressing and saving the image:", error);
  }
}

async function processImages(req, res, next) {
  const data = req.csvData;
  for (let i = 0; i < data.length; i++) {
    const imageUrls = data[i]["Input Image Urls"];
    const updatedUrls = [];

    for (let j = 0; j < imageUrls.length; j++) {
      const url = imageUrls[j];
      const compressedImagePath = await compressAndSaveImage(url, `${i}${j}`);
      if (compressedImagePath) {
        updatedUrls.push(compressedImagePath);
      }
    }

    data[i]["Input Image Urls"] = updatedUrls.join(", ");
  }

  req.updatedCsvData = data;
  next();
}

module.exports = {
  compressAndSaveImage,
};
