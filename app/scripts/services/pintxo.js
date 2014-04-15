'use strict';

angular.module('xploreBilbaoApp')
  .factory('Pintxo', function ($resource) {
    return $resource('/api/pintxos/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });