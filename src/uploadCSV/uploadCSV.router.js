const router = require("express").Router();
const methodNotAllowed = require("../error/methodNotAllowed");
const controller = require("./uploadCSV.controller");

router.route("/").post(controller.create).all(methodNotAllowed);

module.exports = router;
