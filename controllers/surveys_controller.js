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

    db.Pokemon.findAll(whereCond)
    .then(function(pokemonSet){
        //console.log(pokemonSet);
        var counter = 0;
        var myPokemon = [];
        var tempIndex;
        while(counter < 6){
            if(pokemonSet.length > 0){
                tempIndex = Math.floor(Math.random() * pokemonSet.length);
                //Below is the code to just push the Pokemon ID
                    pokemonNumber : pokemonSet[tempIndex].dataValues.Number,
                    userId : req.user.dataValues.id
                };
                myPokemon.push(myObj);
                // This is the code to push the whole pokemon object at index [tempIndex]
        db.UserPokemon.bulkCreate(myPokemon, {
            ignoreDuplicates: true,
        }).then(function(data){
            console.log(data);
            res.send({
                redirect : ("/users/" + req.user.dataValues.id),
            });
        }).catch(function(err){
            console.log(err);
            res.send({
                redirect : ("/survey"),
            });
        });
    }).catch(function(err){
        console.log(err);
        res.send({
            redirect : ("/survey"),
        });
    });
});

// Export routes for server.js to use.
module.exports = router;