'use strict';

angular.module('xploreBilbaoApp')
.controller('RouteCtrl',["$scope","leafletData","$state","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$state,$stateParams,$sce,Auth, Routes){
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

	/*Routes.getWalkRoute().$promise.then(
		function success(data){
				var style={
	                    fillColor: "black",
	                    weight: 4,
	                    opacity: 1,
	                    color: 'black',
	                    dashArray: '3',
	                    fillOpacity: 0.7
	        	};
				test.addLayer(L.geoJson(data,{style: style}));
		}
	);*/

	Routes.getInfoRoutes().$promise.then(
		function success(data){
			$scope.topRoutes=data;

			/*var style={
	                    fillColor: "green",
	                    weight: 5,
	                    opacity: 1,
	                    color: 'green',
	                    dashArray: '9',
	                    fillOpacity: 0.7
	        	};
	        	test2.addLayer(L.geoJson(data[0],{style: style}));
	        	test3.addLayer(L.geoJson(data[1],{style: style}));*/

		}
	);


	leafletData.getMap().then(function(map){
		L.control.layers(baseMaps,overlayMaps).addTo(map);
		var sidebarControl=L.Control.extend({
			options:{
				position:'bottomleft'
			},
			onAdd: function(map){
				var container=L.DomUtil.create('button','btn btn-lg btn-primary');
				container.setAttribute("ng-click","toggle()");
				return container;
			}
		});
	});

}]);

angular.module('xploreBilbaoApp')
.controller('TopRoutesCtrl',["$scope","leafletData","$state","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$state,$stateParams,$sce,Auth, Routes){
	$scope.showInMap= function(routeId){
		var style={
                fillColor: "green",
                weight: 5,
                opacity: 1,
                color: 'green',
                dashArray: '9',
                fillOpacity: 0.7
	        	};
	    leafletData.getMap().then(function(map){
		    if($scope.geoJsonLayer){
		    	map.removeLayer($scope.geoJsonLayer);
		    }
			var found=false;
			for(var i=0;(i<$scope.topRoutes.length ) && !found;i++){
				if($scope.topRoutes[i].properties.id === routeId){
					found=true;
					$scope.geoJsonLayer = L.geoJson($scope.topRoutes[i],{
													style: style
					});
				}
			}
			$scope.geoJsonLayer.addTo(map);
		});

	}
}]);

angular.module('xploreBilbaoApp')
.controller('RouteDetails',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
	console.log($stateParams);
	/*$scope.topRoutesInfo=new Array(data.length);
	for(var i=0;i<data.length;i++){
		$scope.topRoutesInfo[i]=new Array();
		for(var j=0;j<data[i].features.length;j++){
			if(data[i].features[j].properties){
				$scope.topRoutesInfo[i].push($scope.topRoutes[i].features[j]);
			}else{
				break;
			}
		}
	}*/
	var found=false;
	for(var i=0;i<$scope.topRoutes.length&&!found;i++){
		if($scope.topRoutes[i].properties.id === parseInt($stateParams.id)){
			found=true;
			$scope.routeDetails=$scope.topRoutes[i];
		}
	}
	$scope.routeDetailsInfo=new Array();
	for(var i=0;i<$scope.routeDetails.features.length;i++){
		if($scope.routeDetails.features[i].properties){
			$scope.routeDetailsInfo.push($scope.routeDetails.features[i]);
		}else{
			break;
		}
	}
	console.log($scope.routeDetailsInfo);

}]);
angular.module('xploreBilbaoApp')
.controller('MyRoutesCtrl',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
	
}]);