var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var passport = require('passport');

// bring in models
var UserTB = require('../models/user_model');

router.get('/register', function (req, res) {
    res.render('register');
});

// add user
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    req.checkBody('password2','Confirm password is required').notEmpty;
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is no valid').isEmail();

    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
          errors:errors
        });
    }else{
        let newUser = new UserTB({
          name:name,
          email:email,
          username:username,
          password:password
        });
    
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    req.flash('success','You are now registered and can log in');
                    res.redirect('/user/login');
                }
                });
            });
        });
    }
});

// login
router.get('/login', function(req, res){
    res.render('login');
});

// login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/user/login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/user/login');
});
module.exports = router;