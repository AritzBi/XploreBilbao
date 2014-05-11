'use strict';

angular.module('xploreBilbaoApp')
	.controller('EventsCtrl', function ($scope,Event, eventsCategory, $filter){
		$scope.events=Event.query();
		$scope.eventsCategory=eventsCategory.query();
		$scope.filteredItems = [];
	    $scope.groupedItems = [];
	    $scope.itemsPerPage = 5;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;
	        // init the filtered items
    	$scope.filterByCategory = function () {
	        $scope.filteredItems = $filter('filter')($scope.events, function (item) {
	        	var found=false;
	            angular.forEach($scope.eventsCategory, function(category){
	                    if(category.isActivated){
	                            if(item.subtype_es === category.subtype_es){
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
	});