const router = require("express").Router();
const controller = require("./retriveCSV.controller");

router.route("/:requestId").get(controller.read);

module.exports = router;
