'use strict';

angular.module('xploreBilbaoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.router',
  'pascalprecht.translate',
  'leaflet-directive'
])
  .config( function ($stateProvider, $urlRouterProvider, $translateProvider) {
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
      .state('buildingInfo',{
        url: '/building/{id}',
        templateUrl: 'partials/buildingInfo.html',
        controller: 'EmblematicBuildingInfoCtrl'      
      })
      .state('events',{
        url: '/events',
        templateUrl: 'partials/event.html',
        controller: 'EventsCtrl'      
      })
      .state('personalRoute',{
        url: '/personalRoute',
        templateUrl: 'partials/route.html',
        controller: 'RouteCtrl'      
      })      
      .state('personalRoute.topRoutes',{
        templateUrl: 'partials/topRoutes.html',
        controller: 'TopRoutesCtrl'      
      })
      .state('personalRoute.myRoutes',{
        templateUrl: 'partials/myRoutes.html',
        controller: 'MyRoutesCtrl'      
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
    /*$translateProvider.translations('en',{
      test: 'test'
    });
    $translateProvider.translations('es',{
      test: 'prueba'
    });
    $translateProvider.preferredLanguage('es');*/
    $translateProvider.useUrlLoader('language/translation.json');
    $translateProvider.preferredLanguage('en');
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


