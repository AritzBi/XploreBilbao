'use strict';

angular.module('xploreBilbaoApp')
  .factory('buildingsCategory', function ($resource) {
    return $resource('/api/buildingTypes/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });