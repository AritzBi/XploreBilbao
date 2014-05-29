'use strict';

angular.module('xploreBilbaoApp')
	.controller('RestaurantsCtrl', function ($scope,Restaurant, restaurantsCategory, $filter,$translate){
		$scope.restaurants=Restaurant.query();
		$scope.restaurantsCategory=restaurantsCategory.query();
		$scope.filteredItems = [];
	    $scope.groupedItems = [];
	    $scope.itemsPerPage = 3;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;
	   
	  	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };
	        // init the filtered items
    	$scope.filterByCategory = function () {
	        $scope.filteredItems = $filter('filter')($scope.restaurants, function (item) {
	        	var found=false;
	            angular.forEach($scope.restaurantsCategory, function(category){
	                    if(category.isActivated){
	                            if(item.first_type_es === category.first_type_es){
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
	    $scope.arePages = function(){
	    	if($scope.filteredItems.length === 0){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    }
	     $scope.filterByCategory();           
	});