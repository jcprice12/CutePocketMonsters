var fs = require("fs");
var path = require("path");

function convertWord(word){
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
    return word;
}

module.exports = function(fileName){
    var promise = new Promise(function(resolve, reject){
        var data = fs.readFileSync(path.join(__dirname,fileName), 'utf8');
        var seeds = [];
        if(data){
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
                        nameOfCols.push(word);
                        lineCounter++;
                        word="";
                    } else {
                        word += data[i];
                    }
                } else {
                    if(data[i] === ','){
                        myObj[(nameOfCols[recordIndex])] = convertWord(word);
                        word = "";
                        recordIndex++;
                    } else if(data[i] === "\n") {
                        myObj[(nameOfCols[recordIndex])] = convertWord(word);
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
        }
        resolve(seeds);
    });
    return promise;
    
};