'use strict';

angular.module('xploreBilbaoApp')
  .factory('restaurantsCategory', function ($resource) {
    return $resource('/xplorebilbao/api/restaurantsCategory/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });