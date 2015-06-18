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

app.get('/signup', function (req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err);
      // TODO - handle errors in ejs!
      res.render("/signup");
    }
  });
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
  db.User.findById(req.params.id, function(err, user){
    if(err){
      res.render("errors/404");
    } else {
      res.render('users/edit', {user:user});
    }
  })
});

app.put("/users/:id", function(req, res) {
  db.User.findByIdAndUpdate(req.params.id, req.body.user,  function(err, user){
    if(err){
      res.render("404");
    } else{
      res.redirect('/posts');
    }
 })
});

app.delete("/users/:id", function(req, res) {
  db.Model.findByIdAndRemove(req.params.id, function(err, user){
    if(err){
      res.render("404");
    } else{
      res.redirect('/users');
    }
  })
})

app.get("/posts", routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.session.id,function(err,user){
      db.Post.find({}, function(err, posts){
        if(err){
          res.render("errors/404");
        } else {
          res.render('posts/index', {posts:posts, user:user});
        }
      })    
  })
}); 

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

//************************ POSTS ************************//


app.get("/posts/new", function(req, res) {
  res.render("posts/new")
})

app.post("/posts", function(req, res) {
    db.Post.create(req.body.post, function (err, post) {
      if (err) {
        res.render("errors/page");
      } else {
        res.redirect("/posts");
      }
  });
})

// app.get("/main/:id", function(req,res){
//     db.Model.findById(req.params.id, function(err, data){
//     if(err){
//       res.render("errors/404");
//     } else {
//       res.render('show', {data:data});
//     }
//   })
// });

app.get("/posts/:id/edit", function(req,res){
  db.Post.findById(req.params.id, function(err, post){
    if(err){
      res.render("errors/404");
    } else {
      res.render('posts/edit', {post:post});
    }
  })
});

app.put("/posts/:id", function(req, res) {
  db.Post.findByIdAndUpdate(req.params.id, req.body.post,  function(err, post){
    if(err){
      res.render("404");
    } else{
      res.redirect('/posts');
    }
 })
});

app.delete("/posts/:id", function (req, res) {
  db.Post.findByIdAndRemove(req.params.id, function (err, post){
    if(err){
      res.render("404");
    } else{
      res.redirect('/posts');
    }
  })
})

//*******************************************//


app.get('*', function (req,res){
  res.render('errors/404');
});


app.listen(3000, function (){
  console.log("Server is listening on port 3000");
}); 
 