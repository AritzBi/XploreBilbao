var buildingTypes =require('../models/buildingTypes');

exports.list =function(req,res,next){
	buildingTypes.findAll(function (err,buildingTypes){
		if(!buildingTypes)return res.send(500,err);
		res.json(buildingTypes);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	buildingTypes.findById(id, function (err,type){
		if(!type)return res.send(500,err);
		res.json(type);
	});
};