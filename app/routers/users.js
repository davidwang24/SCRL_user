const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// bring in user model
var User = require('../models/user');

// register form
router.get('/register', function(req, res) {
 res.render('register');
});

// Register Proccess
router.post('/register', function(req, res) {
 const name = req.body.name;
 const email = req.body.email;
 const username = req.body.username;
 const password = req.body.password;
 const password2 = req.body.password2;
 const message = '';

 req.checkBody('name', 'Name is required').notEmpty();
 req.checkBody('email', 'Email is required').notEmpty();
 req.checkBody('email', 'Email is not valid').isEmail();
 req.checkBody('username', 'Username is required').notEmpty();
 req.checkBody('password', 'Password is required').notEmpty();
 req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

 let errors = req.validationErrors();

 if (errors) {
  res.render('register', {
   errors: errors
  });
 } else {
  let newUser = new User({
   stage: 0,
   name: name,
   email: email,
   username: username,
   password: password,
   message: message
  });

  bcrypt.genSalt(10, function(err, salt) {
   bcrypt.hash(newUser.password, salt, function(err, hash) {
    if (err) {
     console.log(err);
    }
    newUser.password = hash;
    newUser.save(function(err) {
     if (err) {
      console.log(err);
      return;
     } else {
      req.flash('success', 'You are now registered and can log in');
      res.redirect('/users/login');
     }
    });
   });
  });
 }
});

// login form
router.get('/login', function(req, res) {
 res.render('login');
});

// login process
router.post('/login', function(req, res, next) {
 passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
 })(req, res, next);
});

// logout
router.get('/logout', function(req, res) {
 req.logout();
 req.flash('success', 'You are logged out');
 res.redirect('/users/login');
});

module.exports = router;