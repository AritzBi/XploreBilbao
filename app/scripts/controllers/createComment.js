'use strict';

angular.module('xploreBilbaoApp')
  .controller('CreateCommentCtrl', function ($scope, $rootScope, $location, $modalInstance, hostelery_id,HosteleryComments) {
    $scope.rate=5;
    $scope.max=5;
    $scope.isReadonly=false;
    $scope.data={comment:''};
    $scope.overstar=0;

    $scope.hoveringOver= function(value){
      $scope.overstar=value;
      $scope.percent=100*(value / $scope.max);
    };

    $scope.ratingStates = [
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
    ];

    $scope.createComment = function() {
      console.log($scope.data.comment);
      console.log($scope.overstar);
      console.log($rootScope.currentUser);
      console.log(hostelery_id)
      HosteleryComments.save({note: $scope.overstar, comment: $scope.data.comment, hostelery_id: hostelery_id},function(comment){
        console.log(comment);
        $modalInstance.close(comment);
      });
    };


    $scope.cancel=function($event){
      $event.preventDefault();
      $modalInstance.dismiss();
    };
});