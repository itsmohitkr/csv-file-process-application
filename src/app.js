
const express = require("express");
const app = express();
const cors = require("cors");



const uploadCSVrouter=require("./uploadCSV/uploadCSV.router")
const retriveCSVrouter = require("./retriveCSV/retriveCSV.router");

app.use(express.json());
app.use(cors());

app.use("/upload-csv", uploadCSVrouter);
app.use("/get-processed-csv", retriveCSVrouter);


module.exports = app;
