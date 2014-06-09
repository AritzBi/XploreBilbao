'use strict';

angular.module('xploreBilbaoApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location, $modal,eventsCategory, $translate) {

    /*$scope.eventsCategory=eventsCategory.query().$promise.then(
      function success(categories){
        console.log("hola");
        console.log(categories);
      }

    );  */
    $scope.getLang=function(){
      var lang=$translate.use();
      return lang;
    };
    $scope.mainCategories=eventsCategory.findMainCategories().$promise.then(
      function success(mainCategories){
        $scope.mainCategories=mainCategories;
      }
    );  
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
