'use strict';

angular.module('xploreBilbaoApp')
  .factory('BuildingComments', function ($resource) {
    return $resource('/api/buildingComments/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
    });
  });