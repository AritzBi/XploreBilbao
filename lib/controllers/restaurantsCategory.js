var restaurantsCategory =require('../models/restaurantsCategory');

exports.list =function(req,res,next){
	restaurantsCategory.findAll(function (err,restaurantsCategory){
		if(!restaurantsCategory)return res.send(500,err);
		res.json(restaurantsCategory);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	restaurantsCategory.findById(id, function (err,category){
		console.log(err);
		if(!category)return res.send(500,err);
		res.json(category);
	});
};