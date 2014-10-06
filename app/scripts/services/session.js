'use strict';

angular.module('xploreBilbaoApp')
  .factory('Session', function ($resource) {
    return $resource('/xplorebilbao/api/session/');
  });