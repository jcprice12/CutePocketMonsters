//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");
var db = require("./models");

//variables
var PORT = process.env.PORT || 8080;
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
//use the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Override POST for form submissions (may not be necessary)
app.use(methodOverride("_method"));
//use handlebars as the rendering engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
//set handlebars as the view engine
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/pokemon_controller.js");
//root route is / (all other routes specified by the variable 'routes' will be derived from here)
app.use("/", routes);

//sync the db and start listening for client requests
db.sequelize.sync().then(function() {
    app.listen(PORT, function(){
        console.log("Server listening on port " + PORT);
    });
});