'use strict';

angular.module('xploreBilbaoApp')
	.controller('LoginCtrl', function ($scope,Auth,$modalInstance,$translate){
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
					$scope.errors={};
					err=err.data.message;
					console.log(err);
					if(err === "This username is not registered."){
						console.log("aqui");
						$scope.errors.loginError=true;
					}else{
						if(err === "Incorrect password."){
							$scope.errors.passwordError=true;
						}
						else{
							$scope.errors.missing=true;
						}
					}

					//$scope.errors.other=err.message;
				});
			}
		};

		$scope.cancel=function(){
			$modalInstance.dismiss();
		};
		$scope.getLang=function(){
			var lang=$translate.use();
			return lang;
		};
	});

