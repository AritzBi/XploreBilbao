'use strict';

angular.module('xploreBilbaoApp')
  .factory('Routes', function ($resource) {
    return $resource('/api/routes/:id/:id2', {
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
        },
        isArray:true
      },
      getTopRoutes:{
        method: 'GET',
        params:{
          id:'getTopRoutes'
        },
        isArray:true
      },
      getWalkingPathByRouteId:{
        method: 'GET',
        params:{
          id:'getWalkingPathByRouteId'
        }
      },
      getRouteDetails:{
        method: 'GET',
        params:{
          id:'getRouteDetails'
        }
      },
      getFollowingRoutes:{
        method: 'GET',
        params:{
          id:'getFollowingRoutes'
        },
        isArray:true
      },
      getMyRoutes:{
        method: 'GET',
        params:{
          id:'getMyRoutes'
        },
        isArray:true
      },
      followRoute:{
        method:'POST',
        params: {id:'followRoute'}
      },
      unfollowRoute:{
        method:'POST',
        params: {id:'unfollowRoute'}
      }
    });
  });