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
exports.getWalkingPathByRouteId =function(req,res,next){
	var id=req.params.id2;
	routes.getInfoRouteById(id, function(err, route){
		parseRouteWithoutDetails(route[0],function(geojson){
			var pairs=new Array();
			for(var i=0;i<geojson.features.length-1;i++){
				pairs.push([geojson.features[i].properties.location_id,geojson.features[i+1].properties.location_id ]);
			}
			getWalkingPath(pairs,function(walkingPath){
      			res.json(walkingPath);
      		});
		});
	});

}

exports.getRouteDetails=function(req,res,next){
	var id=req.params.id2;
	routes.getInfoRouteById(id, function(err, route){
		parseRouteWithDetails(route[0], function(geojson){
			res.json(geojson);
		});
	});
};

exports.getTopRoutes=function(req,res,next){
	var data=new Array();
	routes.getTopRoutes(function(err,routes){
		async.forEachSeries(routes,function(item, callback){
			parseRouteWithoutDetails(item,function(geojson){
				data.push(geojson);
				callback();
			});
		},function(err){
			res.json(data);
		});
	});
}
exports.getInfoRoutes= function(req,res,next){
	var data=new Array();
	routes.getInfoRoutes(function(err,routes){
      	async.forEachSeries(routes,function(item, callback){
      		parseRouteWithDetails(item,function(geojson){
				data.push(geojson);
				callback();
			});
      	}, function(err){
      		pairRoutes=new Array();
      		for(var i=0;i<data.length;i++){
      			pairRoutes.push(new Array());
      			for(var j=0;j<data[i].features.length-1;j++){
      				pairRoutes[i].push([data[i].features[j].properties.location_id,data[i].features[j+1].properties.location_id ]);
      			}
      		} 
      		var walkingPaths=new Array();
      		async.forEachSeries(pairRoutes, function(item, callback){
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

function parseRouteWithDetails(route,cb){
	var routeObjects=JSON.parse(route.route);
	//var data=new Array();
	var geojson={ "type": "FeatureCollection",
                "features": [],
                "properties":{
                	"id": route.id,
                	"name_es": route.name_es,
                	"name_en": route.name_en,
                	"name_eu": route.name_eu,
                	"description_es": route.description_es,
                	"description_en": route.description_en,
                	"description_eu": route.description_eu
                }
    };
	async.forEachSeries(routeObjects, function(item, callback){
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

function parseRouteWithoutDetails(route,cb){
		console.log(route);

	var routeObjects=JSON.parse(route.route);
	//var data=new Array();
	var geojson={ "type": "FeatureCollection",
                "features": [],
                "properties":{
                	"id": route.id,
                	"name_es": route.name_es,
                	"name_en": route.name_en,
                	"name_eu": route.name_eu,
                	"description_es": route.description_es,
                	"description_en": route.description_en,
                	"description_eu": route.description_eu
                }
    };
	async.forEachSeries(routeObjects, function(item, callback){
		if(item.TYPE === "HOSTELERY"){
			hostelery.getInfoWithoutDetails(item.ID, function(err, hostelery){
				if(!err) geojson.features.push(hostelery);
				callback();
			});
		}else{
			if(item.TYPE === "EMBLEMATIC_BUILDING"){
				building.getInfoWithoutDetails(item.ID, function(err, building){
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
	async.forEachSeries(route, function(item, callback){
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