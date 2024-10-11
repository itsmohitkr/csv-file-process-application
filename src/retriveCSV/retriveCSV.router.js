const router = require("express").Router();
const controller = require("./retriveCSV.controller");

router.route("/").get(controller.list);

module.exports = router;
