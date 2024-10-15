const router = require("express").Router();
const controller = require("./sns.controller");

router.route("/").get(controller.confirm).post(controller.process);

module.exports = router;
