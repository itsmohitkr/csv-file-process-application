const axios = require("axios");
const { processS3Csv } = require("./middleware/startProcessing");

async function handleSnsMessage(req, res) {
  // Get the message type from the headers
  const messageType = req.headers["x-amz-sns-message-type"];

  if (messageType === "SubscriptionConfirmation") {
    // Handle SubscriptionConfirmation
    const message = req.body; // The body contains the actual SNS message
    const confirmUrl = message.SubscribeURL;
    console.log("Confirming SNS Subscription:", confirmUrl);

    try {
      // Send an HTTP GET request to confirm the subscription
      await axios.get(confirmUrl);
      console.log("SNS Subscription Confirmed!");
      res.status(200).send("Confirming SNS Subscription");
    } catch (err) {
      console.error("Error confirming subscription:", err);
      res.status(500).send("Failed to confirm subscription");
    }
  } else if (messageType === "Notification") {
    // Handle SNS Notification
    const message = req.body; // The body contains the notification data
    console.log("SNS Notification Received:", message);

    try {
      const s3Event = JSON.parse(message.Message); // Parse the S3 event

      const bucketName = s3Event.Records[0].s3.bucket.name;
      const objectKey = decodeURIComponent(
        s3Event.Records[0].s3.object.key.replace(/\+/g, " ")
      );

      console.log(
        `New file uploaded to S3: ${objectKey} in bucket: ${bucketName}`
      );

      // Start processing the CSV (your existing function)
      processS3Csv(bucketName, objectKey);
      res.status(200).send("Received SNS notification");
    } catch (err) {
      console.error("Error processing SNS notification:", err);
      res.status(500).send("Error processing notification");
    }
  } else {
    res.status(404).send("Unsupported SNS message type");
  }
}

module.exports = {
  handleSnsMessage,
};
