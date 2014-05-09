'use strict';

angular.module('xploreBilbaoApp')
  .factory('eventsCategory', function ($resource) {
    return $resource('/api/eventsCategory/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
    });
  });