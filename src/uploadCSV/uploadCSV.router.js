const router = require("express").Router();
const controller = require("./uploadCSV.controller");

router.route("/").post(controller.create);

module.exports = router;
