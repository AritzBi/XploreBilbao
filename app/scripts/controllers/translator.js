'use strict';

angular.module('xploreBilbaoApp')
	.controller('TranslateController', function ($scope, $translate, $locale,tmhDynamicLocale) {
  $scope.changeLanguage = function (langKey) {
    tmhDynamicLocale.set(langKey).then(function(success){$translate.use(langKey);});
  };
  tmhDynamicLocale.set('es').then(function(success){});
});