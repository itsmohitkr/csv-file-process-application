
const { compressAndUploadImage } = require("./imageUtils"); 

async function processRow(row) {
  let newCompressedImageUrls = [];
  if (row["Input Image Urls"]) {
    const originalImageUrls = row["Input Image Urls"].split(",");
    newCompressedImageUrls = await Promise.all(
      originalImageUrls.map(async (url) => {
        const compressedImageUrl = await compressAndUploadImage(url.trim());
        return compressedImageUrl;
      })
    );

    // Update the row with both original and new URLs
    row["Input Image Urls"] = originalImageUrls.join(","); // Keep original URLs
    row["Compressed Image Urls"] = newCompressedImageUrls.join(","); // Add new URLs
  }

  return row;
}

// Export the function
module.exports = {
  processRow,
};
