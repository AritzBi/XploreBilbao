'use strict';

angular.module('xploreBilbaoApp')
  .factory('buildingsCategory', function ($resource) {
    return $resource('/xplorebilbao/api/buildingTypes/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
	  });
  });