require("dotenv").config();
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: "mydemo-private",
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
}
async function putObjectUrl(filename, contentType) {
  let key = "";
  if (contentType == "text/csv") {
    key = `uploads/original-csv/${filename}`;
  } else {
    key = `uploads/user-images/${filename}`;
  }
  const command = new PutObjectCommand({
    Bucket: "mydemo-private",
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
}

module.exports = {
  getObjectUrl,
  putObjectUrl,
  s3Client,
};
