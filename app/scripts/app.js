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


