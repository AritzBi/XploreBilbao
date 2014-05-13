'use strict';

angular.module('xploreBilbaoApp')
  .factory('Routes', function ($resource) {
    return $resource('/api/routes/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      getSubwayLines:{
        method: 'GET',
        params: {
          id:'getSubwayLines'
        },
        isArray: true
      },
      getSubwayEntrances: {
        method: 'GET',
      },
      getTramLines:{
        method: 'GET',
      },
      getTramStops:{
        method: 'GET',
      }
    });
  });