'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxoInfoCtrl', function ($scope,$stateParams, $sce, Pintxo){
		Pintxo.get({id: $stateParams.id}).$promise.then(
			function success (data) {
				$scope.pintxo=data;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.pintxo.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
			});

	});
