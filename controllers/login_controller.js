var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
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

//route for login page
router.get("/login", function(req, res) {
    var hbsObject = {}
    res.render("login", hbsObject);
});

router.post("/login", serverFile.getPassport().authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    var id = req.user.dataValues.id;
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
            res.redirect("/");
        }
    }).catch(function(err){
        console.log(err);
        res.redirect('/');
    });
});

router.get("/register", function(req, res){
    var hbsObject = {}
    res.render("register", hbsObject);
});

router.post("/register", function(req, res){
    req.body.password = hashPassword(req.body.password);
    db.User.create(req.body).then(function(userInserted){
        req.login(userInserted, function(err) {
            if(err){
                console.log(err);
                res.send({redirect: '/register'});
            } else {
                res.send({redirect: '/'});
            }
        });
    });
});

// Export routes for server.js to use.
module.exports = router;