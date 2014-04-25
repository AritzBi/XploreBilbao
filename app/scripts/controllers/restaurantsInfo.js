'use strict';

angular.module('xploreBilbaoApp')
	.controller('RestaurantsInfoCtrl', function ($scope,$stateParams, Restaurant){
		$scope.restaurant=Restaurant.get({id: $stateParams.id});
	});
