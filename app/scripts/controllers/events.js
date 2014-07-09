'use strict';

angular.module('xploreBilbaoApp')
	.controller('EventsCtrl', function ($scope,$stateParams,Event, eventsCategory, $filter, $translate,newRoute,datepickerPopupConfig,$locale,inRoute){	    
		inRoute.setInRoute(false);
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
	            		var startHour_hour=parseInt(startHour.substr(0,2));
	            		var startHour_minutes=parseInt(startHour.substr(3,4));
	            		var endHour=item.endhour;
	            		var endHour_hour=parseInt(endHour.substr(0,2));
	            		var endHour_minutes=parseInt(endHour.substr(3,4))
	            		var startHourFilter=$scope.startHour;
	            		var startHourFilter_hour=new Date(startHourFilter).getHours();
	            		var startHourFilter_minutes=new Date(startHourFilter).getMinutes();
	            		var endHourFilter=$scope.endHour;
	            		var endHourFilter_hour=new Date(endHourFilter).getHours();
	            		var endHourFilter_minutes=new Date(endHourFilter).getMinutes();
	            		if(startHour_hour >= startHourFilter_hour){
	            			if(startHour_hour === startHourFilter_hour){
	            				if(startHour_minutes > startHourFilter_minutes)
	            					return false;
	            			}
	            			console.log(endHourFilter_hour);
	            			console.log(endHour_hour);
	            			if(endHour_hour >= 0 && endHour_hour <= 3){
	            				endHour_hour=endHour_hour+24;
	            			}
	            			if(endHourFilter_hour >= 0 && endHourFilter_hour <= 3){
	            				console.log("añado al friltrol");
	            				endHourFilter_hour=endHourFilter_hour+24;
	            			}
	            			if(endHour_hour <= endHourFilter_hour){
	            				if(endHour_hour === endHourFilter_hour){
	            					console.log("Llego aqui");
	            					if(endHour_minutes > endHourFilter_minutes)
	            						return false;
	            				}
	            				return true;
	            			}else{
	            				return false;
	            			}
	            		}else{
	            			return false;
	            		}
	            	}
	            }
	        });
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
		        	for(var i=0; i<$scope.events.length; i++){
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
				}
			);
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