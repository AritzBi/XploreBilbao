'use strict';

angular.module('xploreBilbaoApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location, $modal) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'home',
      'icon':  ''
    },
    {
      'title': 'Restaurantes',
      'state': 'restaurants',
      'icon':  ''
    },
    {
      'title': 'Museos',
      'state': 'museos',
      'icon':  ''
    },
    {
      'title': 'Bares de pintxos',
      'state': 'pintxos',
      'icon':  ''
    },
    {
      'title': 'Edificios emblemáticos',
      'state': 'emblematicBuildings',
      'icon':  ''
    },
    {
      'title': 'Eventos',
      'state': 'events',
      'icon': ''
    },
    {
      'title': 'Ruta personalizada',
      'state': 'personalRoute.topRoutes',
      'icon': ''
    }
    ];
    
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
  });
