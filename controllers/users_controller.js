var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
var password_hash = require("password-hash");
// Import models
var db = require("../models");

function hashPassword(pass){
    var hash = password_hash.generate(pass, {
        algorithm : 'sha256',
        saltLength : 16,
    });
    return hash;
}

var getUserAndPokemon = function(userId){
    var promise = db.User.findOne({
        where : {
            "id" : userId
        },
        include : {
            model : db.Pokemon,
            through : {
                attributes : ['pokemonNumber', 'starting']
            }
        } 
    });
    return promise;
}

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
        console.log(data);
        var hbsObject = {
            sessionUser : req.user,
            similarTrainers : data
        };
        res.render("allUsers", hbsObject);
    });
});

router.get("/users/edit", serverFile.checkUser, function(req, res){
    getUserAndPokemon(req.user.dataValues.id).then(function(userPokemon){
        var hbsObject = {
            "userPokemon" : userPokemon,
            "sessionUser" : req.user
        }
        //console.log(hbsObject.userPokemon.dataValues);
        //console.log(hbsObject.userPokemon.dataValues.Pokemons[0].dataValues.UserPokemon.dataValues.starting);
        res.render("editUser", hbsObject);
    });
});

router.put("/users/edit", serverFile.checkUser, function(req, res){
    console.log("USER ***********************");
    console.log(req.user);
    if(!password_hash.verify(req.body.oldPassword,req.user.dataValues.password)){
        req.logout();
        res.send({redirect: '/login'});
    } else {
        return db.sequelize.transaction(function (t) {
            var userInfo = {
                username : req.body.username,
                password : hashPassword(req.body.newPassword),
                email : req.body.email,
            };
            return db.User.update(userInfo, {
                where : {
                    id : req.user.dataValues.id
                },
                transaction : t
            }).then(function(userUpdateData){
                console.log(userUpdateData);
                var noStarters = {
                    starting : false
                }
                return db.UserPokemon.update(noStarters, {
                    where : {
                        userId : req.user.dataValues.id
                    },
                    transaction : t
                }).then(function(noStarterUpdateData){
                    console.log(noStarterUpdateData);
                    console.log(req.body.starters); 
                    return db.UserPokemon.update({starting : true}, {
                        where : {
                            $and : [
                                {
                                    pokemonNumber : {
                                        $in : req.body.starters 
                                    }
                                },
                                {
                                    userId : req.user.dataValues.id   
                                }
                            ]
                        },
                        transaction : t,
                    }).then(function(updateStartersData){
                        console.log(updateStartersData);
                    });
                });
            });
        }).then(function(result){
            console.log(result);
            // passport.authenticate('local')(req.username, res, function () {
            //     res.redirect("/users/" + req.user.dataValues.id);
            // });
            res.send({redirect : ("/users/" + req.user.dataValues.id)});
        }).catch(function(err){
            res.status(500).send("Error updating your information. Please try again later");
        });
    }
});


// This goes to the user's backpack if an ID is specified, else it goes to all users overview
router.get("/users/:id?", serverFile.checkUser, function(req, res, next) {
    
    if(req.params.id){
        if(isNaN(req.params.id)){
            return next();
         }     
        getUserAndPokemon(req.params.id).then(function(userPokemon){

            console.log(userPokemon.dataValues.Pokemons[0].UserPokemon);
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

// Export routes for server.js to use.
module.exports = router;