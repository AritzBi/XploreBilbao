'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxosCtrl', function ($scope,Pintxo, pintxosCategory){
		$scope.pintxos=Pintxo.query();
		$scope.pintxosCategory=pintxosCategory.query();

		/*$scope.search={};
		$scope.searchBy=function(){
			return function(pintxo){
				console.log(pintxo.first_type_es);
				if($scope.search[pintxo.first_type_es]===true){
					return true;
				}
			}
		};*/
	})
	.filter('customFilter',function(){
		return function(items,types){
			var filtered=[];
			angular.forEach(types, function(category){
				if(category.isActivated){
					angular.forEach(items, function(item){
						if(item.first_type_es === category.first_type_es){
							filtered.push(item);
						}
					});
				}
			});
			return filtered;
		};
	});
