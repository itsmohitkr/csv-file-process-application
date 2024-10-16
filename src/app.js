
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");



const uploadCSVrouter=require("./uploadCSV/uploadCSV.router")
const retriveCSVrouter = require("./retriveCSV/retriveCSV.router");
const snsRouter = require("./sns/sns.router");
app.use(express.text({ type: "text/plain" }));

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

app.use("/upload-csv", uploadCSVrouter);
app.use("/sns", snsRouter);
app.use("/get-processed-csv", retriveCSVrouter);


module.exports = app;
