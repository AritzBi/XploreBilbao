'use strict';

angular.module('xploreBilbaoApp')
	.controller('RestaurantsInfoCtrl', function ($scope,$stateParams, $sce, Restaurant,HosteleryComments,$modal,$rootScope){
		Restaurant.get({id: $stateParams.id}).$promise.then(
			function success (data) {
				$scope.restaurant=data;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.restaurant.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				$scope.comments = HosteleryComments.query({id: $scope.restaurant.id});
				console.log("Hola"+$scope.comments)
				$scope.createComment = function createComment(){
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

		    	});

	    	};
			});
		
	});
