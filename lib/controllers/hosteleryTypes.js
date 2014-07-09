var hosteleryTypes =require('../models/hosteleryTypes');

exports.listRestaurantsCategory =function(req,res,next){
	hosteleryTypes.findAll('Restaurante',function (err,restaurantsCategory){
		if(!restaurantsCategory)return res.send(500,err);
		res.json(restaurantsCategory);
	});
};

exports.listPintxosCategory =function(req,res,next){
	hosteleryTypes.findAll('Pintxo',function (err,pintxosCategory){
		if(!pintxosCategory)return res.send(500,err);
		res.json(pintxosCategory);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	restaurantsCategory.findById(id, function (err,category){
		if(!category)return res.send(500,err);
		res.json(category);
	});
};