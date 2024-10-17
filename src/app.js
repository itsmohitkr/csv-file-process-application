
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const uploadCSVrouter=require("./uploadCSV/uploadCSV.router")
const retriveCSVrouter = require("./retriveCSV/retriveCSV.router");
const processCsvRouter = require("./process/process.router");
const notFound = require("./error/notFound");
const errorHandler = require("./error/errorHandler");

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

app.use("/upload-csv", uploadCSVrouter);
app.use("/process-csv", processCsvRouter);
app.use("/get-processed-csv", retriveCSVrouter);

app.use(notFound);
app.use(errorHandler)


module.exports = app;
