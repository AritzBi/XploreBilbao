var event=require('../models/events');

exports.list =function(req,res,next){
	event.findAll(function (err,events){
		if(!events)return res.send(500,err);
		res.json(events);
	});
};

exports.getEventsByType =function(req,res,next){
	var id=req.params.id2;
	console.log(id);
	event.findByType(function (err,events){
		if(!events)return res.send(500,err);
		res.json(events);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	event.findById(id, function (err,event){
		if(!event)return res.send(500,err);
		res.json(pintxo);
	});
};