'use strict';

angular.module('xploreBilbaoApp')
  .factory('EmblematicBuilding', function ($resource) {
    return $resource('/xplorebilbao/api/emblematicBuildings/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      getMuseums:{
        method: 'GET',
        params:{
          id:'getMuseums'
        },
        isArray: true
      }
	  });
  });