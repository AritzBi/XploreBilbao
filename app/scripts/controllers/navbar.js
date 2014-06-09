'use strict';

angular.module('xploreBilbaoApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location, $modal) {    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.login = function login(){
    	var instance=$modal.open({
    		templateUrl: 'partials/login.html',
    		controller: 'LoginCtrl',
    	});
    };
    $scope.signup = function signup(){
      var instance=$modal.open({
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
      });
    };
    $scope.logout = function() {
      Auth.logout();
    };
    $scope.activarCreacionRutas = function() {
      $scope.opts.disable="none";
    };


  });
