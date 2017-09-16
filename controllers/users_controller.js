var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
var password_hash = require("password-hash");
// Import models
var db = require("../models");

/**
 * hashes a password given and returns a hashed string with a 16 bit salt attached to it
 * @param {string} pass
 * @return {string}
 */
function hashPassword(pass){
    var hash = password_hash.generate(pass, {
        algorithm : 'sha256',
        saltLength : 16,
    });
    return hash;
}

/**
 * Gets one user for an id and returns all pokemon associated with it
 * @param {number} userId 
 * @return {promise}
 */
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

/**
 * Gets one user and attaches all of that users starters
 * @param {number} userId 
 * @return {promise}
 */
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

/**
 * Gets one user and all of the associated non-starters
 * @param {number} userId 
 * @return {promise}
 */
var getNonStarters = function(userId){
    var promise = db.User.findOne({
        where : {
            "id" : userId
        },
        include : {
            model : db.Pokemon,
            through : {
                where : {
                    starting : false
                },
                attributes : ['pokemonNumber', 'starting']
            }
        } 
    });
    return promise;
}

/**
 * Gets the 6 most recent pokemon created in the UserPokemon table for the user id given 
 * @param {number} userId 
 * @return {promise}
 */
var getMostRecent = function(userId){
    var query = "";
    query += "SELECT *";
    query += " FROM UserPokemon";
    query += " INNER JOIN `Pokemon` ON pokemonNumber = Number";
    query += " WHERE userId = :userId";
    query += " ORDER BY createdAt DESC";
    query += " LIMIT 6";
    var promise = db.sequelize.query(query, {
        replacements : {
            "userId" : userId
        },
        type: db.sequelize.QueryTypes.SELECT
    });
    return promise;
}

//route for similar users to the id of the user given
router.get("/users/similar/:id", serverFile.checkUser, function(req, res){
    var query = "";
    query += "SELECT t3.id, t3.username, t3.email, count(*) as numberOfSimilarPokemon";
    query += " FROM `UserPokemon` AS t1";
    query += " INNER JOIN (SELECT  pokemonNumber FROM `UserPokemon` WHERE userId = :userId) AS t2 ON t1.pokemonNumber = t2.pokemonNumber";
    query += " INNER JOIN `Users` AS t3 ON t1.userId = t3.id";
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
            similarTrainers : data,
            lookupSimilar : "true"
        };
        res.render("allUsers", hbsObject);
    });
});

//route to get the edit user page
router.get("/users/edit", serverFile.checkUser, function(req, res){
    getUserAndPokemon(req.user.dataValues.id).then(function(userPokemon){
        var hbsObject = {
            "userPokemon" : userPokemon,
            "sessionUser" : req.user
        }
        res.render("editUser", hbsObject);
    });
});

//route to edit the user (put data)
//put is handled with a transaction to allow rollback
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
         console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
         console.log(userId);
         var getStartersPromise = getStarters(userId);
         var getNonStartersPromise = getNonStarters(userId);
         var getMostRecentPromise = getMostRecent(userId);
         promises.push(getStartersPromise);
         promises.push(getNonStartersPromise);
         promises.push(getMostRecentPromise)
         Promise.all(promises).then(function(result){
             var userStarters = result[0];
             console.log("******************************************");
             console.log(userStarters);
             var userNonStarters = result[1];
             console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
             console.log(userNonStarters);
             var userMostRecent = result[2];
             console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
             console.log(userMostRecent);
             var hbsObject = {
                "sessionUser" : req.user,
                "userStarters": userStarters,
                "userNonStarters" : userNonStarters,
                "userMostRecent" : userMostRecent
             }
             res.render("backpack", hbsObject);
         }).catch( function(err){
             console.log("Error while getting user information");
             console.log(err);
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