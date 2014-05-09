'use strict';

angular.module('xploreBilbaoApp')
	.controller('TranslateController', function ($scope, $translate) {
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
});