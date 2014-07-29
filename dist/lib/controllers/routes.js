var routes =require('../models/routes');
var hostelery =require('../controllers/hostelery');
var building =require('../controllers/emblematicBuildings.js');
var event =require('../controllers/events.js');
var async=require('async');
var weatherApi=require('../controllers/weatherApi.js');
var nools=require('nools');
var inferred = function(){
	this.routeType=0;
	this.company=0;
	this.weather=0;
};
var Data = function (data) {
	this.routeType=data.routeType;
	this.company=data.company;
	this.weather=data.weather;
};
var Result = function (result) {
	this.result = result;
};
var flow = nools.flow("XploreBilbao", function (flow) {
		    //find any message that start with hello
		    flow.rule("RouteTypeOcio", [[Data, "d", "d.routeType == 'ocio'"],[inferred, "i", "i.routeType == 0"]], function (facts) {
		    	facts.d.routeType=null;
		    	this.modify(facts.d);
		    	facts.i.routeType=1;
		    	this.modify(facts.i);
		    });
		    flow.rule("RouteTypeTuristico", [[Data, "d", "d.routeType == 'turistica'"],[inferred, "i", "i.routeType==0"]], function (facts) {
		    	facts.d.routeType=null;
		    	this.modify(facts.d);
		    	facts.i.routeType=2;
		    	this.modify(facts.i);
		    });
		    flow.rule("WeatherTypeLluvia", [[Data, "d", "d.weather == 'lluvia'"],[inferred, "i", "i.weather== 0 && i.routeType == 2"]], function (facts) {
		    	facts.d.weather=null;
		    	this.modify(facts.d);
		    	facts.i.weather=1;
		    	this.modify(facts.i);
		    });
		    flow.rule("WeatherTypeNolluvia", [[Data, "d", "d.weather == 'noLluvia'"],[inferred, "i", "i.weather==0 && i.routeType==2"]], function (facts) {
		    	facts.d.weather=null;
		    	this.modify(facts.d);
		    	facts.i.weather=2;
		    	this.modify(facts.i);
		    });
		    flow.rule("CompanyTypeFamily", [[Data, "d", "d.company == 'familia'"],[inferred, "i", "i.routeType==1"]], function (facts) {
		    	facts.d.company=null;
		    	this.modify(facts.d);
		    	facts.i.company=1;
		    	this.modify(facts.i);
		    });
		    flow.rule("CompanyTypeOthers", [[Data, "d", "d.company == 'solo' || d.company == 'pareja' "],[inferred, "i", "i.routeType==1"]], function (facts) {
		    	facts.d.company=null;
		    	this.modify(facts.d);
		    	facts.i.company=2;
		    	this.modify(facts.i);
		    });
		    flow.rule("GoodBye",[[inferred, "i", "i.routeType!=0 && (i.weather!=0 || i.company!=0)"],[Result, "r"]], function (facts) {
		    	facts.d.company=null;
		    	this.modify(facts.d);
		    	facts.i.company=2;
		    	this.modify(facts.i);
		    });
		});
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
exports.getRecommendation = function(req,res,next){
	var date=new Date(parseInt(req.query.startDate)).toDateString();
	var tempDate;
	var found =false;
	var rain;
	weatherApi.getWeatherInfo(function(cb){
		for(var i=0;i<cb.list.length ;i++){
			tempDate=new Date(parseInt(cb.list[i].dt)*1000).toDateString();
			if(date === tempDate){
				if("Rain"===cb.list[i].weather[0].main){
					rain="lluvia";
				}else{
					rain="noLluvia";
				}
				found=true;
			}
		}
		var infer=new inferred();
		console.log(rain);
		console.log(req.query.type);
		console.log(req.query.company);
		var  session1 = flow.getSession(new Data({routeType: req.query.type, weather: rain, company: req.query.company}),infer);
		session1.match().then(function(){
			session1.dispose();
			var code=""+infer.routeType+infer.company+infer.weather;
			console.log(code);
			routes.getInfoRouteByCode(code,function(err,route){
	      		parseRouteWithDetails(route[0],function(geojson){
					pairRoutes=new Array();
	  				for(var j=0;j<geojson.features.length-1;j++){
	  					pairRoutes.push([geojson.features[j].properties.location_id,geojson.features[j+1].properties.location_id]);
	  				}
	  				getWalkingPath(pairRoutes,function(walkingPath){
	  					for(var j=0;j<walkingPath.features.length;j++){
	      					geojson.features.push(walkingPath.features[j]);
	      				}
	      				res.json(geojson);
	      			});
				});	
		    });
		});
	});
}
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
exports.getMyRoutes=function(req,res,next){
	var userId=req.user.id;
	var data=new Array();
	routes.getMyRoutes(userId, function(err,routes){
		async.forEachSeries(routes,function(item, callback){
			parseRouteWithoutDetails(item,function(geojson){
				data.push(geojson);
				callback();
			});
		},function(err){
			res.json(data);
		});
	});
},
exports.getFollowingRoutes=function(req,res,rext){
	var userId=req.user.id;
	routes.getFollowingRoutes(userId, function(err, route){
			if(err)res.send(500);
			res.json(route);
	});
},
exports.unfollowRoute=function(req,res,rext){
	var routeId=req.body.id2;
	var userId=req.user.id;
	routes.unfollowRoute(userId,routeId, function(err){
			if(err)res.send(500);
			res.send(200)
	});
},
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

exports.create=function(req, res, next){
	routes.createRoute(req.body,req.user.id, function (err, route) {
		if(err)res.send(500,err);
		res.send(200);
	});
}


exports.followRoute=function(req, res, next){
	var id=req.body.id2;
	routes.followRoute(id,req.user.id, function (err, route) {
		if(err)res.send(500,err);
		res.send(200);
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
                	"description_eu": route.description_eu,
                	"createdBy":route.createdBy
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
				if(item.TYPE === "EVENT"){
					event.getInfo(item.ID, function(err,event){
						if(!err)geojson.features.push(event);
						callback();
					});
				}else{
					callback();
				}
			}
		}
	},function(err){
		if(!err)cb(geojson);
	});
}

function parseRouteWithoutDetails(route,cb){
	var routeObjects=JSON.parse(route.route);
	var geojson={ "type": "FeatureCollection",
                "features": [],
                "properties":{
                	"id": route.id,
                	"name_es": route.name_es,
                	"name_en": route.name_en,
                	"name_eu": route.name_eu,
                	"description_es": route.description_es,
                	"description_en": route.description_en,
                	"description_eu": route.description_eu,
                	"createdby":route.createdby
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
				if(item.TYPE === "EVENT"){
					event.getInfoWithoutDetails(item.ID, function(err,event){
						if(!err)geojson.features.push(event);
						callback();
					});
				}else{
					callback();
				}
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