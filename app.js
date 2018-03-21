const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Story = require('./models/story');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/contribuStoryDB');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

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
//shows the home page
app.get('/', (req, res) => {
  res.render("home");
});
//shows the page with all the stories
app.get('/stories', isLoggedIn, (req, res) => {
  res.render("stories", {username: req.user.username})
});

//adds a path to the stories database to retrieve the stories
app.get('/storiesDB', (req, res) => {
  console.log('storiesDB connected')
  Story
  .find()
  .then(stories => {
    res.json({
      stories: stories.map(story => story.serialize())
    })
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'})
  })
});

app.get('/story/:id', isLoggedIn, (req, res) => {
  res.render("storyId", {storyID: req.params.id})
});

app.post('/stories', (req, res) => {
  Story
    .create({
      title: req.body.title,
      content: req.body.content,
      authors: req.body.authors
    })
    .then(story => res.status(201).redirect('stories'))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/story/:id', (req, res) => {
  //if the author is not listed in the stories allow edit the story by appending the new content.

  Story
  .findById(req.params.id)
  .then
  (story =>
  {
    let author = req.user.username
    let currentContent= story.content;
    let updatedStory = currentContent+" "+ req.body.content;
    if(!story.authors.includes(author)){
      story.authors.push(author);
    }
    story.content = updatedStory;
    story.save((err, story) => {
      if (err) { res.status(500).send(err) } res.status(200).redirect(req.get('referer'));
    });
  });
});

app.delete('/stories/delete', (req, res) => {
  // let user = User.findOne({name: req.user.username});
  // let userID = user._id;
  console.log(req.user._id);
  User.deleteOne({id: req.user._id})
  .then(user => {
    user.save((err, user) => {
      if(err) {res.status(500).send(err)} res.status(200).redirect(req.get('register'))
    });
  })
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
      res.redirect('/stories');
    });
  });
});

//LOGIN ROUTES
//render login Form
app.get("/login", (req, res) => {
  res.render("login");
});

//checks the user database for an already registered user.
app.post("/login", passport.authenticate('local', {
  successRedirect: '/stories',
  failureRedirect: '/login'
}) ,(req, res) => {

});

//LOGOUT
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

//checks to see if the user is currently logged in or not
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


app.listen(process.env.PORT || 8080, function(){
  console.log('server started');
});
