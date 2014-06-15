'use strict';

angular.module('xploreBilbaoApp')
	.controller('EventsCtrl', function ($scope,$stateParams,Event, eventsCategory, $filter, $translate,newRoute){	    
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

	   	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };

		if($stateParams.id){
			console.log("aqui no");
			Event.getEventsByType({id2: $stateParams.id}).$promise.then(
				function success(data){
					$scope.events=data;
					$scope.groupedItems = [];
				    $scope.itemsPerPage = 4;
				    $scope.pagedItems = [];
				    $scope.currentPage = 0;
				    // now group by pages
		        	$scope.groupToPages();
		        	for(var i=0; i<$scope.events.length; i++){
		        		console.log($scope.events[i].startDate);
		        		console.log($scope.events[i].endate);
		        		if($scope.events[i].startdate === $scope.events[i].endate){
		        			$scope.events[i].showEndDate=false;
		        		}else{
		        			$scope.events[i].showEndDate=true;
		        		}
		        	}
				}
			);
			// calculate page in place
		    $scope.groupToPages = function () {
		        $scope.pagedItems = [];
		        for (var i = 0; i < $scope.events.length; i++) {
		            if (i % $scope.itemsPerPage === 0) {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.events[i] ];
		            } else {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.events[i]);
		            }
		        }
		    };

			$scope.addLocation=function(id){
		    	var found=false;
		    	for(var i=0;i<$scope.events.length&&!found;i++){
		    		if($scope.events[i].event_id===id){
		    			found=true;
		    			console.log($scope.events[i]);
						newRoute.addLocation($scope.events[i]);
		    		}
		    	}
		    }
		}
		else{
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
		    $scope.addLocation=function(id){
		    	var found=false;
		    	for(var i=0;i<$scope.filteredItems.length&&!found;i++){
		    		if($scope.filteredItems[i].event_id===id){
		    			found=true;
						newRoute.addLocation($scope.filteredItems[i]);
		    		}
		    	}
		    }
			 $scope.filterByCategory();      
	    }
	});