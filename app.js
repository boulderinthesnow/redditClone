var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    session = require("cookie-session"),
    morgan = require("morgan"),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper");

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

//************************ USER ************************//

app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.redirect('/posts');
});

app.get("/login", function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});

app.get("/users/new", function(req, res) {
  res.render("users/new")
  // PUT LINK FROM POSTS TO THIS PATH
  // FORM TO CREATE USER
})



app.post("/users", function(req, res) {
    db.User.create(req.body.user, function (err, user) {
    console.log(err, "THIS IS AN ERROR")
      if (err) {
        res.render("users/new");
      } else {
        res.redirect("/posts/:user_id/posts");
        // PATH /POSTS SHOULD RENDER ALL THE POSTS
      }
  });
 
})




app.get("/users/:id", function(req,res){
    db.Model.findById(req.params.id, function(err, user){
    if(err){
      res.render("errors/404");
    } else {
      res.render('users/show', {user:user});
    }
  })
});

app.get("/users/:id/edit", function(req,res){
  db.Model.findById(req.params.id, function(err, data){
    if(err){
      res.render("errors/404");
    } else {
      res.render('edit', {data:data});
    }
  })
});

app.put("/users/:id", function(req, res) {
  db.Model.findByIdAndUpdate(req.params.id, req.body.change,  function(err, data){
    if(err){
      res.render("404");
    } else{
      res.redirect('/users');
    }
 })
});

app.delete("/users/:id", function(req, res) {
  db.Model.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.render("404");
    } else{
      res.redirect('/users');
    }
  })
})

app.get("/posts", routeMiddleware.ensureLoggedIn, function(req, res) {
	db.Post.find({}, function (err, posts) {
		if(err){
		  res.render("404");
		} else {
		  res.render('posts/index', {posts:posts});
		}
	}
)})

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});


app.get('*', function(req,res){
  res.render('errors/404');
});


app.listen(3000, function(){
  console.log("Server is listening on port 3000");
}); 
 