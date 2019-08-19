var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended:false})
var pg = require('pg')

var config = {
  user: 'postgres',
  database: 'Login',
  password: '123',
  host: 'localhost',
  port: 5432,
  max: 10,

};
var pool = new pg.Pool(config);


/* GET home page. */

router.get('/', function(req, res, next) {
 if(req.cookies.ten != " " &&req.cookies.mk != " "){
  res.render("index.ejs",{title: "login", show:"hide",user: req.cookies.user,pw: req.cookies.mk})
 }
 else{
    res.render("index.ejs",{title: "login", show:"hide",user: req.cookies.user})
 }
});

router.post('/', function(req, res, next) {
  var remenber = req.body.remember;
  var name = req.body.login;
  var mk = req.body.password;
  console.log("ten: " + name + "pass: " + mk);
  if(remenber == "on")
  {
    res.cookie('user', name);
    res.cookie('mk', mk);
  }
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query("Select * from account where ten = '"+ name +"' and mk ='"+ mk +"' ",function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
      if((result.rows).length == 1){
         res.redirect('http://localhost:3000/listproduct')
      }
      else{
        console.log("sai")
        res.render('index', {title:"login",show :"show",user: req.cookies.user })
      }
    });
  });
});

/* GET product page. */
router.get('/listproduct', function(req, res, next) {
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query('SELECT * FROM product order by id ASC',function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
      //console.log(result.rows[0].ten);
      res.render('listproduct', {danhsach : result });
    });
  });
});


router.get('/edit/:id', function(req, res, next) {
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query("SELECT * FROM product where id ='"+ req.params.id +"'",function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
       res.render('edit',{info: result})
      // res.render('listproduct', {danhsach : result });
    });
  });
 });

 
 router.post('/edit/:id', function(req, res, next) {
  var name = req.body.ten;
  var price = req.body.price;
  var img = req.body.img;
  var ds = req.body.ds;
  
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query("Update product set ten = '"+ name +"',price ='"+ price+"', img = '"+ img +"', description = '" + ds +"' where id =" + req.params.id +" ",function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
      if(result.rowCount ==1 ){
         res.redirect('http://localhost:3000/listproduct')
      }
      else{
        console.log("fail")
      }
    });
  });
});

router.get('/add', function(req, res, next) {
  res.render("add");
 });

 router.post('/add', function(req, res, next) {
  var name = req.body.ten;
  var price = req.body.price;
  var img = req.body.img;
  var ds = req.body.ds;
  
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query("Insert into product(ten, price, img, description) values('"+ name +"','"+ price+"','"+ img +"','" + ds+ "')",function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
      if(result.rowCount ==1 ){
         res.redirect('http://localhost:3000/listproduct')
      }
      else{
        console.log("fail")
      }
    });
  });
});


router.get('/delete/:id', function(req, res, next) {
  pool.connect(function(err,client,done) {
    if(err){
      return console.log('erroe fetching',err);
    }
    client.query("DELETE FROM product where id ='"+ req.params.id +"'",function(err, result) {
      done();
      if(err){
        return console.log('err query',err);
      }
       res.redirect('http://localhost:3000/listproduct')
    });
  });
 });

module.exports = router;
