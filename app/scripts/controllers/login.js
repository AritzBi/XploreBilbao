'use strict';

angular.module('xploreBilbaoApp')
	.controller('LoginCtrl', function ($scope,Auth,$modalInstance){
		$scope.user = {};
		$scope.errors={};
		$scope.login=function(form){
			if(form.$valid){
				Auth.login({
					username: $scope.user.username,
					password: $scope.user.password
				})
				.then(function(data){
					$modalInstance.close();
				},function(err){
					err=err.data;	
					$scope.errors.other=err.message;
				});
			}
		};

		$scope.cancel=function(){
			$modalInstance.dismiss();
		};
	});

