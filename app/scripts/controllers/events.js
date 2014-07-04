'use strict';

angular.module('xploreBilbaoApp')
	.controller('EventsCtrl', function ($scope,$stateParams,Event, eventsCategory, $filter, $translate,newRoute,datepickerPopupConfig,$locale){	    
	   	/*$scope.range = function (start, end) {
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
	    }; */

	   	$scope.getLang=function(){
	  		var lang=$translate.use();
	  		//$scope.startDate=new Date($scope.startDate).getTime();
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
	            	return found;
	            }else{
	            	/*var startDateSplit=$scope.startDate.split('-');
	            	startDateSplit=new Date (startDateSplit[0],startDateSplit[1]-1,startDateSplit[2]).getTime();
	            	console.log($scope.endDate);
	            	var endDateSplit=$scope.endDate.split('-');
	            	endDateSplit=new Date(endDateSplit[0],endDateSplit[1]-1,endDateSplit[2]).getTime();*/
	            	var startDateSplit=$scope.startDate.getTime();
	            	var endDateSplit=$scope.endDate.getTime();
	            	var startDateComparable=new Date(item.startdate).getTime();
	            	var endDateComparable=new Date(item.endate).getTime();

	            	if((startDateComparable>=startDateSplit && startDateComparable<=endDateSplit)|| (endDateComparable>=startDateSplit && endDateComparable<=endDateSplit)){
	            		found=true;
	            	}else{
	            		found=false;
	            	}
	            	if(!found){
	            		return found;
	            	}else{
	            		var startHour=item.starthour;
	            		var endHour=item.endhour;
	            		var startHourFilter=$scope.startHour;
	            		var endHourFilter=$scope.endHour;
	            		if(parseInt(startHour.substr(0,2))>=parseInt(startHourFilter.substr(0,2))){
	            			if(parseInt(startHour.substr(0,2))==parseInt(startHourFilter.substr(0,2))){
	            				if(parseInt(startHour.substr(3,4))<parseInt(startHourFilter.substr(3,4)))
	            					return false;
	            			}
	            			if(parseInt(endHour.substr(0,2))<=parseInt(endHourFilter.substr(0,2))){
	            				if(parseInt(endHour.substr(0,2))==parseInt(endHourFilter.substr(0,2))){
	            					if(parseInt(endHour.substr(3,4))>parseInt(endHourFilter.substr(3,4)))
	            						return false;
	            				}
	            				return true;
	            			}else{
	            				return false;
	            			}
	            		}else{
	            			return false;
	            		}
	            		//SI EL START HOUR ES MENOR AL DEL FILTRO
	            		//SI EL EN HOUR ES MAYOR O IGUAL AL DEL FILTRO
	            	}
	            }
	        });
	        //$scope.currentPage = 0;
	        // now group by pages
	        //$scope.groupToPages();
    	};
    	$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
  		};
  		$scope.open2 = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened2 = true;
  		};

  		 $scope.dateOptions = {
    		formatYear: 'yy',
    		startingDay: 1
  		};
  		$scope.hstep = 1;
  		$scope.mstep = 15;
  		$scope.startHour=1404374400000;
  		$scope.endHour=1404421200000

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
		$scope.startDate=new Date();
		$scope.endDate=new Date();
		if($stateParams.id){
			Event.getEventsByType({id2: $stateParams.id}).$promise.then(
				function success(data){
					$scope.events=data;
					$scope.groupedItems = [];
				    $scope.itemsPerPage = 4;
				    $scope.pagedItems = [];
				    $scope.currentPage = 0;
		        	for(var i=0; i<$scope.events.length; i++){
		        		/*var pos=$scope.events[i].startdate.indexOf('T');
		        		var startDate=$scope.events[i].startdate.substr(0,pos);
		        		var endDate=$scope.events[i].endate.substr(0,pos);*/
		        		if($scope.events[i].sdate === $scope.events[i].edate){
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
		        	//$scope.groupToPages();
				}
			);
			// calculate page in place
		   /* $scope.groupToPages = function () {
		        $scope.pagedItems = [];
		        for (var i = 0; i < $scope.filteredItems.length; i++) {
		            if (i % $scope.itemsPerPage === 0) {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i] ];
		            } else {
		                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
		            }
		        }
		    };*/

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
		    /*$scope.groupedItems = [];
		    $scope.itemsPerPage = 5;
		    $scope.pagedItems = [];
		    $scope.currentPage = 0;*/
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
		        //$scope.currentPage = 0;
		        // now group by pages
		        //$scope.groupToPages();
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