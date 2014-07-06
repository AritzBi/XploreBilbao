'use strict';

angular.module('xploreBilbaoApp')
	.controller('EventInfoCtrl', function ($scope,$stateParams, $sce, Event, $translate){
		Event.get({id: $stateParams.id}).$promise.then(                                                                                              
			function success (data) {
				$scope.event=data;
				console.log(data);
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.event.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				if($scope.event.startdate === $scope.event.endate){
        			$scope.event.showEndDate=false;
        		}else{
        			$scope.event.showEndDate=true;
        		}
        		if($scope.event.range_prices){
        			$scope.event.price=$scope.event.lowprice+"€-"+$scope.event.highprice;
        		}else{
        			$scope.event.price=$scope.event.lowprice;	
        		}
		});
		$scope.getLang=function(){
			var lang=$translate.use();
			return lang;
		};
});