'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxoInfoCtrl', function ($scope,$stateParams, Pintxo){
		$scope.pintxo=Pintxo.get({id: $stateParams.id});
	});
