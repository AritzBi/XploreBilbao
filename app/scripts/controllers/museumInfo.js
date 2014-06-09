'use strict';

angular.module('xploreBilbaoApp')
	.controller('MuseumInfoCtrl', function ($scope,$stateParams, $sce, EmblematicBuilding, BuildingComments, Auth, $translate){
			    var user=Auth.currentUser();
			    $scope.max=5;

		EmblematicBuilding.get({id: $stateParams.id}).$promise.then(                                                                                              
			function success (data) {
				$scope.museum=data;
				$scope.museum.NOTE=Math.round( $scope.museum.NOTE * 10 ) / 10;
				$scope.url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCAu20ELj_7PB4PeBG1rlBLJOnHsWJ1z_w&q=" + $scope.museum.address;
				$scope.url = $sce.trustAsResourceUrl($scope.url);
				BuildingComments.query({id: $scope.museum.id}).$promise.then(
					function success(comments){
						console.log(comments);
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
						$scope.createComment = function() {
							console.log("hola");
				    		BuildingComments.save({note: $scope.myComment.note, comment: $scope.myComment.comment, building_id: $scope.museum.id },function(comment){
		      					$scope.myComment=comment;
		      					$scope.isComment=true;
		      					$scope.museum.NOTE=comment.avg;
		      				});
				    	};
				    	$scope.editComment = function() {
				    		BuildingComments.update($scope.myComment,function(note){
		      					$scope.museum.NOTE=note.avg;
		      				});
				    	};
					}

				);
		});
		$scope.getLang=function(){
				var lang=$translate.use();
			return lang;
		};
	});
