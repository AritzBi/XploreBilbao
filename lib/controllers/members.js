var db=require('../models');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(username,password,done){
		db.Member.find({username: username}).successÇ(function(user){
			if(!member)
				res.json({"success":false});
			auth.hash( password, user.salt, function (err, hash) {    
	            if (err) { return done(err); }
	            if (hash == user.hash)
	            	return done(null, user);
	            done(null, false, { message: 'Incorrect password.' });
       		});
		});
}));

 
exports.login = function(req, res){
 	passport.authenticate('local', function(err ,user, params){
 		if(err)
 			res.json({"success":false, "result":err.message});
 		if(!user)
 			res.json({"success":false, "result": params.message})
 		req.session.user=user.username
 		res.json({"success":true, "result":user})
	})(req, res);
};

exports.signUp = function(req,res){
	form=req.body;
	auth.hash(form.password, function(err,salt, hash){
		if(err)
			return res.json({"success":false,"result":err.message});
		form.salt=salt;
		form.hash=hash;
		db.member.create(form, function(err,user){
			if(err){
				res.json({"success":false,"result":err.message});
			}
			else{
				req.session.user=user.username;
				res.json({"success":true, "result":user});
			}
		});
	});
};

exports.logout = function(req,res){
	delete req.session.user;
	res.json({"success": true});
};

passport.serializeUser=function(user, done){
	done(null, user);
};

passport.deserializeUser=function(obj, done){
	done(null, obj);
};


exports.showAll =function(){
	db.Member.findAll().success(function (users){
		console.log(users);
	});
};