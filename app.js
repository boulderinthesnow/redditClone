var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    session = require("cookie-session"),
    morgan = require("morgan"),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper"),
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell',
  name: "chocolate chip"
}));

app.use(loginMiddleware);


app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('users/index');
});

app.get('/signup', routeMiddleware.preventLoginSignup ,function(req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/game");
    } else {
      console.log(err);
      
      res.render("users/signup");
    }
  });
});


app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("game/play");
    } else {
      res.render("users/login");
    }
  });
});

app.get('/game', routeMiddleware.ensureLoggedIn, function(req,res){
    db.Model.find({}, function(err,data){
      res.render("game/index", {data: data});
    });
});

app.post('/game', routeMiddleware.ensureLoggedIn, function(req,res){
  var change = new db.Model(req.body.change);
  change.ownerId = req.session.id;
  change.save(function(err,change){
    res.redirect("/game/play.ejs");
  });
});

app.get('/game/new', function(req,res){
  res.render("game/new");
});

app.get('/game/:id/', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Model.findById(req.params.id, function(err,data){
    res.render("game/show", {data:data});
  });
});

app.get('/game/:id/edit', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function(req,res){
  db.Model.findById(req.params.id, function(err,data){
    res.render("game/edit", {data:data});
  });
});

app.put('/game/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Model.findByIdAndUpdate(req.params.id, req.body.change, function(err,data){
    res.redirect('/game');
  });
});

app.delete('/game/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Model.findByIdAndRemove(req.params.id, function(err,data){
    res.redirect('/game');
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req,res){
  res.render('errors/404');
});

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});


// PROCEDURE
        // npm init
        // git init
        //*create folders
        // echo "node_modules" > .gitignore
        //*install all dependencies
        // populate created files (header.ejs, index.js, etc.)
        // git commit 


//*CREATE FOLDERS
    // middleware > loginHelper.js, routeHelper.js
    // models > index.js, /yourmodel.js
    // public > css > style.css || js > script.js || images > logo.png
    // views > errors > 404.ejs || partials > header.ejs, footer.ejs || users > login.ejs, signup.ejs, index.ejs || modelPlural > index.ejs, new.ejs, show.ejs, edit.ejs


//*INSTALL DEPENDENCIES
    // "bcrypt"
    // "body-parser"
    // "cookie-session"
    // "ejs"
    // "express"
    // "method-override"
    // "mongoose"
    // "morgan"


 