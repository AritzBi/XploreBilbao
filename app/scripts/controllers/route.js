'use strict';

angular.module('xploreBilbaoApp')
.controller('RouteCtrl',["$scope","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","snapRemote","newRoute","$cookieStore", "inRoute", function ($scope,leafletData,$state,$stateParams,$sce,Auth, Routes,snapRemote,newRoute,$cookieStore,inRoute){
	angular.extend($scope, {
	    center: {
	        lat: 43.263163,
	        lng: -2.935047,
	        zoom: 17
	    }
	});
	$scope.desktop=!(window.mobilecheck());
	if(!$scope.desktop){
		$scope.disenableSidebar = function() {
	      	snapRemote.getSnapper('route').then(function(snapper) {
	  			snapper.disable();
			});
	    };
	    $scope.disenableSidebar();
	    $scope.optsLeaflet = {
	        disable: 'left',
	         minPosition: -240,
	         maxPosition: 240
	    };
	    $scope.enableSidebar = function() {
	      snapRemote.getSnapper('leaflet').then(function(snapper) {
		  		snapper.enable();
		        snapper.settings($scope.optsLeaflet);
			});
		}
		$scope.enableSidebar();  
	}
	inRoute.setInRoute(true);
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
	        	console.log(data[0].row_to_json);
	        	console.log(L);
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
.controller('TopRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","geoJSON","$translate", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes,geoJSON,$translate){
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
	$scope.getLang=function(){
	  	var lang=$translate.use();
	    return lang;
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
						style: style,
							onEachFeature: function(feature, layer){
								if(feature.properties){
									var html;
									if($scope.getLang()==='es'){
										if(feature.properties.first_type_es){
											html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
										}else{
											if(feature.properties.building_type){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";

											}else{
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_es+"</h4></div><div class='row'><h5>"+feature.properties.type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}
										}
									}else{
										if($scope.getLang()==='en'){
											if(feature.properties.first_type_en){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.second_type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_en+"</h4></div><div class='row'><h5>"+feature.properties.type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}									
										}else{
											if(feature.properties.first_type_eu){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.second_type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}
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
	}else{
		if($stateParams.origin==='2'){
			$scope.origin="personalRoute.myRoutes";
		}
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
				}
				for(var i=0;i<data.features.length;i++){
					$scope.routeDetailsInfo.push(data.features[i]);
				}
				if(hasWalkingPath === "true"){
					geoJSON.setJSON(L.geoJson(route,{
						style: style,
						onEachFeature: function(feature, layer){
									if(feature.properties){
										var html;
										if($scope.getLang()==='es'){
											if(feature.properties.first_type_es){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";

												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_es+"</h4></div><div class='row'><h5>"+feature.properties.type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}
										}else{
											if($scope.getLang()==='en'){
												if(feature.properties.first_type_en){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.second_type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													if(feature.properties.building_type){
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}else{
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_en+"</h4></div><div class='row'><h5>"+feature.properties.type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}
												}									
											}else{
												if(feature.properties.first_type_eu){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.second_type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													if(feature.properties.building_type){
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}else{
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}
												}
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
										var html;
										if($scope.getLang()==='es'){
											if(feature.properties.first_type_es){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";

												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_es+"</h4></div><div class='row'><h5>"+feature.properties.type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}
										}else{
											if($scope.getLang()==='en'){
												if(feature.properties.first_type_en){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.second_type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													if(feature.properties.building_type){
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}else{
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_en+"</h4></div><div class='row'><h5>"+feature.properties.type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}
												}									
											}else{
												if(feature.properties.first_type_eu){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.second_type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													if(feature.properties.building_type){
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}else{
														html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
													}
												}
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
.controller('MyRoutesCtrl',["$scope","selectedRoute","leafletData","$state","$stateParams", "$sce", "Auth", "Routes","geoJSON","$translate", function ($scope,selectedRoute,leafletData,$state,$stateParams,$sce,Auth, Routes,geoJSON,$translate){
	$scope.user=Auth.currentUser();
	Routes.getMyRoutes().$promise.then(
		function success(data){
			$scope.myCreations=[];
			$scope.following=[];
			$scope.myRoutes=data;
			console.log(data);
			for(var i=0;i<data.length;i++){
				console.log(data[i].properties.createdby);
				if(data[i].properties.createdby===$scope.user.id){
					$scope.myCreations.push(data[i]);
				}else{
					$scope.following.push(data[i]);
				}
			}
			console.log($scope.myCreations);
		}
	);
	$scope.getLang=function(){
	  	var lang=$translate.use();
	    return lang;
	};
	$scope.createdByTab={};
	$scope.followingTab={};
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
		    		for(var i=0;i<$scope.myRoutes.length&&!found;i++){
		    			if($scope.myRoutes[i].properties.id===routeId){
		    				found=true;

		    				for(var j=0;j<data.features.length;j++){
		    					$scope.myRoutes[i].features.push(data.features[j]);
		    				}
		    			}
		    		}
		    		geoJSON.setJSON(L.geoJson($scope.myRoutes[i-1],{
						style: style,
							onEachFeature: function(feature, layer){
								if(feature.properties){
									var html;
									if($scope.getLang()==='es'){
										if(feature.properties.first_type_es){
											html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
										}else{
											if(feature.properties.building_type){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";

											}else{
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_es+"</h4></div><div class='row'><h5>"+feature.properties.type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}
										}
									}else{
										if($scope.getLang()==='en'){
											if(feature.properties.first_type_en){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.second_type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_en+"</h4></div><div class='row'><h5>"+feature.properties.type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}									
										}else{
											if(feature.properties.first_type_eu){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.second_type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}
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
.controller('CustomRouteCtrl',function ($scope,$location, $modal, leafletData, geoJSON, $translate){
		var style={
	    fillColor: "green",
	    weight: 5,
	    opacity: 1,
	    color: 'blue',
	    fillOpacity: 0.7
		};
		$scope.routeDetailsInfo=new Array();
		$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
		};
      var instance=$modal.open({
        templateUrl: 'partials/recommendation.html',
        controller: 'RecommendationCtrl'
      });
      instance.result.then(function(data){

      	leafletData.getMap().then(function(map){
      		if(geoJSON.getJSON()){
				map.removeLayer(geoJSON.getJSON());
			}
      		geoJSON.setJSON(L.geoJson(data,{
						style: style,
							onEachFeature: function(feature, layer){
								if(feature.properties){
									$scope.routeDetailsInfo.push(feature);
									var html;
									if($scope.getLang()==='es'){
										if(feature.properties.first_type_es){
											html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.second_type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
										}else{
											if(feature.properties.building_type){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_es+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";

											}else{
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_es+"</h4></div><div class='row'><h5>"+feature.properties.type_es+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}
										}
									}else{
										if($scope.getLang()==='en'){
											if(feature.properties.first_type_en){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.second_type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_en+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_en+"</h4></div><div class='row'><h5>"+feature.properties.type_en+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}									
										}else{
											if(feature.properties.first_type_eu){
												html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.second_type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
											}else{
												if(feature.properties.building_type){
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.denom_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_denom_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}else{
													html="<div class='container-leaflet'><div class='row'> <h4>"+feature.properties.title_eu+"</h4></div><div class='row'><h5>"+feature.properties.type_eu+"</h5></div><div class='row '><div class='col-md-12'><img class='popUpSize' src='images/"+feature.properties.image_path+"'></div></div></div>";
												}
											}
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
      });
});
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

window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }