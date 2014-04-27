'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxoInfoCtrl', function ($scope,$stateParams, $sce, Pintxo, HosteleryComments){
		Pintxo.get({id: $stateParams.id}).$promise.then(
			function success (data) {
				$scope.pintxo=data;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.pintxo.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				$scope.comments = HosteleryComments({id: $scope.pintxo.id});
			});

		$scope.login = function createComment(){
    		var instance=$modal.open({
    			templateUrl: 'partials/login.html',
    			controller: 'LoginCtrl',
    		});
    	};

	});
