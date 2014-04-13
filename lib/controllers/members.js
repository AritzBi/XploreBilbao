var passport=require('passport');
var member =require('../models/users');


exports.create = function (req, res, next) {
  member.createUser(req.body,function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

exports.show = function (req, res, next) {
  var userId = req.params.id;

  member.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.username });
  });
};

exports.changePassword = function(req,res,next){
	var userId= req.user.id;
	var oldPass=String(req.body.oldPassword);
	var newPass=String(req.body.newPassword);
	member.changePassword(userId, function(err){
		if (err) return res.send(400);
		res.send(200);
	});
	
};

exports.me=function(){
	res.json(req.user || null);
};


exports.list =function(){
	db.Member.findAll().success(function (users){
		if(!members)return res.send(500,err);
		res.json(users);
	});
};
/*
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
}));*/

/*
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

exports.changePassword = function(req,res,next){
	var userId= req.user.id;
	var oldPass=String(req.body.oldPassword);
	var newPass=String(req.body.newPassword);
	
};

passport.serializeUser=function(user, done){
	done(null, user);
};

passport.deserializeUser=function(obj, done){
	done(null, obj);
};*/
