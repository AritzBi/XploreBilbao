'use strict';

angular.module('xploreBilbaoApp')
	.controller('MuseumsCtrl', function ($rootScope,$scope,EmblematicBuilding,$filter,$translate,newRoute){
	    $scope.groupedItems = [];
	    $scope.itemsPerPage = 3;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;
	   	$scope.predicate="";
	    var orderBy = $filter('orderBy');
	    EmblematicBuilding.getMuseums().$promise.then(
	    	function success (data) {
	    		$scope.museums=data;
	    		for(var i = 0; i < $scope.museums.length; i++){
	    			if($scope.museums[i].note === null){
	    				$scope.museums[i].note=0;
	    			}
	    		}
			    // now group by pages
			    $scope.groupToPages();
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
	    	console.log($scope.museums);
	   		$scope.museums = orderBy($scope.museums, $scope.predicate, false);
	   		console.log($scope.museums);
	   		$scope.currentPage = 0;
	        // now group by pages
	        $scope.groupToPages();
	    };
		// calculate page in place
	    $scope.groupToPages = function () {
	        $scope.pagedItems = [];
	        for (var i = 0; i < $scope.museums.length; i++) {
	            if (i % $scope.itemsPerPage === 0) {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.museums[i] ];
	            } else {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.museums[i]);
	            }
	        }
	    };
	    
	    $scope.range = function (start, end) {
	        var ret = [];
	        if (!end) {
	            end = start;
	            start = 0;
	        }
	        for (var i = start; i < end; i++) {
	            ret.push(i);
	        }
	        return ret;
	    };
	    
	    $scope.prevPage = function () {
	        if ($scope.currentPage > 0) {
	            $scope.currentPage--;
	        }
	    };
	    
	    $scope.nextPage = function () {
	        if ($scope.currentPage < $scope.pagedItems.length - 1) {
	            $scope.currentPage++;
	        }
	    };
	    
	    $scope.setPage = function () {
	        $scope.currentPage = this.n;
	    }; 
	    $scope.arePages = function(){
	    	if($scope.museums.length === 0){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    }
	});