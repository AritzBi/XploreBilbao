var emblematicBuildings =require('../models/emblematicBuildings');

exports.list =function(req,res,next){
	emblematicBuildings.findAll(function (err,emblematicBuildings){
		if(!emblematicBuildings)return res.send(500,err);
		res.json(emblematicBuildings);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	emblematicBuildings.findById(id, function (err,building){
		if(!building)return res.send(500,err);
		res.json(building);
	});
};