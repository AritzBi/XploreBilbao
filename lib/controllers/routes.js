var routes =require('../models/routes');

exports.getSubwayLines =function(req,res,next){
	routes.getSubwayLines(function (err,subwayLines){
		if(!subwayLines)return res.send(500,err);
		res.json(subwayLines);
	});
};

exports.getSubwayEntrances =function(req,res,next){
	var id=req.params.id;
	routes.getSubwayEntrances(id, function (err,subwayEntrances){
		if(!subwayEntrances)return res.send(500,err);
		res.json(subwayEntrances);
	});
};

exports.getTramLines =function(req,res,next){
	var id=req.params.id;
	routes.getTramLines(id, function (err,tramLines){
		if(!tramLines)return res.send(500,err);
		res.json(tramLines);
	});

};

exports.getTramStops =function(req,res,next){
	var id=req.params.id;
	routes.getTramStops(id, function (err,tramStops){
		if(!tramStops)return res.send(500,err);
		res.json(tramStops);
	});

};

