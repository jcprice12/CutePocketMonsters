var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
// Import models
var db = require("../models");

router.get("/users/:id?", serverFile.checkUser, function(req, res) {
    if(req.params.id){
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
    } else {
        db.User.findAll({
            attributes : ["id", "username", "email", [db.sequelize.fn('COUNT', db.sequelize.col('Number')), 'number_of_pokemon']],
            include : {
                model : db.Pokemon,
                attributes : ["Number"],
                through : {
                    attributes : ["pokemonNumber"]
                }
            },
            group : ["id"]
        }).then(function(users){
            //console.log(users);
            console.log(req.user);
            var hbsObject = {
                "sessionUser" : req.user,
                "users" : users,
            };
            res.render("allUsers", hbsObject);
        });
    }
});

// Export routes for server.js to use.
module.exports = router;