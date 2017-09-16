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
    .wait(1000)
    .click("a[href = '/survey']")
    .wait(1000)
    .click("#qr1-1")
    .wait(500)
    .click("#qr2-1")
    .wait(500)
    .click("#qr3-7")
    .wait(500)
    .click("#qr4-1")
    .wait(500)
    .click("#qr5-2")
    .wait(500)
    .click("#qr6-1")
    .wait(500)
    .click("#qr7-1")
    .wait(500)
    .click("#qr8-1")
    .wait(500)
    .click("#surveySubmit")
    .wait(5000)
    .end()
    .then(function(result){
        console.log(result)
    })