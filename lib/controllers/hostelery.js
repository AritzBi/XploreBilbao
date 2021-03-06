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

exports.getInfo =function(id,cb){
	hostelery.findByIdGeoJson(id, function (err,hostelery){
		if(!hostelery) cb(err,null);
		cb(null, hostelery);
	});
};

exports.getInfoWithoutDetails =function(id,cb){
	hostelery.findByIdGeoJsonWithoutDetails(id, function (err,hostelery){
		if(!hostelery) cb(err,null);
		cb(null, hostelery);
	});
};

exports.getNote =function(id,cb){
	hostelery.findNoteById(id, function (err,note){
		if(!note) cb(err,null);
		cb(null, note);
	});
};