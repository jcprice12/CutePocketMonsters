var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
// Import models
var db = require("../models");

router.get("/users/:id", serverFile.checkUser, function(req, res) {
    db.User.findOne({
        where : {
            "id" : req.params.id
        },
        include : {
            model : db.Pokemon,
            through : {
                attributes : ['pokemonNumber']
            } 
        }
    }).then(function(userPokemon){
        var hbsObject = userPokemon;
        res.render("backpack", hbsObject);
    });
});

// Export routes for server.js to use.
module.exports = router;