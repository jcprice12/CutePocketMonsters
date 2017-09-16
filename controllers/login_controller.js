var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var password_hash = require("password-hash");
// Import models
var db = require("../models");

/**
 * Hash the password given. Adds a 16 bit salt to it. Uses sha256 as the hashing algorithm
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

//route for login page
router.get("/login", function(req, res) {
    var hbsObject = {message:req.flash('error')}
    res.render("login", hbsObject);
});

//route to post the login. passport authentication middleware is used
router.post("/login", serverFile.getPassport().authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid login credentials'}), function(req, res) {
    var id = req.user.dataValues.id;
    //get pokemon if pokemon exist, redirect to the backpack page. Else, go to the survey
    db.User.findOne({
        where : {
            "id" : id
        },
        include : {
            model : db.Pokemon,
            through : {
                attributes : ['pokemonNumber']
            } 
        }
    }).then(function(userPokemon){
        if(userPokemon.Pokemons && userPokemon.Pokemons.length > 0){
            console.log("I have pokemon");
            res.redirect("/users/" + id);
        } else {
            console.log("I don't have pokemon");
            res.redirect("/survey");
        }
    }).catch(function(err){
        console.log(err);
        res.redirect('/');
    });
});

//route to get the logout. Simply routes to the home page
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//route to get the register page
router.get("/register", function(req, res){
    var hbsObject = {}
    res.render("register", hbsObject);
});

//route to post a new user from the register page
router.post("/register", function(req, res){
    if(req.body.password.length < 4){
        return res.json({"redirect": '/register'});
    }
    req.body.password = hashPassword(req.body.password);
    if(req.body.username.length < 4){
        return res.json({"redirect": '/register'});
    }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(req.body.email)){
        return res.json({"redirect": '/register'});
    }
    db.User.findOne({
        where : {
            $or : [
                {
                    username : req.body.username
                },
                {
                    email : req.body.email
                }
            ]
        },
    }).then(function(selectRes){
        if(selectRes){
            console.log("username and email already exists");
            res.json({"error" : "Username or email already exists"});
        } else {
            return db.sequelize.transaction(function(t) {//transaction used for rollback
                return db.User.create(req.body, {
                    transaction : t,
                }).then(function(userInserted){
                    req.login(userInserted, function(err) {
                        if(err){
                            throw new Error("Could not log back in " + err);
                        }
                    });
                });
            }).then(function(result){
                console.log("user registered");
                res.json({redirect: '/survey'});
            }).catch(function(err){
                res.json({"error" : "Error registering. Plase try again later"});
            });
        }
    }).catch(function(err){
        return res.json({"error" : "Error determining if username/email already exists. Please try again later."});
    });
});

// Export routes for server.js to use.
module.exports = router;