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

var getStarters = function(userId){
    var promise = db.User.findOne({
        where : {
            "id" : userId
        },
        include : {
            model : db.Pokemon,
            through : {
                where : {
                    starting : true
                },
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
        res.render("editUser", hbsObject);
    });
});

router.put("/users/edit", serverFile.checkUser, function(req, res){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(req.body.email)){
        console.log("Invalid Email");
        return res.send({redirect: '/users/edit'});
    }
    if(req.body.starters){
        if(!(req.body.starters.length >= 1 && req.body.starters.length <= 6)){
            console.log("Wrong number of starters");
            return res.send({redirect: '/users/edit'});
        }
    } else {
        console.log("starters is undefined");
        return res.send({redirect: '/users/edit'});
    }
    if(!password_hash.verify(req.body.oldPassword,req.user.dataValues.password)){
        console.log("Wrong password");
        return res.send({error: 'Incorrect Password'});
    }
    var currPassword = req.body.oldPassword;
    if(req.body.newPassword && req.body.newPassword !== ""){
        currPassword = req.body.newPassword;
    }
    return db.sequelize.transaction(function (t) {
        var userInfo = {
            username : req.body.username,
            password : hashPassword(currPassword),
            email : req.body.email,
        };
        return db.User.update(userInfo, {
            where : {
                id : req.user.dataValues.id
            },
            transaction : t
        }).then(function(userUpdateData){
            var noStarters = {
                starting : false
            }
            return db.UserPokemon.update(noStarters, {
                where : {
                    userId : req.user.dataValues.id
                },
                transaction : t
            }).then(function(noStarterUpdateData){
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
                    //intentionally blank
                }).catch(function(err){
                    console.log(err);
                });
            }).catch(function(err){
                console.log(err);
            });
        }).catch(function(err){
            console.log(err);
        });
    }).then(function(result){
        console.log("User information saved");
        req.body.password = currPassword;
        serverFile.getPassport().authenticate('local')(req, res, function () {
            res.send({redirect : ("/users/" + req.user.dataValues.id)});
        });
    }).catch(function(err){
        console.log(err);
    });
});


// This goes to the user's backpack if an ID is specified, else it goes to all users overview
router.get("/users/:id?", serverFile.checkUser, function(req, res, next) {
    
    if(req.params.id){
        if(isNaN(req.params.id)){
            return next();
         }     
         var promises = [];
         var userId = req.params.id;
         var getStartersPromise = getStarters(userId);
         promises.push(getStartersPromise);
         Promise.all(promises).then(function(result){
             var userStarters = result[0];
             var hbsObject = {
                "sessionUser" : req.user,
                "userStarters": userStarters,
             }
             console.log(hbsObject);
             res.render("backpack", hbsObject);
         }).catch( function(err){
             res.status(500).send("Error on the server while getting your information. Please try again later.");
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