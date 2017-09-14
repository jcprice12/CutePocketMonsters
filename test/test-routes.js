var Nightmare = require("nightmare");
var expect = require("chai").expect;
var path = require("path");

describe("Login Stuff", function() {
    describe("Get To Login", function(){

        this.timeout(30000);
        it("Should go to the login page from the home page", function(done){
            Nightmare({ show: true })
            .goto("http://localhost:8080/")
            .wait("#loginLink")
            .click("a[href='/login']")
            .wait("#loginForm")
            .screenshot(path.join(__dirname, "screenshots", (Date.now() + "-login.png")))
            .end()
            .then(function(result){
                var imDone = "I'm done!";
                expect(imDone).to.equal("I'm done!");
                done();
            }).catch(function(err){
                console.log(err);
            });
        });
    });
});