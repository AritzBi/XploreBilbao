'use strict';

angular.module('xploreBilbaoApp')
  .controller('SignupCtrl', function ($scope, Auth, $location,$modalInstance) {
    $scope.user = {};
    $scope.errors = false;

    $scope.register = function(form) {
      console.log("llego aqui");
      $scope.submitted = true;
      $scope.errors = false;
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          surname: $scope.user.surname,
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $modalInstance.close();
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = true;
        });
      }
    };
    $scope.cancel=function(){
      $modalInstance.dismiss();
    };
  });