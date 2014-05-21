var routes =require('../models/routes');
var hostelery =require('../controllers/hostelery');
var building =require('../controllers/emblematicBuildings.js')
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
	var data=new Array();
	routes.getInfoRoutes(function(err,routes){
      	async.forEach(routes,function(item, callback){
      		parseRoute(item,function(geojson){
				//geojson.features.push(hostelery);
				data.push(geojson);
				callback();
			});
      	}, function(err){
      		//if(!err)res.json(geojson);
      		pairRoutes=new Array();
      		for(var i=0;i<data.length;i++){
      			pairRoutes.push(new Array());
      			for(var j=0;j<data[i].features.length-1;j++){
      				pairRoutes[i].push([data[i].features[j].properties.location_id,data[i].features[j+1].properties.location_id ]);
      			}
      		} 
      		var walkingPaths=new Array();
      		async.forEach(pairRoutes, function(item, callback){
      			getWalkingPath(item,function(walkingPath){
      				walkingPaths.push(walkingPath);
      				callback();
      			});
      		},function(err){
      			for(var i=0;i<data.length;i++){
      				for(var j=0;j<walkingPaths[i].features.length;j++){
      					data[i].features.push(walkingPaths[i].features[j]);
      				}
      			}
      			res.json(data);
      		});
      	});
	});
}

function parseRoute(route,cb){
	var routeObjects=JSON.parse(route.route);
	//var data=new Array();
	var geojson={ "type": "FeatureCollection",
                "features": []
    };
	async.forEach(routeObjects, function(item, callback){
		if(item.TYPE === "HOSTELERY"){
			hostelery.getInfo(item.ID, function(err, hostelery){
				if(!err) geojson.features.push(hostelery);
				callback();
			});
		}else{
			if(item.TYPE === "EMBLEMATIC_BUILDING"){
				building.getInfo(item.ID, function(err, building){
					if(!err) geojson.features.push(building);
					callback();
				});
			}else{
				callback();
			}
		}
	},function(err){
		if(!err)cb(geojson);
	});
}

function getWalkingPath(route, cb){
	var walkingPath={"features": []}
	async.forEach(route, function(item, callback){
		routes.getWalkRoute(item[0],item[1], function(err, route){
			if(!err){
				for(var i=0;i<route.features.length;i++){
					walkingPath.features.push(route.features[i]);
				}
			}
			callback();
		});
	},function(err){
		cb(walkingPath);
	});
}