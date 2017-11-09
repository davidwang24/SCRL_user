var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var config = require('../config/database');
var UserTB = require('../models/user_model');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){
        // match username
        let query = {username:username};
        UserTB.findOne(query, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'No user found'});
        }

        // match password
        bcrypt.compare(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
            return done(null, user);
            }else{
            return done(null, false, {message: 'Wrong password'});
            }
        });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserTB.findById(id, function(err, user) {
        done(err, user);
        });
    });
}