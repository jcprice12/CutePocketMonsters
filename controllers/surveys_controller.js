var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var surveyHelper = require("../utilities/surveyHelper.js");
// Import models
var db = require("../models");

router.get("/survey", serverFile.checkUser, function(req, res) {
    var hbsObject = {
        "sessionUser" : req.user,
    };
    res.render("survey", hbsObject);
});

router.post("/survey", serverFile.checkUser, function(req, res) {
    var qValArr = req.body.arr
    var whereCond = surveyHelper.compileQuery(qValArr);
    console.log("Test: " + JSON.stringify(whereCond, null, 2));
    db.Pokemon.findAll(whereCond).then(function(pokemonSet){
        //console.log(pokemonSet);
        var counter = 0;
        var myPokemon = [];
        var tempIndex;
        while(counter < 6){
            if(pokemonSet.length > 0){
                tempIndex = Math.floor(Math.random() * pokemonSet.length);
                myPokemon.push(pokemonSet[tempIndex].dataValues.Number);
                pokemonSet.splice(tempIndex,1);
                counter++;
            } else {
                break;
            }
        }
        console.log(myPokemon);
        //res.redirect("/users/" + req.user.dataValues.id);
        res.end();
    }).catch(function(err){
        console.log(err);
        res.end();
    });
});

// Export routes for server.js to use.
module.exports = router;