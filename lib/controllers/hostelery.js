var hostelery =require('../models/hostelery');

exports.listPintxos =function(req,res,next){
	hostelery.findAll('Pintxo',function (err,pintxos){
		if(!pintxos)return res.send(500,err);
		res.json(pintxos);
	});
};

exports.listRestaurants =function(req,res,next){
	hostelery.findAll('Restaurante',function (err,restaurants){
		if(!restaurants)return res.send(500,err);
		res.json(restaurants);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	hostelery.findById(id, function (err,hostelery){
		if(!hostelery)return res.send(500,err);
		res.json(hostelery);
	});
};