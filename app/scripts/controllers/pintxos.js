'use strict';

angular.module('xploreBilbaoApp')
	.controller('PintxosCtrl', function ($scope,Pintxo, pintxosCategory, $filter,$translate,newRoute,inRoute){
		Pintxo.query().$promise.then(
	    	function success (data) {
	    		$scope.pintxos=data;
	    		for(var i = 0; i < $scope.pintxos.length; i++){
	    			if($scope.pintxos[i].note === null){
	    				$scope.pintxos[i].note=0;
	    			}
	    		}
	    		$scope.pintxosCategory=pintxosCategory.query();
	    		$scope.filterByCategory();

	    	}
	    );
	    inRoute.setInRoute(false);
	    $scope.filteredItems = [];
	   	/*$scope.groupedItems = [];
	    $scope.itemsPerPage = 3;
	    $scope.pagedItems = [];
	    $scope.currentPage = 0;*/
	    $scope.searchText = "";
	    $scope.predicate=""; 
		var orderBy = $filter('orderBy');
	   	$scope.getLang=function(){
	  		var lang=$translate.use();
	    	return lang;
	    };

	   	$scope.addLocation=function(id){
	    	var found=false;
	    	for(var i=0;i<$scope.filteredItems.length&&!found;i++){
	    		if($scope.filteredItems[i].id===id){
	    			found=true;
					newRoute.addLocation($scope.filteredItems[i]);
	    		}
	    	}
	    }
	        // init the filtered items
    	$scope.filterByCategory = function () {
	        $scope.filteredItems = $filter('filter')($scope.pintxos, function (item) {
	        	var found=false;
	            angular.forEach($scope.pintxosCategory, function(category){
	                    if(category.isActivated){
	                            if(item.first_type_es === category.first_type_es){
	                                found=true;
	                            }
	                    }
	                });
	                return found;
	        });
	        //$scope.currentPage = 0;
	        // now group by pages
	        //$scope.groupToPages();
	        $scope.order();
    	};
		    // calculate page in place
	    /*$scope.groupToPages = function () {
	        $scope.pagedItems = [];
	        for (var i = 0; i < $scope.filteredItems.length; i++) {
	            if (i % $scope.itemsPerPage === 0) {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
	            } else {
	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
	            }
	        }
	    };*/
	   	$scope.order = function () {
	   		$scope.filteredItems = orderBy($scope.filteredItems, $scope.predicate, false);
	   		//$scope.currentPage = 0;
	        // now group by pages
	        //$scope.groupToPages();
	    };
	    
	    /*$scope.range = function (start, end) {
	        var ret = [];
	        if (!end) {
	            end = start;
	            start = 0;
	        }
	        for (var i = start; i < end; i++) {
	            ret.push(i);
	        }
	        return ret;
	    };
	    
	    $scope.prevPage = function () {
	        if ($scope.currentPage > 0) {
	            $scope.currentPage--;
	        }
	    };
	    
	    $scope.nextPage = function () {
	        if ($scope.currentPage < $scope.pagedItems.length - 1) {
	            $scope.currentPage++;
	        }
	    };
	    
	    $scope.setPage = function () {
	        $scope.currentPage = this.n;
	    }; 
	   	$scope.arePages = function(){
	    	if($scope.filteredItems.length === 0){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    }*/
	});