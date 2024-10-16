const axios = require("axios");
const { processS3Csv } = require("./middleware/startProcessing");
async function handleSnsMessage(req, res) {
  const message = req.body;

  if (message && message.Type === "SubscriptionConfirmation") {
    // Handle SubscriptionConfirmation
    const confirmUrl = message.SubscribeURL;
    console.log("Confirming SNS Subscription:", confirmUrl);

    try {
      // Send an HTTP GET request to confirm the subscription
      await axios.get(confirmUrl);
      console.log("SNS Subscription Confirmed!");
    } catch (err) {
      console.error("Error confirming subscription:", err);
    }
    res.status(200).send("Confirming SNS Subscription");
  } else if (message && message.Type === "Notification") {
    // Handle SNS Notification
    console.log("SNS Notification Received:", message);

    const s3Event = JSON.parse(message.Message); // Parse the S3 event

    const bucketName = s3Event.Records[0].s3.bucket.name;
    const objectKey = decodeURIComponent(
      s3Event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    console.log(
      `New file uploaded to S3: ${objectKey} in bucket: ${bucketName}`
    );
    // Now update status as file uploaded and processing start to database
    res.status(200).send("Received SNS notification");

    // Start processing the CSV (your existing function)
    processS3Csv(bucketName, objectKey);
  }

}


module.exports = {
  handleSnsMessage,
};
