'use strict';

angular.module('xploreBilbaoApp')
  .factory('eventsCategory', function ($resource) {
    return $resource('/xplorebilbao/api/eventsCategory/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },      
      findMainCategories: {
        method: 'GET',
        params: {
          id:'findMainCategories'
        },
        isArray: true
      },      
      findSubCategories: {
        method: 'GET',
        params: {
          id:'findSubCategories'
        },
        isArray: true
      }
    });
  });