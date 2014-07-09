angular.module('xploreBilbaoApp')
	.controller('RecommendationCtrl', function ($scope,$stateParams, $filter, $translate,$locale,$modalInstance, Routes){	    
	   	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };
		$scope.dateOptions = {
    		formatYear: 'yy',
    		startingDay: 1
  		};
  		var maxDateMilis=new Date().getTime()+3600*1000*7*24;
  		var date= new Date(maxDateMilis);
  		console.log(date);
  		$scope.calendar={opened: false, state: 1, type: "ocio", company: "solo", startDate: new Date(), maxDate: date};
  		$scope.open = function($event) {
  			console.log("aqui si");
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.calendar.opened = true;
  		};
    	$scope.cancel=function(){
			$modalInstance.dismiss();
		};
		$scope.nextState=function(){
			$scope.calendar.state=$scope.calendar.state+1;
		}
		$scope.consult=function(){
			$scope.calendar.startDate=$scope.calendar.startDate.getTime();
			Routes.getRecommendation($scope.calendar).$promise.then(
				function(data){
					$modalInstance.close(data);
				}
			);
		}
	});	