'use strict';

angular.module('xploreBilbaoApp')
  .factory('HosteleryComments', function ($resource) {
    return $resource('/xplorebilbao/api/hosteleryComments/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
    });
  });