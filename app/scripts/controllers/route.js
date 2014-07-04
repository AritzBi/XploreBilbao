'use strict';

angular.module('xploreBilbaoApp')
.controller('RouteCtrl',["$scope","leafletData","$state","$stateParams", "$sce", "Auth", "Routes",  function ($scope,leafletData,$state,$stateParams,$sce,Auth, Routes){
	angular.extend($scope, {
	    center: {
	        lat: 43.263163,
	        lng: -2.935047,
	        zoom: 17
	    }
	});
	
	var mapquestOSM=L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
		attribution: 'Mapas por <a href="http://arcgisonline.com" target="blank">ArcGIS Online</a>'
	});
	var capaSatelite=L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg',{
		attribution: 'Mapas por <a href="http://arcgisonline.com" target="blank">ArcGIS Online</a>'
	});
	var baseMaps={
		"MapQuest": mapquestOSM,
		"ArcGIS": capaSatelite
	};
	var subwayLines=L.layerGroup(), subwayEntrances=L.layerGroup(),tramLines=L.layerGroup(),tramStops=L.layerGroup(), test=L.layerGroup(), test2=L.layerGroup(), test3=L.layerGroup();
	var overlayMaps={
		"SubwayLines": subwayLines,
		"SubwayEntrances": subwayEntrances,
		"TramLines": tramLines,
		"TramStops": tramStops
	};
	var metroIcon = L.icon({
	    iconUrl: 'images/metro-bilbao.png'
	});
	var tramIcon=L.icon({
	    iconUrl: 'images/tram-bilbao.png'
	});
	$scope.selectedRoute="pito";
	Routes.getSubwayLines().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 5,
	                    opacity: 1,
	                    color: 'red',
	                    fillOpacity: 0.7
	        	};
				subwayLines.addLayer(L.geoJson(data[0].row_to_json,{style: style}));
        }
	);
	Routes.getSubwayEntrances().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 2,
	                    opacity: 1,
	                    color: 'red',
	                    dashArray: '3',
	                    fillOpacity: 0.7
	        	};
				subwayEntrances.addLayer(L.geoJson(data[0].row_to_json,{style: style, pointToLayer: function(feature, coordinates){
					return new L.marker([coordinates.lat, coordinates.lng], {icon: metroIcon});
				}}));
        }
	);
	Routes.getTramLines().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 5,
	                    opacity: 1,
	                    color: 'green',
	                    fillOpacity: 0.7
	        	};
				tramLines.addLayer(L.geoJson(data[0].row_to_json,{style:style}));
        }
	);
	Routes.getTramStops().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 2,
	                    opacity: 1,
	                    color: 'green',
	                    dashArray: '3',
	                    fillOpacity: 0.7
	        	};
				tramStops.addLayer(L.geoJson(data[0].row_to_json,{style: style, pointToLayer: function(feature, coordinates){
					return new L.marker([coordinates.lat, coordinates.lng], {icon: tramIcon});
				}}));
        }
	);
	leafletData.getMap().then(function(map){
		L.control.layers(baseMaps,overlayMaps).addTo(map);
	});

}]);

angular.module('xploreBilbaoApp')
.controller('TopRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","geoJSON", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes,geoJSON){
	$scope.username=Auth.currentUserId();
	$scope.user=Auth.currentUser();
	if($scope.username){
		Routes.getFollowingRoutes().$promise.then(
			function(followingRoutes){
				Routes.getTopRoutes().$promise.then(
					function(data){
						for(var i=0;i<data.length;i++){
							var found=false;
							for(var j=0;j<followingRoutes.length && !found;j++){
								if(data[i].properties.id === followingRoutes[j].route_id){
									found=true;
								}
							}
							if(found){
								data[i].following=true;
							}else{
								data[i].following=false;
							}
						}
						$scope.topRoutes=data;
					}
				);
			}
		);
	}else{
		Routes.getTopRoutes().$promise.then(
			function(data){
				$scope.topRoutes=data;
			}
		);
	}
	$scope.followRoute=function(index){
		var routeId=$scope.topRoutes[index].properties.id;
		Routes.followRoute({id2:routeId}).$promise.then(
			function(success){
				$scope.topRoutes[index].following=true;
			}
		);
	};
	$scope.unfollowRoute=function(index){
		var routeId=$scope.topRoutes[index].properties.id;
		Routes.unfollowRoute({id2:routeId}).$promise.then(
			function(success){
				$scope.topRoutes[index].following=false;
			}
		);
	};

	$scope.showInMap= function(routeId){
		var style={
                fillColor: "green",
                weight: 5,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
	        	};
	    Routes.getWalkingPathByRouteId({id2: routeId}).$promise.then(
	    	function success(data){
	    		leafletData.getMap().then(function(map){
	    			if(geoJSON.getJSON()){
		    			map.removeLayer(geoJSON.getJSON());
		    		}
		    		var found=false;
		    		for(var i=0;i<$scope.topRoutes.length&&!found;i++){
		    			if($scope.topRoutes[i].properties.id===routeId){
		    				found=true;

		    				for(var j=0;j<data.features.length;j++){
		    					$scope.topRoutes[i].features.push(data.features[j]);
		    				}
		    			}
		    		}
		    		geoJSON.setJSON(L.geoJson($scope.topRoutes[i-1],{
						style: style
					, onEachFeature: function(feature, layer){
						if(feature.properties){
							var html;
							//var html="<h4>"+feature.properties.denom_es+"</h4><div class='row'><div class='col-md-12'><img class='img-responsive'ng-src='images/"+feature.properties.image_path+"'></div></div>";
							if(feature.properties.second_type_en){
								html="<h4>"+feature.properties.denom_es+"</h4><h5>"+feature.properties.second_type_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
							}else{
								if(feature.properties.building_type){
									html="<h4>"+feature.properties.denom_es+"</h4><h5>"+feature.properties.type_denom_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}else{
									html="<h4>"+feature.properties.title_es+"</h4><h5>"+feature.properties.type_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}
							}
							layer.bindPopup(html);
						}
					}

					}));
					var firstPoint;
					for (var property in geoJSON.getJSON()._layers) {
					    if (geoJSON.getJSON()._layers.hasOwnProperty(property)) {
					        firstPoint = geoJSON.getJSON()._layers[property];
					        break;
					    }
					}
					map.setView(firstPoint._latlng);
					geoJSON.getJSON().addTo(map);
	    		});

	    	}
	    );
	}
	$scope.showDetails= function(routeId){
		var found=false;
		var route;
		for(var i=0;i<$scope.topRoutes.length;i++){
 			if($scope.topRoutes[i].properties.id === routeId){
 				found=true;
 				route=$scope.topRoutes[i];
 			}
		}
		if(found){
			selectedRoute.setRoute(route);
			$state.go('personalRoute.routeDetails', {hasWalkingPath: hasRoute(route), origin: 1 });
		}
	}
}]);

angular.module('xploreBilbaoApp')
.controller('RouteDetails',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","$translate","geoJSON",function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes,$translate,geoJSON){
		var style={
                fillColor: "green",
                weight: 5,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
	        	};
	$scope.getLang=function(){
	  	var lang=$translate.use();
	    return lang;
	};
	var route=selectedRoute.getRoute();
	var routeId=route.properties.id;
	var hasWalkingPath=$stateParams.hasWalkingPath;
	if($stateParams.origin === '1' ){
		$scope.origin="personalRoute.topRoutes";
	}
	for(var i=0;i<route.features.length;i++){
		if(route.features[i].geometry.type === "Point"){
			route.features.splice(i,1);
		}
	}  		
	leafletData.getMap().then(function(map){
		if(geoJSON.getJSON()){
			map.removeLayer(geoJSON.getJSON());
		}
		Routes.getRouteDetails({id2: routeId}).$promise.then(
			function success(data){
				$scope.routeDetailsInfo=new Array();
				for(var i=data.features.length-1;i>=0;i--){
					route.features.push(data.features[i]);
					$scope.routeDetailsInfo.push(data.features[i]);
				}
				if(hasWalkingPath === "true"){
					geoJSON.setJSON(L.geoJson(route,{
						style: style
					}));
					var firstPoint;
					for (var property in geoJSON.getJSON()._layers) {
			    		if (geoJSON.getJSON()._layers.hasOwnProperty(property)) {
			        		firstPoint = geoJSON.getJSON()._layers[property];
			    		}
					}
					map.setView(firstPoint._latlng);
					geoJSON.getJSON().addTo(map);
				}else{
					Routes.getWalkingPathByRouteId({id2: routeId}).$promise.then(
						function success(data){
			    			if(geoJSON.getJSON()){
				    			map.removeLayer(geoJSON.getJSON());
				    		}
    						route=data.features.concat(route.features);
    						geoJSON.setJSON(L.geoJson(route,{
								style: style,
								onEachFeature: function(feature, layer){
								if(feature.properties){
									console.log(feature);
							var html;
							//var html="<h4>"+feature.properties.denom_es+"</h4><div class='row'><div class='col-md-12'><img class='img-responsive'ng-src='images/"+feature.properties.image_path+"'></div></div>";
							if(feature.properties.hostelery_type){
								html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
							}else{
								if(feature.properties.building_type){
									html="<h4>"+feature.properties.denom_es+"</h4><h5>"+feature.properties.type_denom_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}else{
									html="<h4>"+feature.properties.title_es+"</h4><h5>"+feature.properties.type_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}
							}
							layer.bindPopup(html);
						}
							}
							}));
							var firstPoint;
							for (var property in geoJSON.getJSON()._layers) {
					    		if (geoJSON.getJSON()._layers.hasOwnProperty(property)) {
					        		firstPoint = geoJSON.getJSON()._layers[property];
					    		}
							}
							map.setView(firstPoint._latlng);
							geoJSON.getJSON().addTo(map);
						}
					);
				}
			}
		);
	});
}]);

angular.module('xploreBilbaoApp')
.controller('MyRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","geoJSON", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes,geoJSON){
	$scope.user=Auth.currentUser();
	Routes.getMyRoutes().$promise.then(
		function success(data){
			$scope.myCreations=[];
			$scope.following=[];
			$scope.myRoutes=data;
			for(var i=0;i<data.length;i++){
				if(data[i].properties.createdby===$scope.user.id){
					$scope.myCreations.push(data[i]);
				}else{
					$scope.following.push(data[i]);
				}
			}
		}
	);
	$scope.createdByTab={};
	$scope.followingTab={};
	$scope.showInMap= function(routeId){
		var style={
                fillColor: "green",
                weight: 5,
                opacity: 1,
                color: 'green',
                dashArray: '9',
                fillOpacity: 0.7
	        	};
	    Routes.getWalkingPathByRouteId({id2: routeId}).$promise.then(
	    	function success(data){
	    		leafletData.getMap().then(function(map){
	    			if($scope.geoJsonLayer){
		    			map.removeLayer($scope.geoJsonLayer);
		    			$scope.geoJsonLayer={};
		    		}
		    		var found=false;
		    		for(var i=0;i<$scope.myRoutes.length&&!found;i++){
		    			if($scope.myRoutes[i].properties.id===routeId){
		    				found=true;

		    				for(var j=0;j<data.features.length;j++){
		    					$scope.myRoutes[i].features.push(data.features[j]);
		    				}
		    			}
		    		}
		    		$scope.geoJsonLayer = L.geoJson($scope.myRoutes[i-1],{
						style: style
					});
					$scope.geoJsonLayer.addTo(map);
	    		});
	    	}
	    );
	}
	$scope.unfollowRoute=function(index){
		var routeId=$scope.following[index].properties.id;
		Routes.unfollowRoute({id2:routeId}).$promise.then(
			function(success){
				$scope.following.splice(index, 1);
			}
		);
	};
	$scope.showDetails= function(routeId){
		var found=false;
		var route;
		for(var i=0;i<$scope.myRoutes.length;i++){
 			if($scope.myRoutes[i].properties.id === routeId){
 				found=true;
 				route=$scope.myRoutes[i];
 			}
		}
		if(found){
			selectedRoute.setRoute(route);
			$state.go('personalRoute.routeDetails', {hasWalkingPath: hasRoute(route), origin: 2 });
		}
	}
}]);

angular.module('xploreBilbaoApp')
.controller('ScrollCtrl',function ($scope,$location, $anchorScroll){
	$scope.gotoBottom = function (){
	    // set the location.hash to the id of
	    // the element you wish to scroll to.
	    $location.hash('bottom');
	    // call $anchorScroll()
	    $anchorScroll();
	};
});


angular.module('xploreBilbaoApp')
.service('selectedRoute',function(){
	var selectedRoute={};
	this.setRoute = function(route){
		selectedRoute=route;
	}
	this.getRoute = function(){
		return selectedRoute;
	}
});

angular.module('xploreBilbaoApp')
.service('geoJSON',function(){
	var geoJsonLayer={};
	this.setJSON = function(route){
		geoJsonLayer=route;
	}
	this.getJSON = function(){
		return geoJsonLayer;
	}
});
function hasRoute(data){
	var found=false;
	for(var i=0;i<data.features.length&&!found;i++){
		if(data.features[i].geometry.type === 'LineString'){
			found=true;
		}
	}
	return found;
}