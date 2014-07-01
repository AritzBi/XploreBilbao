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
		"TramStops": tramStops,
		"Test": test,
		"Test2": test2,
		"Test3": test3
	};
	$scope.selectedRoute="pito";
	Routes.getSubwayLines().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 2,
	                    opacity: 1,
	                    color: 'red',
	                    dashArray: '3',
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
				subwayEntrances.addLayer(L.geoJson(data[0].row_to_json,{style: style}));
        }
	);
	Routes.getTramLines().$promise.then(
		function success(data){
				var style={
	                    fillColor: "green",
	                    weight: 2,
	                    opacity: 1,
	                    color: 'green',
	                    dashArray: '3',
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
				tramStops.addLayer(L.geoJson(data[0].row_to_json,{style: style}));
        }
	);
	leafletData.getMap().then(function(map){
		L.control.layers(baseMaps,overlayMaps).addTo(map);
	});

}]);

angular.module('xploreBilbaoApp')
.controller('TopRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes){
	Routes.getTopRoutes().$promise.then(
		function success(data){
			$scope.topRoutes=data;
		}
	);

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
	    			if($scope.geoJsonLayer){
		    			map.removeLayer($scope.geoJsonLayer);
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
		    		$scope.geoJsonLayer = L.geoJson($scope.topRoutes[i-1],{
						style: style
					, onEachFeature: function(feature, layer){
						if(feature.properties){
							var html;
							//var html="<h4>"+feature.properties.denom_es+"</h4><div class='row'><div class='col-md-12'><img class='img-responsive'ng-src='images/"+feature.properties.image_path+"'></div></div>";
							if(feature.properties.second_type_en){
								html="<h4>"+feature.properties.denom_es+"</h4><h5>"+feature.properties.second_type_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
							}else{
								if(feature.properties.building_type){
									console.log(feature.properties.denom_es);
									html="<h4>"+feature.properties.denom_es+"</h4><h5>"+feature.properties.type_denom_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}else{
									html="<h4>"+feature.properties.title_es+"</h4><h5>"+feature.properties.type_es+"</h5><div class='row popUpSize'><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div>";
								}
							}
							layer.bindPopup(html);
						}
					}

					});
					$scope.geoJsonLayer.addTo(map);
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
.controller('RouteDetails',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes",function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes){
	var style={
                fillColor: "blue",
                weight: 5,
                opacity: 1,
                color: 'blue',
                dashArray: '9',
                fillOpacity: 0.7
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
		if($scope.geoJsonLayer){
		    map.removeLayer($scope.geoJsonLayer);
		}
		Routes.getRouteDetails({id2: routeId}).$promise.then(
			function success(data){
				$scope.routeDetailsInfo=new Array();
				for(var i=0;i<data.features.length;i++){
					route.features.push(data.features[i]);
					$scope.routeDetailsInfo.push(data.features[i]);
				}
				if(hasWalkingPath === true){
					$scope.geoJsonLayer = L.geoJson(route,{
						style: style
					});
					$scope.geoJsonLayer.addTo(map);
				}else{
					Routes.getWalkingPathByRouteId({id2: routeId}).$promise.then(
						function success(data){
							for(var i=0;i<data.features.length;i++){
    							route.features.push(data.features[i]);
    						}
    						$scope.geoJsonLayer = L.geoJson(route,{
								style: style
							});
							$scope.geoJsonLayer.addTo(map);
						}
					);
				}
			}
		);
	});
}]);

angular.module('xploreBilbaoApp')
.controller('MyRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes){
	Routes.getMyRoutes().$promise.then(
		function success(data){
			$scope.myRoutes=data;
		}
	);

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

function hasRoute(data){
	var found=false;
	for(var i=0;i<data.features.length&&!found;i++){
		if(data.features[i].geometry.type === 'LineString'){
			found=true;
		}
	}
	return found;
}