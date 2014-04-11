'use strict';

angular.module('xploreBilbaoApp')
	.controller('LoginCtrl', function ($scope, $modalInstance){
		$scope.login=function(form){
			$scope.errors={};
			if(form.$valid){
				Auth.login({
					email:$scope.user.email,
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

