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
        params: {
          id:'getSubwayEntrances'
        },
        isArray: true
      },
      getTramLines:{
        method: 'GET',
        params:{
          id:'getTramLines'
        },
        isArray: true
      },
      getTramStops:{
        method: 'GET',
        params:{
          id:'getTramStops'
        },
        isArray: true
      },
      getWalkRoute:{
        method: 'GET',
        params:{
          id:'getWalkRoute'
        }
      },
      getInfoRoutes:{
        method: 'GET',
        params:{
          id:'getInfoRoutes'
        }
      }
    });
  });