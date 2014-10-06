'use strict';

angular.module('xploreBilbaoApp')
  .factory('User', function ($resource) {
    return $resource('/xplorebilbao/api/users/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });