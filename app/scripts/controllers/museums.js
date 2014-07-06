'use strict';

angular.module('xploreBilbaoApp')
	.controller('MuseumsCtrl', function ($rootScope,$scope,EmblematicBuilding,$filter,$translate,newRoute,inRoute){
	    inRoute.setInRoute(false);
	   	$scope.predicate="";
	   	$scope.searchText = "";
	    var orderBy = $filter('orderBy');
	    EmblematicBuilding.getMuseums().$promise.then(
	    	function success (data) {
	    		$scope.museums=data;
	    		for(var i = 0; i < $scope.museums.length; i++){
	    			if($scope.museums[i].note === null){
	    				$scope.museums[i].note=0;
	    			}
	    		}
	    	}
	    );                                                                                             
	  	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };
	   	$scope.addLocation=function(id){
	    	var found=false;
	    	for(var i=0;i<$scope.museums.length&&!found;i++){
	    		if($scope.museums[i].id===id){
	    			found=true;
					newRoute.addLocation($scope.museums[i]);
	    		}
	    	}
	    }
	    $scope.order = function () {
	   		$scope.museums = orderBy($scope.museums, $scope.predicate, false);
	    };
	});