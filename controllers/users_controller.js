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
            var hbsObject = {
                "userPokemon" : userPokemon,
                "sessionUser" : req.user
            }
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
            var hbsObject = {
                "sessionUser" : req.user,
                "users" : users,
            };
            res.render("allUsers", hbsObject);
        });
    }
});

router.get("/users/similar/:id", serverFile.checkUser, function(req, res){
    var query = "";
    query += "SELECT t3.id, t3.username, t3.email, count(*) as numberOfSimilarPokemon";
    query += " FROM userpokemon AS t1";
    query += " INNER JOIN (SELECT  pokemonNumber FROM userPokemon WHERE userId = :userId) AS t2 ON t1.pokemonNumber = t2.pokemonNumber";
    query += " INNER JOIN users AS t3 ON t1.userId = t3.id";
    query += " WHERE t1.userId <> :userId";
    query += " GROUP BY userId";
    query += " ORDER BY numberOfSimilarPokemon DESC";
    db.sequelize.query(query, {
        replacements : {
            userId : req.params.id
        },
        type: db.sequelize.QueryTypes.SELECT
    }).then(function(data){
        var hbsObject = {
            sessionUser : req.user,
            trainers : data
        };
        res.render("similarUsers", hbsObject);
    });
});

// Export routes for server.js to use.
module.exports = router;