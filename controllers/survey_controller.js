var express = require("express");
var router = express.Router();
var serverFile = require("../server.js");
var connectEnsureLogin = require("connect-ensure-login");
// Import models
var db = require("../models");

