'use strict';

angular.module('xploreBilbaoApp')
	.controller('RestaurantsInfoCtrl', function ($scope,$stateParams, $sce, Restaurant,HosteleryComments){
		Restaurant.get({id: $stateParams.id}).$promise.then(
			function success (data) {
				$scope.restaurant=data;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.restaurant.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				$scope.comments = HosteleryComments({id: $scope.restaurant.id});
			});
	});
