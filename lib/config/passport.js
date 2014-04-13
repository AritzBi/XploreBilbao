'use strict';

var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth=require('./auth');
var member =require('../models/users');



passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	member.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(username, password, done) {
    member.findByUsername(username, function(err, user) {
     	if (err) return done(err);
      
    	if (!user) {
        	return done(null, false, {
          		message: 'This email is not registered.'
        	});
      	}
	    auth.hash( password, user[0].salt, function (err, hash) {
	        if (err) { return done(err); }
	        if (hash == user[0].hash)
	        	return done(null, user);
	        done(null, false, { message: 'Incorrect password.' });
		});
    });
  }
));
module.exports = passport;