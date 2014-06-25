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

    	$scope.filterEvent = function () {
	        $scope.filteredItems = $filter('filter')($scope.events, function (item) {
	        	var number;
	        	var found=true;
	        	if(item.range_prices){
	        		number=parseFloat(item.lowprice);
	        		if($scope.priceSlider.price<=number){
	        			found=false;
	        		}else{
	        			found=true;
	        		}
	        	}else{
	        		console.log(item.lowprice);
	        		if(item.lowprice === -1){
	        			found=false;
	        		}else{
	        			number=parseFloat(item.lowprice);
	        			if($scope.priceSlider.price<=number){
	        				found=false;
	        			}else{
	        				found=true;
	        			}
	        		}
	        	}
	            if(!found){
	            	return false;
	            }else{
	            	return true;
	            }
	        });
	        $scope.currentPage = 0;
	        // now group by pages
	        $scope.groupToPages();
    	};

	    var now = new Date();
    	var month = (now.getMonth() + 1);               
    	var day = now.getDate();
    	if(month < 10) 
        	month = "0" + month;
    	if(day < 10) 
       		day = "0" + day;
    	var today = now.getFullYear() + '-' + month + '-' + day;
		$scope.priceSlider={};
		$scope.priceSlider.price=30;
		$scope.startDate=today;
		$scope.endDate=today;
		if($stateParams.id){
			Event.getEventsByType({id2: $stateParams.id}).$promise.then(
				function success(data){
					$scope.events=data;
					$scope.groupedItems = [];
				    $scope.itemsPerPage = 4;
				    $scope.pagedItems = [];
				    $scope.currentPage = 0;
		        	for(var i=0; i<$scope.events.length; i++){
		        		var pos=$scope.events[i].startdate.indexOf('T');
		        		var startDate=$scope.events[i].startdate.substr(0,pos);
		        		var endDate=$scope.events[i].endate.substr(0,pos);
		        		if(startDate === endDate){
		        			$scope.events[i].showEndDate=false;
		        		}else{
		        			$scope.events[i].showEndDate=true;
		        		}
		        		if($scope.events[i].range_prices){
		        			$scope.events[i].price=$scope.events[i].lowprice+"€-"+$scope.events[i].highprice;
		        		}else{
		        			$scope.events[i].price=$scope.events[i].lowprice;	
		        		}
		        	}
		        	$scope.filteredItems=$scope.events;
		        	$scope.groupToPages();
				}
			);
			// calculate page in place
		    $scope.groupToPages = function () {
		        $scope.pagedItems = [];
		        for (var i = 0; i < $scope.filteredItems.length; i++) {
		            if (i % $scope.itemsPerPage === 0) {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i] ];
		            } else {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
		            }
		        }
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
		    $scope.currencyFormatting = function(value) { return value.toString() + " $" }

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