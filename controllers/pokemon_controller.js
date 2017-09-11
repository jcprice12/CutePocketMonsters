var express = require("express");
var router = express.Router();
var connectEnsureLogin = require("connect-ensure-login");
var serverFile = require("../server.js");

// Import models
var db = require("../models");

//route for main page (home page)
router.get("/", function(req, res) {
    var hbsObj = {};
    res.render("index", hbsObj);
});

// Export routes for server.js to use.
module.exports = router;