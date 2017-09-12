var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
// Import models
var db = require("../models");

router.get("/survey", serverFile.checkUser, function(req, res) {
    var hbsObject = {
        "sessionUser" : req.user,
    };
    res.render("survey", hbsObject);
});

router.post("/survey", serverFile.checkUser, function(req, res) {
    res.redirect("/users/" + req.user.dataValues.id);
});

// Export routes for server.js to use.
module.exports = router;