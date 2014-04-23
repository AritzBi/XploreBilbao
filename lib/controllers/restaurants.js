var restaurant =require('../models/restaurants');

exports.list =function(req,res,next){
	restaurant.findAll(function (err,restaurants){
		if(!restaurants)return res.send(500,err);
		res.json(restaurants);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	restaurant.findById(id, function (err,restaurant){
		console.log(err);
		if(!restaurant)return res.send(500,err);
		res.json(restaurant);
	});
};