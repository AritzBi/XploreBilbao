'use strict';

angular.module('xploreBilbaoApp')
	.controller('RestaurantsInfoCtrl', function ($scope,$stateParams, $sce, Restaurant,HosteleryComments,$modal,$rootScope,Auth){
			    var user=Auth.currentUser();
			    $scope.max=5;


		Restaurant.get({id: $stateParams.id}).$promise.then(                                                                                              
			function success (data) {
			    $scope.overstar=5;
				$scope.restaurant=data;
				$scope.restaurant.NOTE=Math.round( $scope.restaurant.NOTE * 10 ) / 10;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.restaurant.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				HosteleryComments.query({id: $scope.restaurant.id}).$promise.then(
					function success(comments){
						$scope.comments = comments;
					//$scope.comments.$promise.then
						var commentFound=false;
						var commentNumber=-1;
						console.log($scope.comments.length);
						for(var i=0;i<$scope.comments.length && !commentFound;i++){
							if(comments[i].member_id === user.id){
								commentFound=true;
								commentNumber=i;
							}
						}
						$scope.isReadonly=false;
						$scope.rate=5;
						if(commentFound){
							$scope.data={comment: $scope.comments[commentNumber].comment}
							$scope.overstar=$scope.comments[commentNumber].NOTE;
						}else{
							$scope.data={comment:''};
						}
					}
				);

			    $scope.hoveringOver= function(value){
			      $scope.overstar=value;
			      $scope.percent=100*(value / $scope.max);
			    };

			    $scope.hoveringLeave=function(value){
			    	$scope.overstar=value;
			    }

			    $scope.ratingStates = [
			    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
			    ];

				$scope.createComment = function() {
		    		console.log($scope.overstar);
		    		HosteleryComments.save({note: $scope.overstar, comment: $scope.data.comment, hostelery_id: $scope.restaurant.id },function(comment){
      					$scope.comments.push(comment);
      				});
		    	};
		    	/**
		    	var instance=$modal.open({
		    		templateUrl: 'partials/createComment.html',
		    		controller: 'CreateCommentCtrl',
		    		resolve: {
		    			hostelery_id: function(){ return $scope.restaurant.id }
		    		}
		    	}).result.then(function (data){
		    		console.log($scope.comments);
		    		$scope.comments.push(data);
		    	}, function(){

		    	});**/
			});
		
	});
