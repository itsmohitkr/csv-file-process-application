const router = require("express").Router();
const controller = require("./sns.controller");

router.route("/").post(controller.handleSnsMessage);

module.exports = router;
