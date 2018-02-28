const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/contribuStoryDB')

const app = express();

app.set('view engine', 'ejs');

app.use(require("express-session")({
  secret: "I hope to god that this works",
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================
//ROUTES

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/secret', isLoggedIn, (req, res) => {
  res.render("secret")
})

//AUTH ROUTES

//show the signup form
app.get('/register', (req, res) => {
  res.render('register');
});

//register a new user
app.post('/register', (req, res) => {

  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/secret');
    });
  });
});

//LOGIN ROUTES
//render login Form
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}) ,(req, res) => {

});

//LOGOUT
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


app.listen(process.env.PORT || 8080, function(){
  console.log('server started');
});
