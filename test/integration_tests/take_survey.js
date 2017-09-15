var Nightmare = require("nightmare");

var nightmare = Nightmare({ show: true });

nightmare
    .goto("http://localhost:8080")
    .wait(2000)
    .click("a[href = '/login']")
    .wait("input[name = 'username']")
    .type("input[name = 'username']", "rest")
    .type("input[name = 'password']", "password")
    .screenshot("login.png")
    .click("#submit")
    .wait(2000)
    .end()
    .then(function(result){
        console.log(result)
    })