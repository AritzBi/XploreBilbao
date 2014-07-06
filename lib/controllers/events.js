var event=require('../models/events');

exports.list =function(req,res,next){
	event.findAll(function (err,events){
		if(!events)return res.send(500,err);
		res.json(events);
	});
};

exports.getEventsByType =function(req,res,next){
	var id=req.params.id2;
	event.getEventsByType(id,function (err,events){
		if(!events)return res.send(500,err);
		res.json(events);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	event.findById(id, function (err,event){
		if(!event)return res.send(500,err);
		res.json(event);
	});
};

exports.getInfo =function(id,cb){
	event.findByIdGeoJson(id, function (err,event){
		if(!event) cb(err,null);
		cb(null, event);
	});
};

exports.getInfoWithoutDetails =function(id,cb){
	console.log(id);
	event.findByIdGeoJsonWithoutDetails(id, function (err,event){
		if(!event) cb(err,null);
		cb(null, event);
	});
};