'use strict';

angular.module('xploreBilbaoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.router',
  'pascalprecht.translate',
  'leaflet-directive',
  'truncate',
  'snap'
])
  .config( function ($stateProvider, $urlRouterProvider, $translateProvider, snapRemoteProvider) {
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
        url: '/events/{id}',
        templateUrl: 'partials/event.html',
        controller: 'EventsCtrl'      
      })
      .state('museums',{
        url: '/museums',
        templateUrl: 'partials/museum.html',
        controller: 'MuseumsCtrl'      
      })
      .state('museumInfo',{
        url: '/museums/{id}',
        templateUrl: 'partials/museumInfo.html',
        controller: 'MuseumInfoCtrl'      
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
      .state('personalRoute.routeDetails',{
        url: '/routeDetails/:hasWalkingPath/:origin',
        templateUrl: 'partials/routeDetails.html',
        controller: 'RouteDetails'      
      })
      .state('signup',{
        url: '/signUp',
        templateUrl: 'partials/prueba.html',
        controller: 'MainCtrl'      
      });
      
    $urlRouterProvider.otherwise('/');
    $translateProvider.useUrlLoader('language/translation.json');
    $translateProvider.preferredLanguage('es');
  });



