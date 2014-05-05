'use strict';

angular.module('xploreBilbaoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .state('pintxos',{
        url: '/pintxos',
        templateUrl: 'partials/pintxo.html',
        controller: 'PintxosCtrl'      
      })     
      .state('pintxoInfo',{
        url: '/pintxos/{id}',
        templateUrl: 'partials/pintxoInfo.html',
        controller: 'PintxoInfoCtrl'      
      })
      .state('restaurants',{
        url: '/restaurants',
        templateUrl: 'partials/restaurant.html',
        controller: 'RestaurantsCtrl'      
      })
      .state('restaurantInfo',{
        url: '/restaurants/{id}',
        templateUrl: 'partials/restaurantInfo.html',
        controller: 'RestaurantsInfoCtrl'      
      })
      .state('emblematicBuildings',{
        url: '/emblematicBuildings',
        templateUrl: 'partials/emblematicBuilding.html',
        controller: 'EmblematicBuildingsCtrl'      
      })
      /*
      .state('restaurantes.restaurantesInfo',{
        url: '/{id}',
        templateUrl: 'partials/restaurantInfo.html',
        controller: 'RestaurantsInfoCtrl'      
      }) **/
      .state('signup',{
        url: '/signUp',
        templateUrl: 'partials/prueba.html',
        controller: 'MainCtrl'      
      });
      
    $urlRouterProvider.otherwise('/');
  });
 /* .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/signUp'.{
        templateUrl: 'partials/prueba',
        controller: 'MainCtrl'      
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });*/


