var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended:false})
var test = require('../connect.js');
test.conec("Login");



router.get('/test', function(req, res, next) {  
    res.render("test");
    test.findAll("account")
  });

  module.exports = router;