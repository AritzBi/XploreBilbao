var routes =require('../models/routes');
var hostelery =require('../controllers/hostelery');
var async=require('async');
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
      	
      	async.forEach(routes,function(item, callback){
      		parseRoute(item,function(hostelery){
				geojson.features.push(hostelery);
				callback();
			});
      	}, function(err){
      		if(!err)res.json(geojson);
      	});
	});
}

function parseRoute(route,cb){
	var routeObjects=JSON.parse(route.route);
	var data=new Array();
	async.forEach(routeObjects, function(item, callback){
		if(item.TYPE === "HOSTELERY"){
			hostelery.getInfo(item.ID, function(err, hostelery){
				if(!err) data.push(hostelery);
				callback();
			});
		}else{
			callback();
		}
	},function(err){
		if(!err)cb(data);
	});
}