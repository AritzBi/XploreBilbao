'use strict';

angular.module('xploreBilbaoApp')
  .factory('Event', function ($resource) {
    return $resource('/xplorebilbao/api/events/:id/:id2', {
      id: '@id',
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      getEventsByType:{
        method: 'GET',
        params:{
          id:'getEventsByType'
        },
        isArray: true
      }
    });
  });