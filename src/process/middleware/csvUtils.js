const { compressAndUploadImage } = require("./imageUtils");

async function processRow(row) {
  try {
    let newCompressedImageUrls = [];
    if (row["Input Image Urls"]) {
      const originalImageUrls = row["Input Image Urls"].split(",");
      newCompressedImageUrls = await Promise.all(
        originalImageUrls.map(async (url) => {
          try {
            const compressedImageUrl = await compressAndUploadImage(url.trim());
            return compressedImageUrl;
          } catch (error) {
            console.error(`Error processing image URL (${url}):`, error);
            return url;
          }
        })
      );

      row["Input Image Urls"] = originalImageUrls.join(","); // Keep original URLs
      row["Compressed Image Urls"] = newCompressedImageUrls.join(","); // Add new URLs
    }

    return row; //return updated row
  } catch (error) {
    console.error("Error processing row:", error);
    return row;
  }
}

module.exports = {
  processRow,
};
