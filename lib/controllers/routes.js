var routes =require('../models/routes');

exports.getSubwayLines =function(req,res,next){
	routes.getSubwayLines(function (err,subwayLines){
		if(!subwayLines)return res.send(500,err);
		res.json(subwayLines);
	});
};

exports.getSubwayEntrances =function(req,res,next){
	console.log("aqui si paso");
	routes.getSubwayEntrances(function (err,subwayEntrances){
		if(!subwayEntrances)return res.send(500,err);
		res.json(subwayEntrances);
	});
};

exports.getTramLines =function(req,res,next){
	routes.getTramLines( function (err,tramLines){
		if(!tramLines)return res.send(500,err);
		res.json(tramLines);
	});

};

exports.getTramStops =function(req,res,next){
	routes.getTramStops( function (err,tramStops){
		if(!tramStops)return res.send(500,err);
		res.json(tramStops);
	});

};

