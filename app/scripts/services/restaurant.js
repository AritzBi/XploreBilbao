'use strict';

angular.module('xploreBilbaoApp')
  .factory('Restaurant', function ($resource) {
    return $resource('/xplorebilbao/api/restaurants/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });