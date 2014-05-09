'use strict';

angular.module('xploreBilbaoApp')
  .factory('Event', function ($resource) {
    return $resource('/api/events/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
    });
  });