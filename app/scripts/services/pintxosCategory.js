'use strict';

angular.module('xploreBilbaoApp')
  .factory('pintxosCategory', function ($resource) {
    return $resource('/xplorebilbao/api/pintxosCategory/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });