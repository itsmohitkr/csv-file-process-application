const router = require("express").Router();
const methodNotAllowed = require("../error/methodNotAllowed");
const controller = require("./retriveCSV.controller");

router.route("/:requestId").get(controller.read).all(methodNotAllowed);

module.exports = router;
