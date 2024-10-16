const axios = require("axios");
const { processS3Csv } = require("./middleware/startProcessing");

function confirm(req, res) {
  const message = req.body;

  // Check if the message is a SubscriptionConfirmation request
  if (message && message.Type === "SubscriptionConfirmation") {
    const confirmUrl = message.SubscribeURL;
    console.log("Confirming SNS Subscription:", confirmUrl);

    // Send an HTTP GET request to confirm the subscription
    axios
      .get(confirmUrl)
      .then(() => {
        console.log("SNS Subscription Confirmed!");
      })
      .catch((err) => {
        console.error("Error confirming subscription:", err);
      });
  }

  // Your existing code to handle notifications...
  res.status(200).send("Received SNS message");
}

function process(req,res,next) {
  const message = req.body;
  console.log(message);
  

  // Check for Notification message type
  if (message && message.Type === "Notification") {
    console.log("SNS Notification Received:", message);

    const s3Event = JSON.parse(message.Message); // The actual S3 event is in the 'Message' field

    const bucketName = s3Event.Records[0].s3.bucket.name;
    const objectKey = decodeURIComponent(
      s3Event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    console.log(
      `New file uploaded to S3: ${objectKey} in bucket: ${bucketName}`
    );
    // now update status as file uploaded and processing start to data base

    // Start processing the CSV (your existing function)
    processS3Csv(bucketName, objectKey);
  }

  res.status(200).send("Received SNS notification");
}

module.exports = {
  confirm,
  process,
};
