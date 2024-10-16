
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");



const uploadCSVrouter=require("./uploadCSV/uploadCSV.router")
const retriveCSVrouter = require("./retriveCSV/retriveCSV.router");
const processCsvRouter = require("./sns/sns.router");
const { processS3Csv } = require("./sns/middleware/startProcessing");
app.use(express.text({ type: "text/plain" }));

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

app.use("/upload-csv", uploadCSVrouter);
// app.use("/sns", snsRouter);
app.use("/process-csv", async(req, res) => {
    await processS3Csv(req.body.bucketName, req.body.objectKey);
    res.status(200).send("csv processed");
});

app.use("/get-processed-csv", retriveCSVrouter);


module.exports = app;
