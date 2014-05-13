'use strict';

angular.module('xploreBilbaoApp')
.controller('RouteCtrl',["$scope","leafletData","$stateParams", "$sce", "Auth", "Routes", function ($scope,leafletData,$stateParams,$sce,Auth, Routes){
	var tiles={
		mapquestOSM:{
			url: "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
			options:{
	  		attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'}
		},
		capaOSM:{
			url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	  		attribution: '© Colaboradores de <a href="http://www.osm.org" target="blank">OpenStreetMap</a>'

		},
		capaSatelite:{
			url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg',
			options:{
	  		attribution: 'Mapas por <a href="http://arcgisonline.com" target="blank">ArcGIS Online</a>'}
		}
	};

	angular.extend($scope, {
		//tiles: tiles.capaSatelite,
		//baseLayer: layers.baselayers.mapquestOSM
	    center: {
	        lat: 43.263163,
	        lng: -2.935047,
	        zoom: 17
	    },
	   	layers: {
			baselayers:{
				openstreetmap: {
					name: "OpenStreetMap",
					type: 'xyz',
			        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			        layerParams:{
	  				attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'}
			    },
				/*mapquestOSM:{
					name: "1",
					type: 'xyz',
					url: "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"
				},*/
				capaSatelite:{
					name: "ArcGIS",
					type: 'xyz',
					url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg',
					layerParams:{
	  					attribution: 'Mapas por <a href="http://arcgisonline.com" target="blank">ArcGIS Online</a>'}
				}

			}
		}
	});
	var sidebar= L.control.sidebar('sidebar',{
		position: 'left'
	});
	leafletData.getMap().then(function(map){
		map.addControl(sidebar);
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
		map.addControl(new sidebarControl());
	});

	$scope.toggle = function(){
		console.log("hoa");
		sidebar.toggle();
	};

	$scope.getSubwayLines= function(){
		Routes.getSubwayLines().$promise.then(
			function success(data){
				console.log(data[0].row_to_json);
				$scope.geojson={
                data: data[0].row_to_json,
                style: {
                    fillColor: "green",
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
			}
		);
	};

	/*    angular.extend($scope, {
        taipei: {
            lat: 25.0391667,
            lng: 121.525,
            zoom: 6
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                cloudmade2: {
                    name: 'Cloudmade Tourist',
                    type: 'xyz',
                    url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                    layerParams: {
                        key: '007b9471b4c74da4a6ec7ff43552b16f',
                        styleId: 7
                    }
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });*/

/*
    var tilesDict = {
        openstreetmap: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        opencyclemap: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        }
    };*/



//Capa de satélite de ArcGIS
}]);