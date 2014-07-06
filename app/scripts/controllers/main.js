'use strict';

angular.module('xploreBilbaoApp')
  .controller('MainCtrl', function ($scope, $http,inRoute) {
  	inRoute.setInRoute(false);
  });
