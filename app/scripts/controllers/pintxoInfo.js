'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxoInfoCtrl', function ($scope,$stateParams, $sce, Pintxo, HosteleryComments, Auth, $translate){
			    var user=Auth.currentUser();
			    $scope.max=5;

		Pintxo.get({id: $stateParams.id}).$promise.then(                                                                                              
			function success (data) {
				$scope.pintxo=data;
				$scope.pintxo.NOTE=Math.round( $scope.pintxo.NOTE * 10 ) / 10;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.pintxo.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				HosteleryComments.query({id: $scope.pintxo.id}).$promise.then(
					function success(comments){
						$scope.comments = comments;
						var commentFound=false;
						var commentNumber=-1;
						for(var i=0;i<$scope.comments.length && !commentFound;i++){
							if(comments[i].member_id === user.id){
								commentFound=true;
								commentNumber=i;
							}
						}
						$scope.isReadonly=false;
						$scope.rate=5;
						if(commentFound){
							$scope.myComment=$scope.comments[commentNumber];
							$scope.comments.splice(commentNumber,1);
							$scope.isComment=true;
						}else{
							$scope.myComment={comment:'',note: 0};
							$scope.isComment=false;	
						}

					    $scope.ratingStates = [
					    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
					    ];

						$scope.createComment = function() {
				    		HosteleryComments.save({note: $scope.myComment.note, comment: $scope.myComment.comment, hostelery_id: $scope.pintxo.id },function(comment){
		      					$scope.myComment=comment;
		      					$scope.isComment=true;
		      					$scope.pintxo.NOTE=comment.avg;
		      				});
				    	};
				    	$scope.editComment = function() {
				    		HosteleryComments.update($scope.myComment,function(note){
		      					$scope.pintxo.NOTE=note.avg;
		      				});
				    	};
					}

				);

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
		$scope.getLang=function(){
				var lang=$translate.use();
			return lang;
		};
	});
