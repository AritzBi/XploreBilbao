'use strict';

angular.module('xploreBilbaoApp')
	.controller('EmblematicBuildingsCtrl', function ($scope,EmblematicBuilding, buildingsCategory, $filter, $translate, newRoute){
		$scope.emblematicBuildings=EmblematicBuilding.query();
		$scope.buildingsCategory=buildingsCategory.query();
		$scope.filteredItems = [];
	    $scope.groupedItems = [];
	    $scope.itemsPerPage = 3;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;

	   	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };

	   	$scope.addLocation=function(id){
	    	var found=false;
	    	for(var i=0;i<$scope.filteredItems.length&&!found;i++){
	    		if($scope.filteredItems[i].id===id){
	    			found=true;
					newRoute.addLocation($scope.filteredItems[i]);
	    		}
	    	}
	    }
	        // init the filtered items
    	$scope.filterByCategory = function () {
	        $scope.filteredItems = $filter('filter')($scope.emblematicBuildings, function (item) {
	        	var found=false;
	            angular.forEach($scope.buildingsCategory, function(category){
	                    if(category.isActivated){
	                            if(item.type_denom_es === category.type_denom_es){
	                                found=true;
	                            }
	                    }
	                });
	                return found;
	        });
	        $scope.currentPage = 0;
	        // now group by pages
	        $scope.groupToPages();
    	};
		    // calculate page in place
	    $scope.groupToPages = function () {
	        $scope.pagedItems = [];
	        for (var i = 0; i < $scope.filteredItems.length; i++) {
	            if (i % $scope.itemsPerPage === 0) {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
	            } else {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
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
	    $scope.filterByCategory();
	     	   	$scope.arePages = function(){
	    	if($scope.filteredItems.length === 0){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    }          
	});