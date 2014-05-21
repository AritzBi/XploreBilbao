'use strict';

angular.module('xploreBilbaoApp')
.controller('RouteCtrl',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
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
			console.log($scope.topRoutes);
				var style={
	                    fillColor: "green",
	                    weight: 5,
	                    opacity: 1,
	                    color: 'green',
	                    dashArray: '9',
	                    fillOpacity: 0.7
	        	};
	        	test2.addLayer(L.geoJson(data[0],{style: style}));
	        	test3.addLayer(L.geoJson(data[1],{style: style}));

		}
	);
	/*var sidebar= L.control.sidebar('sidebar',{
		position: 'left'
	});*/

	leafletData.getMap().then(function(map){
		L.control.layers(baseMaps,overlayMaps).addTo(map);
		//map.addControl(sidebar);
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
		//map.addControl(new sidebarControl());
	});

	/*$scope.toggle = function(){
		sidebar.toggle();
	};*/

}]);

angular.module('xploreBilbaoApp')
.controller('TopRoutesCtrl',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
	
}]);

angular.module('xploreBilbaoApp')
.controller('MyRoutesCtrl',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
	
}]);