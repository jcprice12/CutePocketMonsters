var express = require("express");
var router = express.Router();

// Import models
var db = require("../models");

//route for main page (home page)
router.get("/", function(req, res) {
    res.end();
});

// Export routes for server.js to use.
module.exports = router;