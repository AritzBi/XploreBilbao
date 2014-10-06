'use strict';

angular.module('xploreBilbaoApp')
  .factory('Pintxo', function ($resource) {
    return $resource('/xplorebilbao/api/pintxos/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });