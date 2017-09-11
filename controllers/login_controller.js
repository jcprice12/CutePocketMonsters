var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");

// Import models
var db = require("../models");

//route for login page
router.get("/login", function(req, res) {
    var hbsObject = {}
    res.render("login", hbsObject);
});

router.post("/login", serverFile.getPassport().authenticate('local', { failureRedirect: '/login' }), function(req, res) {
      res.redirect('/');
    }
);

// Export routes for server.js to use.
module.exports = router;