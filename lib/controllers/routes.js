var routes =require('../models/routes');

exports.getSubwayLines =function(req,res,next){
	routes.getSubwayLines(function (err,subwayLines){
		if(!subwayLines)return res.send(500,err);
		res.json(subwayLines);
	});
};

exports.getSubwayEntrances =function(req,res,next){
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

exports.getWalkRoute =function(req,res,next){
	routes.getWalkRoute(5,4, function(err, route){
		if(!route) return res.send(500,err);
		res.json(route);
	});
};

exports.getInfoRoutes= function(req,res,next){
	routes.getInfoRoutes(function(err,routes){
		var geojson={ "type": "FeatureCollection",
                  	"features": []
      	};
		for(var i=0;i<routes.length;i++){
			parseRoute(routes[i]);
		}
	});
}

function parseRoute(route){

}