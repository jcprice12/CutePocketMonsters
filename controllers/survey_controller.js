var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
// Import models
var db = require("../models");

var qValArr = ["t", "f", "Red", "t", "mix", "f", "people", "t"]

function compileQuery(qValArr){
    var query = {};
    console.log(JSON.stringify(query, null, 2));
    console.log("============");
    
    query.where = {};
    console.log(JSON.stringify(query, null, 2));
    console.log("============");

    query.where.$or = [];
    console.log(JSON.stringify(query, null, 2));
    console.log("============");
    
    query.where.$or.push({ 
        $and : [] 
    });
    console.log(JSON.stringify(query, null, 2));
    console.log("============");
    for (var j = 0; j < qValArr.length; j++ ){
        switch (j) {
            // "The best defense is a good offense"
            case 0:
                if (qValArr[0] === "t"){
                    query.where.$or[0].$and.push({ 
                        $or: [
                            { 
                                Attack: {
                                    $gte: 50
                                }
                            },
                            {
                                Sp_Atk: {
                                    $gte: 50
                                }
                            }
                        ]
                    });

                } else {
                    query.where.$or[0].$and.push({ 
                        $or: [
                            { 
                                Defense: {
                                    $gte: 50
                                }
                            },
                            {
                                Sp_Def: {
                                    $gte: 50
                                }
                            }
                        ]
                    });
                }
            console.log("==========================")
            console.log("After First: " + JSON.stringify(query, null, 2))
            break;
            // "Slow and steady wins the race"
            case 1:
                if (qValArr[1] === "t"){
                    query.where.$or[0].$and.push({
                        Speed: {
                            $lte : 82
                        }

                    })
                } else {
                    query.where.$or[0].$and.push({
                        Speed: {
                            $gt: 82
                        } 
                    })
                }
                console.log("==========================")
                console.log("After Second: " + JSON.stringify(query, null, 2))
            break;
            // Normal stuff vs mythic stuff
            case 2:
                if (qValArr[2] === "t"){
                    query.where.$or[0].$and.push({
                       $or: [
                            {
                                Type_1: "Normal"
                            },
                            {
                                Type_1: "Fighting"
                            },
                            {
                                Type_1: "Flying"
                            },
                            {
                                Type_1: "Ground"
                            },
                            {
                                Type_1: "Rock"
                            },
                            {
                                Type_1: "Bug"
                            },
                            {
                                Type_1: "Ghost"
                            },
                            {
                                Type_1: "Poison"
                            },
                            {
                                Type_1: "Steel"
                            }
                       ]
                    })                
                } else {
                    query.where.$or[0].$and.push({
                        $or: [
                                {
                                    Type_1: "Fire"
                                },
                                {
                                    Type_1: "Water"
                                },
                                {
                                    Type_1: "Grass"
                                },
                                {
                                    Type_1: "Ice"
                                },
                                {
                                    Type_1: "Electric"
                                },
                                {
                                    Type_1: "Psychic"
                                },
                                {
                                    Type_1: "Dark"
                                },
                                {
                                    Type_1: "Dragon"
                                },
                                {
                                    Type_1: "Fairy"
                                }
                        ]
                    })                
                }
                console.log("==========================")
                console.log("After Third: " + JSON.stringify(query, null, 2))
            break;
            // Pick Favorite Color
            case 3:
                switch (qValArr[3]){
                    case "Blue":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Blue"
                                },
                                {
                                    Color: "White"
                                },
                                {
                                    Color: "Green"
                                },
                                {
                                    Color: "Purple"
                                }
                            ]
                        })
                    break;

                    case "Green":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Green"
                                },
                                {
                                    Color: "Blue"
                                },
                                {
                                    Color: "Yellow"
                                },
                                {
                                    Color: "Brown"
                                }
                            ]
                        })
                    break;

                    case "White":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "White"
                                },
                                {
                                    Color: "Blue"
                                },
                                {
                                    Color: "Green"
                                },
                                {
                                    Color: "Red"
                                }
                            ]
                        })
                    break;

                    case "Red":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Red"
                                },
                                {
                                    Color: "Pink"
                                },
                                {
                                    Color: "Brown"
                                },
                                {
                                    Color: "Purple"
                                }
                            ]
                        })
                    break;

                    case "Black":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Black"
                                },
                                {
                                    Color: "White"
                                },
                                {
                                    Color: "Grey"
                                },
                                {
                                    Color: "Red"
                                }
                            ]
                        })
                    break;

                    case "Grey":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Grey"
                                },
                                {
                                    Color: "Blue"
                                },
                                {
                                    Color: "Black"
                                },
                                {
                                    Color: "Red"
                                }
                            ]
                        })
                    break;

                    case "Purple":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Purple"
                                },
                                {
                                    Color: "Blue"
                                },
                                {
                                    Color: "Red"
                                },
                                {
                                    Color: "Pink"
                                }
                            ]
                        })
                    break;

                    case "Brown":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Brown"
                                },
                                {
                                    Color: "Yellow"
                                },
                                {
                                    Color: "Red"
                                },
                                {
                                    Color: "Green"
                                }
                            ]
                        })
                    break;

                    case "Yellow":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Yellow"
                                },
                                {
                                    Color: "White"
                                },
                                {
                                    Color: "Green"
                                },
                                {
                                    Color: "Brown"
                                }
                            ]
                        })
                    break;

                    case "Pink":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Color: "Pink"
                                },
                                {
                                    Color: "White"
                                },
                                {
                                    Color: "Red"
                                },
                                {
                                    Color: "Purple"
                                }
                            ]
                        })
                    console.log("==========================")
                    console.log("After Fourth: " + JSON.stringify(query, null, 2))
                    break;
                }
            // Hugs and weight
            case 4: 
                if (qValArr[4] === "t"){
                    query.where.$or[0].$and.push({
                        Weight_kg: {
                            $lte: 25
                        }
                    })
                } else {
                    query.where.$or[0].$and.push({
                        Weight_kg: {
                            $gt: 25
                        }
                    }) 
                }
                console.log("==========================")
                console.log("After Fifth: " + JSON.stringify(query, null, 2))
            break;
            // Old vs New
            case 5: 
            if (qValArr[5] === "old"){
                query.where.$or[0].$and.push({
                    $or: [
                        {
                            Generation: 1
                        },
                        {
                            Generation: 2
                        },
                        {
                            Generation: 3
                        }
                    ]
                })
            } else if (qValArr[5] === "new"){
                query.where.$or[0].$and.push({
                    $or: [
                        {
                            Generation: 4
                        },
                        {
                            Generation: 5
                        },
                        {
                            Generation: 6
                        }
                    ]
                })    
            } else {
                query.where.$or[0].$and.push({
                    $or: [
                        {
                            Generation: 1
                        },
                        {
                            Generation: 2
                        },
                        {
                            Generation: 3
                        },
                        {
                            Generation: 4
                        },
                        {
                            Generation: 5
                        },
                        {
                            Generation: 6
                        }
                    ]
                })
            }
            console.log("==========================")
            console.log("After Sixth: " + JSON.stringify(query, null, 2))
            break;     

            case 6:
                switch (qValArr[6]){
                    case "comp":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Body_Style: "two_wings"
                                },
                                {
                                    Body_Style: "four_wings"
                                },
                                {
                                    Body_Style: "quadruped"
                                }
                            ]
                        })
                    break;

                    case "exotic":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Body_Style: "head_arms"
                                },
                                {
                                    Body_Style: "head_body"
                                },
                                {
                                    Body_Style: "head_legs"
                                },
                                {
                                    Body_Style: "head_only"
                                },
                                {
                                    Body_Style: "insectoid"
                                },
                                {
                                    Body_Style: "several_limbs"
                                },
                                {
                                    Body_Style: "multiple_bodies"
                                },
                                {
                                    Body_Style: "serpentine"
                                },
                                {
                                    Body_Style: "with_fins"
                                },
                            ]
                        })
                    break;

                    case "people":
                        query.where.$or[0].$and.push({
                            $or: [
                                {
                                    Body_Style: "two_wings"
                                },
                                {
                                    Body_Style: "quadruped"
                                },
                                {
                                    Body_Style: "bipedal_tailed"
                                },
                                {
                                    Body_Style: "bipedal_tailess"
                                }
                            ]
                        })
                    break;
                }
                console.log("==========================")
                console.log("After Seventh: " + JSON.stringify(query, null, 2))
            break;
            
            case 7: 
                if (qValArr[7] === "t"){
                    query.where.$or.push({
                        isLegendary: 1
                    })
                    
                }
                console.log("==========================")
                console.log("After Eigth: " + JSON.stringify(query, null, 2))
            break;

            default:
                console.log('Whoops, something went wrong when the index was ' + j)
            break;
        }
    };
    return query
}

var test = compileQuery(qValArr)

console.log("Test: " + JSON.stringify(test, null, 2));