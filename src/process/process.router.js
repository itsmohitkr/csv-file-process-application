const router = require("express").Router();
const methodNotAllowed = require("../error/methodNotAllowed");
const controller = require("./process.controller");

router.route("/").post(controller.startProcessingCsvFile).all(methodNotAllowed);

module.exports = router;
