var Nightmare = require("nightmare");

var nightmare = Nightmare({ show: true });

nightmare
    .goto("htpps://localhost:8080")
    .click("a[href = '/login']")
    .wait("input[name = 'username']")
    .type("input[name = 'username']", "test")
    .type("input[name = 'password']", "password")
    .snapshot("login.png")
    .wait("div #myCarousel")
    .end()
    .then(function(result){
        console.log(result)
    })