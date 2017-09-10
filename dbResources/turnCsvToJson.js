var fs = require("fs");
var path = require("path");

module.exports = function(fileName){
    var data = fs.readFileSync(fileName, 'utf8');
    if(data){
        var seeds = [];
        var nameOfCols = [];
        var lineCounter = 0;
        var recordIndex = 0;
        var word = "";
        var myObj = {};
        for(var i = 0; i < data.length; i++){
            if(lineCounter === 0){
                if(data[i] === ','){
                    nameOfCols.push(word);
                    word = "";
                } else if(data[i] === "\n") {
                    lineCounter++;
                    word="";
                } else {
                    word += data[i];
                }
            } else {
                if(data[i] === ','){
                    var numberVal = parseFloat(word);
                    if(numberVal){
                        word = numberVal;
                    } else {
                        switch(word.toLowerCase()){
                            case "":
                                word = null;
                                break;
                            case "true":
                                word = true;
                                break;
                            case "false":
                                word = false;
                                break;
                        }
                    }
                    myObj[(nameOfCols[recordIndex])] = word;
                    word = "";
                    recordIndex++;
                } else if(data[i] === "\n") {
                    seeds.push(myObj);
                    myObj = {};
                    lineCounter++;
                    recordIndex = 0;
                    word="";
                } else {
                    word += data[i];
                }
            }
        }
        var myJSON = JSON.stringify(seeds);
        var outputFile = Date.now() +  "_" + path.parse(fileName).name + ".json";
        fs.writeFile(path.join(__dirname, "output", outputFile), myJSON, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }
    
};