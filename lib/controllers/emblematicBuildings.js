var emblematicBuildings =require('../models/emblematicBuildings');

exports.list =function(req,res,next){
	emblematicBuildings.findAll(function (err,emblematicBuildings){
		if(!emblematicBuildings)return res.send(500,err);
		res.json(emblematicBuildings);
	});
};

exports.getMuseums =function(req,res,next){
	console.log("por el controller");
	emblematicBuildings.findMuseums(function (err,museums){
		if(!museums)return res.send(500,err);
		res.json(museums);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	emblematicBuildings.findById(id, function (err,building){
		if(!building)return res.send(500,err);
		res.json(building);
	});
};


exports.getInfo =function(id,cb){
	emblematicBuildings.findByIdGeoJson(id, function (err,building){
		if(!building) cb(err,null);
		cb(null, building);
	});
};

exports.getInfoWithoutDetails =function(id,cb){
	emblematicBuildings.findByIdGeoJsonWithoutDetails(id, function (err,building){
		if(!building) cb(err,null);
		cb(null, building);
	});
};

exports.getNote =function(id,cb){
	emblematicBuildings.findNoteById(id, function (err,note){
		if(!note) cb(err,null);
		cb(null, note);
	});
};